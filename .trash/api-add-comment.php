<?php
/**
 * Enhanced Comment Addition Endpoint
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

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit();
}

try {
    $security = SecurityManager::getInstance();
    $db = DatabaseConfig::getInstance()->getConnection();
    
    // Check rate limit
    if (!$security->checkRateLimit('add_comment')) {
        http_response_code(429);
        echo json_encode([
            'success' => false,
            'message' => 'Too many comments submitted. Please wait before trying again.'
        ]);
        exit();
    }
    
    // Validate CSRF token
    $csrfToken = $_POST['csrf_token'] ?? '';
    if (!$security->validateCSRFToken($csrfToken)) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid security token. Please refresh the page and try again.'
        ]);
        exit();
    }
    
    // Validate and sanitize input
    $date = $_POST['date'] ?? '';
    $name = $_POST['name'] ?? '';
    $text = $_POST['text'] ?? '';
    
    // Validate date
    if (!$security->validateDateInput($date)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid date format'
        ]);
        exit();
    }
    
    // Sanitize and validate name
    $name = $security->sanitizeInput($name, 50);
    if (strlen($name) < 2 || strlen($name) > 50) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Name must be between 2 and 50 characters'
        ]);
        exit();
    }
    
    // Sanitize and validate comment text
    $text = $security->sanitizeInput($text, 1000);
    if (strlen($text) < 5 || strlen($text) > 1000) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Comment must be between 5 and 1000 characters'
        ]);
        exit();
    }
    
    // Additional content filtering
    if (preg_match('/\b(spam|viagra|casino)\b/i', $text)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Comment contains prohibited content'
        ]);
        exit();
    }
    
    // Get client IP (with proxy support)
    $clientIp = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? 
                $_SERVER['HTTP_X_FORWARDED_FOR'] ?? 
                $_SERVER['REMOTE_ADDR'] ?? 
                'unknown';
    
    // Hash IP for privacy
    $ipHash = hash('sha256', $clientIp . date('Y-m-d')); // Daily salt
    
    // Check for duplicate comments (same user, same day, similar content)
    $stmt = $db->prepare("
        SELECT COUNT(*) as count
        FROM calendar_comments 
        WHERE comment_date = ? 
        AND ip_address = ? 
        AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)
        AND (name = ? OR SOUNDEX(text) = SOUNDEX(?))
    ");
    
    $stmt->execute([$date, $ipHash, $name, $text]);
    $duplicate = $stmt->fetch();
    
    if ($duplicate['count'] > 0) {
        http_response_code(409);
        echo json_encode([
            'success' => false,
            'message' => 'Similar comment already posted recently'
        ]);
        exit();
    }
    
    // Insert comment
    $stmt = $db->prepare("
        INSERT INTO calendar_comments (comment_date, name, text, ip_address, created_at)
        VALUES (?, ?, ?, ?, NOW())
    ");
    
    $success = $stmt->execute([$date, $name, $text, $ipHash]);
    
    if (!$success) {
        throw new Exception('Failed to insert comment');
    }
    
    $commentId = $db->lastInsertId();
    
    // Set content type
    header('Content-Type: application/json; charset=utf-8');
    
    echo json_encode([
        'success' => true,
        'message' => 'Comment added successfully',
        'comment_id' => $commentId,
        'timestamp' => time()
    ]);
    
    // Log successful comment (for analytics)
    error_log("Comment added: ID={$commentId}, Date={$date}, Length=" . strlen($text));
    
} catch (PDOException $e) {
    error_log("Database error in add comment: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error occurred'
    ]);
    
} catch (Exception $e) {
    error_log("Error in add comment: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error'
    ]);
}
?>