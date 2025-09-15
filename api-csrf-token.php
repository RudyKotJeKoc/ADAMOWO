<?php
/**
 * Enhanced CSRF Token Endpoint
 * Radio Adamowo - Comprehensive Security Implementation
 */

require_once 'config-enhanced.php';

// Set security headers
SecurityManager::getInstance()->setSecurityHeaders();

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit();
}

try {
    $security = SecurityManager::getInstance();
    
    // Check rate limit
    if (!$security->checkRateLimit('csrf_token')) {
        http_response_code(429);
        echo json_encode([
            'success' => false,
            'message' => 'Too many requests. Please try again later.'
        ]);
        exit();
    }
    
    // Generate new token
    $token = $security->generateCSRFToken();
    
    // Set content type
    header('Content-Type: application/json; charset=utf-8');
    
    echo json_encode([
        'success' => true,
        'token' => $token,
        'expires_in' => 3600, // 1 hour
        'timestamp' => time()
    ]);
    
} catch (Exception $e) {
    error_log("CSRF token generation error: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error'
    ]);
}
?>