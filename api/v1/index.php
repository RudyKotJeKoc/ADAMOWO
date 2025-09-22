<?php
/**
 * Radio Adamowo Unified API Router
 * Single entry point for all API endpoints following REST principles
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/rate_limiter.php';

class ApiRouter {
    private $routes = [];
    private $pdo;
    private $auth;
    private $rateLimiter;

    public function __construct() {
        $this->pdo = getApiDbConnection();
        $this->auth = new ApiAuth($this->pdo);
        $this->rateLimiter = new ApiRateLimiter($this->pdo);
    }

    public function route($method, $path, $callback) {
        $this->routes[$method][$path] = $callback;
    }

    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        
        // Remove /api/v1 prefix if present
        $path = preg_replace('/^\/api\/v1/', '', $path);
        
        if (isset($this->routes[$method][$path])) {
            try {
                return $this->routes[$method][$path]($this);
            } catch (Exception $e) {
                $this->error('Internal server error', 500);
            }
        }
        
        $this->error('Endpoint not found', 404);
    }

    public function success($data, $code = 200) {
        http_response_code($code);
        echo json_encode([
            'success' => true,
            'data' => $data,
            'timestamp' => date('c')
        ]);
        exit();
    }

    public function error($message, $code = 400) {
        http_response_code($code);
        echo json_encode([
            'success' => false,
            'error' => $message,
            'timestamp' => date('c')
        ]);
        exit();
    }

    public function getPdo() {
        return $this->pdo;
    }

    public function getAuth() {
        return $this->auth;
    }

    public function getRateLimiter() {
        return $this->rateLimiter;
    }
}

// Initialize router
$router = new ApiRouter();

// Define routes
$router->route('GET', '/csrf-token', function($router) {
    if (!$router->getRateLimiter()->checkRateLimit('csrf_token', 10, 60)) {
        $router->error('Rate limit exceeded', 429);
    }
    
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    $token = bin2hex(random_bytes(32));
    $_SESSION['csrf_token'] = $token;
    
    $router->success(['csrf_token' => $token]);
});

$router->route('GET', '/comments', function($router) {
    if (!$router->getRateLimiter()->checkRateLimit('comments_get', 60, 60)) {
        $router->error('Rate limit exceeded', 429);
    }
    
    try {
        $stmt = $router->getPdo()->prepare("
            SELECT id, author, content, created_at, is_verified, parent_id, likes, dislikes 
            FROM comments 
            WHERE is_approved = 1 
            ORDER BY created_at DESC 
            LIMIT 50
        ");
        $stmt->execute();
        $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $router->success(['comments' => $comments]);
    } catch (PDOException $e) {
        $router->error('Database error', 500);
    }
});

$router->route('POST', '/comments', function($router) {
    if (!$router->getRateLimiter()->checkRateLimit('comments_post', 5, 300)) {
        $router->error('Rate limit exceeded', 429);
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data || !isset($data['author'], $data['content'], $data['csrf_token'])) {
        $router->error('Missing required fields', 400);
    }
    
    // CSRF protection
    session_start();
    if (!hash_equals($_SESSION['csrf_token'] ?? '', $data['csrf_token'])) {
        $router->error('Invalid CSRF token', 403);
    }
    
    try {
        $stmt = $router->getPdo()->prepare("
            INSERT INTO comments (author, content, created_at, ip_address) 
            VALUES (?, ?, NOW(), ?)
        ");
        $stmt->execute([
            htmlspecialchars(trim($data['author'])),
            htmlspecialchars(trim($data['content'])),
            $_SERVER['REMOTE_ADDR'] ?? 'unknown'
        ]);
        
        $router->success(['message' => 'Comment added successfully'], 201);
    } catch (PDOException $e) {
        $router->error('Failed to add comment', 500);
    }
});

$router->route('GET', '/stream/status', function($router) {
    if (!$router->getRateLimiter()->checkRateLimit('stream_status', 120, 60)) {
        $router->error('Rate limit exceeded', 429);
    }
    
    $router->success([
        'status' => 'live',
        'current_time' => date('c'),
        'stream_name' => 'Radio Adamowo - Live Stream',
        'server_status' => 'online',
        'bitrate' => 128,
        'format' => 'mp3',
        'listeners' => rand(45, 89) // Simulated for demo
    ]);
});

// Handle the request
$router->handleRequest();