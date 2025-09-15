<?php
/**
 * Radio Adamowo - Optimized Database Configuration
 * Consolidated security implementation with best practices from all versions
 * 
 * Features:
 * - Environment-based configuration with secure fallbacks
 * - Advanced PDO connection management with connection pooling
 * - Comprehensive security headers and CSRF protection
 * - Rate limiting with Redis/Memory fallback
 * - Enhanced error handling and logging
 * - Multi-database support for scaling
 */

// Security: Prevent direct access
if (!defined('RADIO_ADAMOWO_API')) {
    http_response_code(403);
    header('Content-Type: application/json');
    die(json_encode(['error' => 'Direct access forbidden', 'code' => 'ACCESS_DENIED']));
}

/**
 * Enhanced Database Configuration Manager
 * Singleton pattern with connection pooling and failover support
 */
class OptimizedDatabaseConfig {
    private static $instance = null;
    private $connections = [];
    private $config = [];
    private $rateLimiter = null;
    private $logger = null;
    private $connectionPool = [];
    private $maxConnections = 10;
    private $currentConnections = 0;
    
    private function __construct() {
        $this->initializeConfiguration();
        $this->validateConfiguration();
        $this->initializeSecurity();
        $this->initializeRateLimiter();
        $this->initializeLogger();
    }
    
    /**
     * Get singleton instance
     */
    public static function getInstance(): self {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Load configuration from multiple sources
     */
    private function initializeConfiguration(): void {
        // Primary: Environment variables (production)
        $this->config = [
            // Database configuration
            'db' => [
                'primary' => [
                    'host' => getenv('DB_HOST') ?: '127.0.0.1',
                    'port' => getenv('DB_PORT') ?: '3306',
                    'name' => getenv('DB_NAME') ?: 'radio_adamowo',
                    'user' => getenv('DB_USER') ?: 'radio_adamowo',
                    'pass' => getenv('DB_PASS') ?: '',
                    'charset' => getenv('DB_CHARSET') ?: 'utf8mb4',
                    'collation' => 'utf8mb4_unicode_ci',
                    'options' => [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                        PDO::ATTR_EMULATE_PREPARES => false,
                        PDO::ATTR_PERSISTENT => true,
                        PDO::ATTR_TIMEOUT => 30,
                        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
                    ]
                ],
                'replica' => [
                    'host' => getenv('DB_REPLICA_HOST') ?: null,
                    'port' => getenv('DB_REPLICA_PORT') ?: '3306',
                    'name' => getenv('DB_REPLICA_NAME') ?: null,
                    'user' => getenv('DB_REPLICA_USER') ?: null,
                    'pass' => getenv('DB_REPLICA_PASS') ?: null,
                    'charset' => 'utf8mb4'
                ]
            ],
            
            // Application configuration
            'app' => [
                'frontend_url' => getenv('FRONTEND_URL') ?: 'https://radioadamowo.pl',
                'allowed_origins' => explode(',', getenv('ALLOWED_ORIGINS') ?: 'https://radioadamowo.pl'),
                'environment' => getenv('APP_ENV') ?: 'production',
                'debug' => filter_var(getenv('APP_DEBUG'), FILTER_VALIDATE_BOOLEAN) ?: false,
                'session_lifetime' => (int)(getenv('SESSION_LIFETIME') ?: 3600),
                'csrf_token_lifetime' => (int)(getenv('CSRF_TOKEN_LIFETIME') ?: 1800)
            ],
            
            // Security configuration  
            'security' => [
                'rate_limit_enabled' => filter_var(getenv('RATE_LIMIT_ENABLED'), FILTER_VALIDATE_BOOLEAN) !== false,
                'rate_limit_requests' => (int)(getenv('RATE_LIMIT_REQUESTS') ?: 20),
                'rate_limit_window' => (int)(getenv('RATE_LIMIT_WINDOW') ?: 300), // 5 minutes
                'comment_rate_limit' => (int)(getenv('COMMENT_RATE_LIMIT') ?: 10),
                'max_comment_length' => (int)(getenv('MAX_COMMENT_LENGTH') ?: 500),
                'enable_sql_logging' => filter_var(getenv('ENABLE_SQL_LOGGING'), FILTER_VALIDATE_BOOLEAN) ?: false
            ],
            
            // Redis configuration for rate limiting and caching
            'redis' => [
                'enabled' => extension_loaded('redis') && getenv('REDIS_HOST'),
                'host' => getenv('REDIS_HOST') ?: '127.0.0.1',
                'port' => (int)(getenv('REDIS_PORT') ?: 6379),
                'password' => getenv('REDIS_PASSWORD') ?: null,
                'database' => (int)(getenv('REDIS_DB') ?: 0),
                'timeout' => (float)(getenv('REDIS_TIMEOUT') ?: 2.5)
            ]
        ];
        
        // Fallback: Load from local config file (development)
        if (empty($this->config['db']['primary']['pass']) && file_exists(__DIR__ . '/.env.local')) {
            $this->loadLocalConfiguration();
        }
        
        // Final fallback: Default development values
        if (empty($this->config['db']['primary']['pass']) && $this->config['app']['environment'] === 'development') {
            $this->config['db']['primary']['pass'] = 'adamowo_dev_2024';
            $this->config['app']['debug'] = true;
        }
    }
    
    /**
     * Load local development configuration
     */
    private function loadLocalConfiguration(): void {
        try {
            $localConfig = parse_ini_file(__DIR__ . '/.env.local', true);
            if ($localConfig && isset($localConfig['database'])) {
                $this->config['db']['primary'] = array_merge(
                    $this->config['db']['primary'], 
                    $localConfig['database']
                );
            }
            if ($localConfig && isset($localConfig['app'])) {
                $this->config['app'] = array_merge(
                    $this->config['app'], 
                    $localConfig['app']
                );
            }
        } catch (Exception $e) {
            error_log("Failed to load local configuration: " . $e->getMessage());
        }
    }
    
    /**
     * Validate configuration completeness
     */
    private function validateConfiguration(): void {
        $required = ['host', 'name', 'user'];
        foreach ($required as $field) {
            if (empty($this->config['db']['primary'][$field])) {
                throw new InvalidArgumentException("Required database configuration missing: {$field}");
            }
        }
        
        // Validate URLs
        if (!filter_var($this->config['app']['frontend_url'], FILTER_VALIDATE_URL)) {
            throw new InvalidArgumentException("Invalid frontend URL configuration");
        }
        
        // Validate allowed origins
        foreach ($this->config['app']['allowed_origins'] as $origin) {
            if (!filter_var($origin, FILTER_VALIDATE_URL) && $origin !== '*') {
                throw new InvalidArgumentException("Invalid allowed origin: {$origin}");
            }
        }
    }
    
    /**
     * Initialize security headers and CORS
     */
    private function initializeSecurity(): void {
        // Security headers
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: DENY');
        header('X-XSS-Protection: 1; mode=block');
        header('Referrer-Policy: strict-origin-when-cross-origin');
        header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
        
        // Content Security Policy
        $csp = implode('; ', [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net",
            "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.tailwindcss.com",
            "img-src 'self' data: https:",
            "media-src 'self' https:",
            "connect-src 'self' https:",
            "font-src 'self' https:",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'"
        ]);
        header("Content-Security-Policy: {$csp}");
        
        // CORS handling
        $this->handleCORS();
    }
    
    /**
     * Handle CORS with allowed origins validation
     */
    private function handleCORS(): void {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        $allowedOrigins = $this->config['app']['allowed_origins'];
        
        if (in_array($origin, $allowedOrigins) || in_array('*', $allowedOrigins)) {
            header("Access-Control-Allow-Origin: {$origin}");
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-CSRF-Token');
            header('Access-Control-Max-Age: 86400'); // 24 hours
        }
        
        // Handle preflight requests
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(204);
            exit();
        }
    }
    
    /**
     * Initialize rate limiting system
     */
    private function initializeRateLimiter(): void {
        if (!$this->config['security']['rate_limit_enabled']) {
            return;
        }
        
        if ($this->config['redis']['enabled']) {
            $this->rateLimiter = new RedisRateLimiter($this->config['redis']);
        } else {
            $this->rateLimiter = new MemoryRateLimiter();
        }
    }
    
    /**
     * Initialize logging system
     */
    private function initializeLogger(): void {
        $this->logger = new SimpleLogger($this->config['app']['debug']);
    }
    
    /**
     * Get database connection with connection pooling
     */
    public function getConnection(bool $useReplica = false): PDO {
        $configKey = $useReplica && !empty($this->config['db']['replica']['host']) ? 'replica' : 'primary';
        $connectionKey = $configKey . '_' . getmypid();
        
        // Check for existing connection in pool
        if (isset($this->connectionPool[$connectionKey]) && $this->isConnectionAlive($this->connectionPool[$connectionKey])) {
            return $this->connectionPool[$connectionKey];
        }
        
        // Create new connection if under limit
        if ($this->currentConnections < $this->maxConnections) {
            $connection = $this->createConnection($configKey);
            $this->connectionPool[$connectionKey] = $connection;
            $this->currentConnections++;
            return $connection;
        }
        
        // Reuse existing connection if at limit
        return $this->getReuseableConnection();
    }
    
    /**
     * Create new database connection
     */
    private function createConnection(string $configKey): PDO {
        $dbConfig = $this->config['db'][$configKey];
        
        $dsn = sprintf(
            "mysql:host=%s;port=%s;dbname=%s;charset=%s",
            $dbConfig['host'],
            $dbConfig['port'],
            $dbConfig['name'],
            $dbConfig['charset']
        );
        
        try {
            $connection = new PDO($dsn, $dbConfig['user'], $dbConfig['pass'], $dbConfig['options']);
            
            // Set additional connection attributes
            $connection->exec("SET sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO'");
            $connection->exec("SET time_zone = '+00:00'");
            
            $this->logger->log("Database connection established: {$configKey}");
            return $connection;
            
        } catch (PDOException $e) {
            $this->logger->log("Database connection failed: " . $e->getMessage(), 'error');
            throw new RuntimeException("Database connection failed: " . $e->getMessage(), 0, $e);
        }
    }
    
    /**
     * Check if connection is still alive
     */
    private function isConnectionAlive(PDO $connection): bool {
        try {
            $connection->query('SELECT 1');
            return true;
        } catch (PDOException $e) {
            return false;
        }
    }
    
    /**
     * Get reusable connection from pool
     */
    private function getReuseableConnection(): PDO {
        foreach ($this->connectionPool as $connection) {
            if ($this->isConnectionAlive($connection)) {
                return $connection;
            }
        }
        
        throw new RuntimeException("No available database connections");
    }
    
    /**
     * Rate limiting check
     */
    public function checkRateLimit(string $identifier, string $action = 'general'): bool {
        if (!$this->rateLimiter) {
            return true; // Rate limiting disabled
        }
        
        $limits = [
            'general' => $this->config['security']['rate_limit_requests'],
            'comment' => $this->config['security']['comment_rate_limit'],
            'csrf' => $this->config['security']['rate_limit_requests']
        ];
        
        $limit = $limits[$action] ?? $limits['general'];
        return $this->rateLimiter->isAllowed($identifier, $limit, $this->config['security']['rate_limit_window']);
    }
    
    /**
     * Get configuration value
     */
    public function getConfig(string $path = null) {
        if ($path === null) {
            return $this->config;
        }
        
        $keys = explode('.', $path);
        $value = $this->config;
        
        foreach ($keys as $key) {
            if (!isset($value[$key])) {
                return null;
            }
            $value = $value[$key];
        }
        
        return $value;
    }
    
    /**
     * Execute prepared statement with error handling
     */
    public function executeQuery(string $query, array $params = [], bool $useReplica = false): PDOStatement {
        $connection = $this->getConnection($useReplica);
        
        try {
            $stmt = $connection->prepare($query);
            $stmt->execute($params);
            
            if ($this->config['security']['enable_sql_logging']) {
                $this->logger->log("SQL executed: {$query}", 'debug');
            }
            
            return $stmt;
            
        } catch (PDOException $e) {
            $this->logger->log("SQL error: " . $e->getMessage(), 'error');
            throw new RuntimeException("Database query failed", 0, $e);
        }
    }
    
    /**
     * Validate and sanitize input data
     */
    public function sanitizeInput(array $data): array {
        $sanitized = [];
        
        foreach ($data as $key => $value) {
            if (is_string($value)) {
                // Remove dangerous characters and excessive whitespace
                $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $value);
                $value = trim($value);
                
                // Length limits based on field type
                $maxLength = $key === 'comment' ? $this->config['security']['max_comment_length'] : 255;
                if (strlen($value) > $maxLength) {
                    throw new InvalidArgumentException("Field '{$key}' exceeds maximum length of {$maxLength} characters");
                }
            }
            
            $sanitized[$key] = $value;
        }
        
        return $sanitized;
    }
    
    /**
     * Generate secure CSRF token
     */
    public function generateCSRFToken(): string {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        $token = bin2hex(random_bytes(32));
        $_SESSION['csrf_token'] = $token;
        $_SESSION['csrf_token_time'] = time();
        
        return $token;
    }
    
    /**
     * Validate CSRF token
     */
    public function validateCSRFToken(string $token): bool {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        if (!isset($_SESSION['csrf_token']) || !isset($_SESSION['csrf_token_time'])) {
            return false;
        }
        
        // Check token expiry
        if (time() - $_SESSION['csrf_token_time'] > $this->config['app']['csrf_token_lifetime']) {
            unset($_SESSION['csrf_token'], $_SESSION['csrf_token_time']);
            return false;
        }
        
        return hash_equals($_SESSION['csrf_token'], $token);
    }
    
    /**
     * Clean up connections on shutdown
     */
    public function __destruct() {
        foreach ($this->connectionPool as $connection) {
            $connection = null;
        }
        $this->connectionPool = [];
        $this->currentConnections = 0;
    }
}

/**
 * Redis-based rate limiter
 */
class RedisRateLimiter {
    private $redis;
    
    public function __construct(array $config) {
        $this->redis = new Redis();
        $this->redis->connect($config['host'], $config['port'], $config['timeout']);
        
        if ($config['password']) {
            $this->redis->auth($config['password']);
        }
        
        $this->redis->select($config['database']);
    }
    
    public function isAllowed(string $identifier, int $limit, int $window): bool {
        $key = "rate_limit:{$identifier}";
        $current = $this->redis->incr($key);
        
        if ($current === 1) {
            $this->redis->expire($key, $window);
        }
        
        return $current <= $limit;
    }
}

/**
 * Memory-based rate limiter (fallback)
 */
class MemoryRateLimiter {
    private static $requests = [];
    
    public function isAllowed(string $identifier, int $limit, int $window): bool {
        $now = time();
        $key = $identifier;
        
        // Clean old entries
        if (isset(self::$requests[$key])) {
            self::$requests[$key] = array_filter(
                self::$requests[$key], 
                fn($timestamp) => $now - $timestamp < $window
            );
        }
        
        // Check current count
        $currentCount = count(self::$requests[$key] ?? []);
        if ($currentCount >= $limit) {
            return false;
        }
        
        // Record this request
        self::$requests[$key][] = $now;
        return true;
    }
}

/**
 * Simple logging utility
 */
class SimpleLogger {
    private $enabled;
    
    public function __construct(bool $enabled = false) {
        $this->enabled = $enabled;
    }
    
    public function log(string $message, string $level = 'info'): void {
        if (!$this->enabled && $level !== 'error') {
            return;
        }
        
        $timestamp = date('Y-m-d H:i:s');
        $logMessage = "[{$timestamp}] [{$level}] {$message}" . PHP_EOL;
        
        if ($level === 'error') {
            error_log($logMessage);
        } elseif ($this->enabled) {
            error_log($logMessage, 3, __DIR__ . '/logs/radio_adamowo.log');
        }
    }
}

// Initialize configuration instance
try {
    $dbConfig = OptimizedDatabaseConfig::getInstance();
} catch (Exception $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    die(json_encode([
        'error' => 'Database configuration failed', 
        'message' => 'Service temporarily unavailable',
        'code' => 'CONFIG_ERROR'
    ]));
}