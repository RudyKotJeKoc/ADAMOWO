<?php
/**
 * Radio Adamowo - Optimized CSRF Token API
 * Enhanced security implementation with consolidated best practices
 */

define('RADIO_ADAMOWO_API', true);
require_once 'config-optimized.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $dbConfig = OptimizedDatabaseConfig::getInstance();
    
    // Get client identifier for rate limiting
    $clientIP = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
    $clientId = hash('sha256', $clientIP . $userAgent);
    
    // Check rate limiting
    if (!$dbConfig->checkRateLimit($clientId, 'csrf')) {
        http_response_code(429);
        echo json_encode([
            'error' => 'Rate limit exceeded',
            'message' => 'Too many token requests. Please wait before requesting a new token.',
            'code' => 'RATE_LIMIT_EXCEEDED',
            'retryAfter' => 60
        ]);
        exit;
    }
    
    // Generate secure CSRF token
    $token = $dbConfig->generateCSRFToken();
    
    // Success response
    echo json_encode([
        'success' => true,
        'token' => $token,
        'expires' => time() + $dbConfig->getConfig('app.csrf_token_lifetime'),
        'timestamp' => time(),
        'version' => '3.0.0'
    ]);
    
} catch (Exception $e) {
    error_log('CSRF Token API Error: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'error' => 'Internal server error',
        'message' => 'Unable to generate token',
        'code' => 'INTERNAL_ERROR',
        'timestamp' => time()
    ]);
}
?>