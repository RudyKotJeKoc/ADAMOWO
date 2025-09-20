<?php
/**
 * Radio Adamowo - Secure CSRF Token Generation API
 * Enhanced security with proper session management and rate limiting
 */

declare(strict_types=1);

session_start([
    'cookie_lifetime' => 86400,
    'gc_maxlifetime' => 86400,
    'cookie_secure' => isset($_SERVER['HTTPS']),
    'cookie_httponly' => true,
    'cookie_samesite' => 'Strict'
]);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// CORS configuration
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

header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // Only allow GET requests
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        http_response_code(405);
        echo json_encode([
            'error' => 'Method not allowed',
            'message' => 'Only GET requests are accepted',
            'code' => 'METHOD_NOT_ALLOWED'
        ]);
        exit;
    }
    
    // Enhanced rate limiting (30 tokens per minute per IP)
    $limit = 30;
    $time_frame = 60; // 1 minute
    $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
    
    $_SESSION['token_requests'] = $_SESSION['token_requests'] ?? [];
    
    // Clean old requests (older than time frame)
    $_SESSION['token_requests'] = array_filter($_SESSION['token_requests'], function ($timestamp) use ($time_frame) {
        return (time() - $timestamp) < $time_frame;
    });
    
    if (count($_SESSION['token_requests']) >= $limit) {
        http_response_code(429);
        echo json_encode([
            'error' => 'Rate limit exceeded',
            'message' => 'Too many token requests. Please wait before requesting another.',
            'code' => 'RATE_LIMIT_EXCEEDED',
            'retryAfter' => 60
        ]);
        exit;
    }
    
    $_SESSION['token_requests'][] = time();
    
    // Generate or refresh CSRF token
    $regenerate = $_GET['regenerate'] === 'true';
    
    if (empty($_SESSION['csrf_token']) || $regenerate) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        $_SESSION['csrf_token_time'] = time();
    }
    
    // Check token age (expire after 1 hour)
    $token_age = time() - ($_SESSION['csrf_token_time'] ?? 0);
    if ($token_age > 3600) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        $_SESSION['csrf_token_time'] = time();
    }
    
    echo json_encode([
        'status' => 'success',
        'token' => $_SESSION['csrf_token'],
        'expires_in' => 3600 - $token_age,
        'generated_at' => $_SESSION['csrf_token_time'] ?? time()
    ]);
    
} catch (Exception $e) {
    error_log("CSRF token generation error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'error' => 'Internal server error',
        'message' => 'Unable to generate CSRF token',
        'code' => 'INTERNAL_ERROR'
    ]);
}
