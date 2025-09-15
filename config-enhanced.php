<?php
/**
 * Radio Adamowo - Enhanced Database Configuration
 * Comprehensive security implementation with environment-based config
 */

// Prevent direct access
if (!defined('RADIO_ADAMOWO_API')) {
    http_response_code(403);
    exit('Direct access forbidden');
}

class DatabaseConfig {
    private static $instance = null;
    private $connection = null;
    private $config = [];
    
    private function __construct() {
        $this->loadConfiguration();
        $this->validateConfiguration();
    }
    
    public static function getInstance(): self {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function loadConfiguration(): void {
        // Load from environment variables (production)
        $this->config = [
            'host' => getenv('DB_HOST') ?: '127.0.0.1',
            'port' => getenv('DB_PORT') ?: '3306',
            'name' => getenv('DB_NAME') ?: 'radio_adamowo',
            'user' => getenv('DB_USER') ?: 'radio_adamowo',
            'pass' => getenv('DB_PASS') ?: '',
            'charset' => getenv('DB_CHARSET') ?: 'utf8mb4',
            'frontend_url' => getenv('FRONTEND_URL') ?: 'https://radioadamowo.pl'
        ];
        
        // Fallback to local config for development
        if (empty($this->config['pass']) && file_exists(__DIR__ . '/.env.local')) {
            $this->loadLocalConfig();
        }
    }
    
    private function loadLocalConfig(): void {
        $localConfig = parse_ini_file(__DIR__ . '/.env.local', true);
        if ($localConfig && isset($localConfig['database'])) {
            $this->config = array_merge($this->config, $localConfig['database']);
        }
    }
    
    private function validateConfiguration(): void {
        $required = ['host', 'name', 'user', 'pass'];
        foreach ($required as $field) {
            if (empty($this->config[$field])) {
                throw new RuntimeException("Database configuration missing: {$field}");
            }
        }
    }
    
    public function getConnection(): PDO {
        if ($this->connection === null) {
            $this->connect();
        }
        return $this->connection;
    }
    
    private function connect(): void {
        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=%s',
            $this->config['host'],
            $this->config['port'],
            $this->config['name'],
            $this->config['charset']
        );
        
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::ATTR_PERSISTENT => false,
            PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => true,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET sql_mode='STRICT_TRANS_TABLES'"
        ];
        
        try {
            $this->connection = new PDO(
                $dsn,
                $this->config['user'],
                $this->config['pass'],
                $options
            );
            
            // Set timezone
            $this->connection->exec("SET time_zone = '+00:00'");
            
        } catch (PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            throw new RuntimeException("Database connection failed");
        }
    }
    
    public function getFrontendUrl(): string {
        return rtrim($this->config['frontend_url'], '/');
    }
    
    public function isLocalhost(): bool {
        return in_array($this->config['host'], ['127.0.0.1', 'localhost', '::1']);
    }
}

/**
 * Enhanced Security Manager
 */
class SecurityManager {
    private static $instance = null;
    private $db;
    private $rateLimitConfig = [
        'csrf_token' => ['limit' => 20, 'window' => 60],     // 20 requests per minute
        'add_comment' => ['limit' => 10, 'window' => 60],    // 10 comments per minute
        'get_comments' => ['limit' => 60, 'window' => 60]    // 60 requests per minute
    ];
    
    private function __construct() {
        $this->db = DatabaseConfig::getInstance()->getConnection();
        $this->initializeRateLimitTable();
    }
    
    public static function getInstance(): self {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function validateCSRFToken(string $token): bool {
        session_start();
        
        if (empty($_SESSION['csrf_token']) || empty($token)) {
            return false;
        }
        
        // Timing-safe comparison
        if (!hash_equals($_SESSION['csrf_token'], $token)) {
            return false;
        }
        
        // Token age validation (max 1 hour)
        $tokenAge = $_SESSION['csrf_token_time'] ?? 0;
        if (time() - $tokenAge > 3600) {
            $this->regenerateCSRFToken();
            return false;
        }
        
        return true;
    }
    
    public function generateCSRFToken(): string {
        session_start();
        
        $token = bin2hex(random_bytes(32));
        $_SESSION['csrf_token'] = $token;
        $_SESSION['csrf_token_time'] = time();
        
        return $token;
    }
    
    private function regenerateCSRFToken(): void {
        session_start();
        unset($_SESSION['csrf_token'], $_SESSION['csrf_token_time']);
    }
    
    public function checkRateLimit(string $action, string $identifier = null): bool {
        if (!isset($this->rateLimitConfig[$action])) {
            return true; // No rate limit configured
        }
        
        $config = $this->rateLimitConfig[$action];
        $clientId = $identifier ?: $this->getClientIdentifier();
        
        // Clean old entries
        $this->cleanOldRateLimitEntries($action, $config['window']);
        
        // Check current rate
        $stmt = $this->db->prepare("
            SELECT COUNT(*) as request_count
            FROM rate_limits
            WHERE action = ? AND client_id = ? AND created_at > DATE_SUB(NOW(), INTERVAL ? SECOND)
        ");
        
        $stmt->execute([$action, $clientId, $config['window']]);
        $result = $stmt->fetch();
        
        if ($result['request_count'] >= $config['limit']) {
            return false;
        }
        
        // Record this request
        $this->recordRateLimitEntry($action, $clientId);
        
        return true;
    }
    
    private function initializeRateLimitTable(): void {
        $this->db->exec("
            CREATE TABLE IF NOT EXISTS rate_limits (
                id INT AUTO_INCREMENT PRIMARY KEY,
                action VARCHAR(50) NOT NULL,
                client_id VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_action_client (action, client_id),
                INDEX idx_created (created_at)
            ) ENGINE=InnoDB
        ");
    }
    
    private function cleanOldRateLimitEntries(string $action, int $windowSeconds): void {
        $stmt = $this->db->prepare("
            DELETE FROM rate_limits 
            WHERE action = ? AND created_at < DATE_SUB(NOW(), INTERVAL ? SECOND)
        ");
        $stmt->execute([$action, $windowSeconds * 2]); // Keep 2x window for safety
    }
    
    private function recordRateLimitEntry(string $action, string $clientId): void {
        $stmt = $this->db->prepare("
            INSERT INTO rate_limits (action, client_id) VALUES (?, ?)
        ");
        $stmt->execute([$action, $clientId]);
    }
    
    private function getClientIdentifier(): string {
        // Use multiple factors for client identification
        $factors = [
            $_SERVER['REMOTE_ADDR'] ?? '',
            $_SERVER['HTTP_USER_AGENT'] ?? '',
            $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? ''
        ];
        
        return hash('sha256', implode('|', $factors));
    }
    
    public function sanitizeInput(string $input, int $maxLength = null): string {
        // Remove null bytes and control characters
        $cleaned = filter_var($input, FILTER_SANITIZE_STRING, FILTER_FLAG_NO_ENCODE_QUOTES);
        
        // Normalize whitespace
        $cleaned = preg_replace('/\s+/', ' ', trim($cleaned));
        
        // Apply length limit
        if ($maxLength && strlen($cleaned) > $maxLength) {
            $cleaned = substr($cleaned, 0, $maxLength);
        }
        
        return $cleaned;
    }
    
    public function validateDateInput(string $date): bool {
        // Validate date format YYYY-MM-DD
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
            return false;
        }
        
        $dateParts = explode('-', $date);
        return checkdate((int)$dateParts[1], (int)$dateParts[2], (int)$dateParts[0]);
    }
    
    public function escapeOutput(string $output): string {
        return htmlspecialchars($output, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    }
    
    public function validateOrigin(): bool {
        $allowedOrigins = [
            DatabaseConfig::getInstance()->getFrontendUrl(),
            'https://radioadamowo.pl',
            'https://www.radioadamowo.pl'
        ];
        
        // Allow localhost in development
        if (DatabaseConfig::getInstance()->isLocalhost()) {
            $allowedOrigins[] = 'http://localhost:3000';
            $allowedOrigins[] = 'http://127.0.0.1:3000';
        }
        
        $origin = $_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '';
        
        foreach ($allowedOrigins as $allowed) {
            if (strpos($origin, $allowed) === 0) {
                return true;
            }
        }
        
        return false;
    }
    
    public function setSecurityHeaders(): void {
        // CORS headers
        if ($this->validateOrigin()) {
            header('Access-Control-Allow-Origin: ' . ($_SERVER['HTTP_ORIGIN'] ?? ''));
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');
        }
        
        // Security headers
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: DENY');
        header('X-XSS-Protection: 1; mode=block');
        header('Referrer-Policy: strict-origin-when-cross-origin');
        header('Content-Security-Policy: default-src \'self\'; script-src \'self\' \'unsafe-inline\' https://cdn.tailwindcss.com https://cdnjs.cloudflare.com; style-src \'self\' \'unsafe-inline\' https://fonts.googleapis.com https://cdn.jsdelivr.net; font-src \'self\' https://fonts.gstatic.com; img-src \'self\' data: https:; media-src \'self\' https:; connect-src \'self\' https:');
        
        // Cache control for sensitive endpoints
        header('Cache-Control: no-cache, no-store, must-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');
    }
}

// Initialize constants
define('RADIO_ADAMOWO_API', true);

// Auto-start session with secure settings
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 3600, // 1 hour
        'path' => '/',
        'domain' => '',
        'secure' => !DatabaseConfig::getInstance()->isLocalhost(), // HTTPS only in production
        'httponly' => true,
        'samesite' => 'Strict'
    ]);
    
    session_start();
}

// Set timezone
date_default_timezone_set('UTC');
?>