<?php
/**
 * API Rate Limiter Class
 */

class ApiRateLimiter {
    private $pdo;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    
    public function checkRateLimit($action, $limit, $window) {
        if (!$this->pdo) {
            return true; // Allow if database is not available
        }
        
        $ip = $this->getClientIp();
        $key = $action . ':' . $ip;
        $now = time();
        $windowStart = $now - $window;
        
        try {
            // Clean old entries
            $this->cleanOldEntries($windowStart);
            
            // Count current requests
            $stmt = $this->pdo->prepare("
                SELECT COUNT(*) FROM rate_limits 
                WHERE rate_key = ? AND timestamp > ?
            ");
            $stmt->execute([$key, $windowStart]);
            $count = $stmt->fetchColumn();
            
            if ($count >= $limit) {
                return false;
            }
            
            // Record this request
            $stmt = $this->pdo->prepare("
                INSERT INTO rate_limits (rate_key, timestamp, ip_address) 
                VALUES (?, ?, ?)
            ");
            $stmt->execute([$key, $now, $ip]);
            
            return true;
        } catch (PDOException $e) {
            // If rate limiting fails, allow the request
            error_log("Rate limiting error: " . $e->getMessage());
            return true;
        }
    }
    
    private function getClientIp() {
        $ipKeys = ['HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'REMOTE_ADDR'];
        
        foreach ($ipKeys as $key) {
            if (!empty($_SERVER[$key])) {
                $ip = trim(explode(',', $_SERVER[$key])[0]);
                if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                    return $ip;
                }
            }
        }
        
        return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    }
    
    private function cleanOldEntries($windowStart) {
        try {
            $stmt = $this->pdo->prepare("DELETE FROM rate_limits WHERE timestamp < ?");
            $stmt->execute([$windowStart - 3600]); // Keep some history
        } catch (PDOException $e) {
            // Ignore cleanup errors
            error_log("Rate limit cleanup error: " . $e->getMessage());
        }
    }
    
    public function createTable() {
        if (!$this->pdo) return false;
        
        try {
            $this->pdo->exec("
                CREATE TABLE IF NOT EXISTS rate_limits (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    rate_key VARCHAR(255) NOT NULL,
                    timestamp INT NOT NULL,
                    ip_address VARCHAR(45) NOT NULL,
                    INDEX idx_rate_key_timestamp (rate_key, timestamp),
                    INDEX idx_timestamp (timestamp)
                )
            ");
            return true;
        } catch (PDOException $e) {
            error_log("Failed to create rate_limits table: " . $e->getMessage());
            return false;
        }
    }
}