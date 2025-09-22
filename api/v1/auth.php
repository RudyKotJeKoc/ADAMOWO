<?php
/**
 * API Authentication Class
 */

class ApiAuth {
    private $pdo;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    
    public function requireAdmin() {
        // For now, this is a placeholder
        // In production, implement proper JWT or session-based auth
        $apiKey = $_SERVER['HTTP_X_API_KEY'] ?? null;
        
        if (!$apiKey || $apiKey !== $_ENV['ADMIN_API_KEY'] ?? 'admin-key-123') {
            ApiResponse::error('Unauthorized', 401);
        }
    }
    
    public function validateCsrfToken($token) {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        return isset($_SESSION['csrf_token']) && 
               hash_equals($_SESSION['csrf_token'], $token);
    }
    
    public function generateCsrfToken() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        $token = bin2hex(random_bytes(32));
        $_SESSION['csrf_token'] = $token;
        $_SESSION['csrf_token_time'] = time();
        
        return $token;
    }
    
    public function isValidSession() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        // Check if CSRF token exists and is not expired
        $tokenTime = $_SESSION['csrf_token_time'] ?? 0;
        return (time() - $tokenTime) < CSRF_TOKEN_LIFETIME;
    }
}