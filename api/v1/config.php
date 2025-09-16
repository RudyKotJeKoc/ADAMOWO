<?php
/**
 * Radio Adamowo Extended API - Configuration
 * REST API v1 Configuration and Base Classes
 */

declare(strict_types=1);

// CORS and Security Headers
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');

// CORS for frontend
$allowed_origins = [
    'http://localhost:3000',
    'http://localhost:4000',
    'https://radioadamowo.pl',
    getenv('FRONTEND_URL') ?: 'http://localhost:3000'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
}

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token');
header('Access-Control-Allow-Credentials: true');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection with error handling
function getApiDbConnection(): ?PDO 
{
    static $pdo = null;
    
    if ($pdo === null) {
        $host = getenv('DB_HOST') ?: '127.0.0.1';
        $dbname = getenv('DB_NAME') ?: 'radio_adamowo';
        $username = getenv('DB_USER') ?: 'root';
        $password = getenv('DB_PASS') ?: '';
        $port = getenv('DB_PORT') ?: '3306';
        
        $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";
        
        try {
            $pdo = new PDO($dsn, $username, $password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]);
        } catch (PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            return null;
        }
    }
    
    return $pdo;
}

// Base API Response Class
class ApiResponse 
{
    public static function success($data = null, string $message = 'Success', int $code = 200): void
    {
        http_response_code($code);
        echo json_encode([
            'success' => true,
            'message' => $message,
            'data' => $data,
            'timestamp' => date('c')
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }
    
    public static function error(string $message = 'Error', int $code = 400, $details = null): void
    {
        http_response_code($code);
        echo json_encode([
            'success' => false,
            'message' => $message,
            'details' => $details,
            'timestamp' => date('c')
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }
    
    public static function notFound(string $message = 'Resource not found'): void
    {
        self::error($message, 404);
    }
    
    public static function unauthorized(string $message = 'Unauthorized'): void
    {
        self::error($message, 401);
    }
    
    public static function forbidden(string $message = 'Forbidden'): void
    {
        self::error($message, 403);
    }
}

// Rate limiting enhanced
class ApiRateLimiter 
{
    private PDO $pdo;
    
    public function __construct(PDO $pdo) 
    {
        $this->pdo = $pdo;
    }
    
    public function checkRateLimit(string $action, int $maxRequests = 60, int $timeWindow = 3600): bool
    {
        $clientId = $this->getClientId();
        $windowStart = date('Y-m-d H:i:s', time() - $timeWindow);
        
        // Clean old records
        $this->cleanupOldRecords($timeWindow);
        
        // Count recent requests
        $stmt = $this->pdo->prepare("
            SELECT COUNT(*) as request_count 
            FROM rate_limits 
            WHERE action = ? AND client_id = ? AND created_at >= ?
        ");
        $stmt->execute([$action, $clientId, $windowStart]);
        $count = $stmt->fetchColumn();
        
        if ($count >= $maxRequests) {
            return false;
        }
        
        // Log this request
        $stmt = $this->pdo->prepare("
            INSERT INTO rate_limits (action, client_id, ip_address, user_agent_hash) 
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([
            $action,
            $clientId,
            $_SERVER['REMOTE_ADDR'] ?? 'unknown',
            hash('sha256', $_SERVER['HTTP_USER_AGENT'] ?? '')
        ]);
        
        return true;
    }
    
    private function getClientId(): string
    {
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
        return hash('sha256', $ip . $userAgent);
    }
    
    private function cleanupOldRecords(int $timeWindow): void
    {
        $cutoff = date('Y-m-d H:i:s', time() - $timeWindow * 2);
        $stmt = $this->pdo->prepare("DELETE FROM rate_limits WHERE created_at < ?");
        $stmt->execute([$cutoff]);
    }
}

// Authentication middleware
class ApiAuth 
{
    private PDO $pdo;
    
    public function __construct(PDO $pdo) 
    {
        $this->pdo = $pdo;
    }
    
    public function authenticate(): ?array
    {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? '';
        
        if (!preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            return null;
        }
        
        $token = $matches[1];
        // For now, implement basic token validation
        // In production, use JWT or OAuth2
        
        return ['user_id' => 1, 'role' => 'user', 'token' => $token];
    }
    
    public function requireAuth(): array
    {
        $user = $this->authenticate();
        if (!$user) {
            ApiResponse::unauthorized('Authentication required');
        }
        return $user;
    }
    
    public function requireAdmin(): array
    {
        $user = $this->requireAuth();
        if ($user['role'] !== 'admin') {
            ApiResponse::forbidden('Admin access required');
        }
        return $user;
    }
}

// Validation utilities
class ApiValidator 
{
    public static function validateDate(string $date): bool
    {
        $d = DateTime::createFromFormat('Y-m-d', $date);
        return $d && $d->format('Y-m-d') === $date;
    }
    
    public static function validateEmail(string $email): bool
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }
    
    public static function sanitizeText(string $text, int $maxLength = 1000): string
    {
        $text = trim($text);
        $text = htmlspecialchars($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        return mb_substr($text, 0, $maxLength);
    }
    
    public static function validatePagination($page, $limit): array
    {
        $page = max(1, (int)$page);
        $limit = min(100, max(1, (int)$limit));
        return ['page' => $page, 'limit' => $limit, 'offset' => ($page - 1) * $limit];
    }
}