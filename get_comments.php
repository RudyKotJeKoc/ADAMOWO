<?php
/**
 * Radio Adamowo - Secure Comment Retrieval API
 * Enhanced security with proper rate limiting and validation
 */

define('RADIO_ADAMOWO_API', true);
require_once 'config-enhanced.php';

header('Content-Type: application/json; charset=utf-8');

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
    
    // Get client identifier for rate limiting
    $clientIP = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
    $clientId = hash('sha256', $clientIP . $userAgent);
    
    // Simple rate limiting (100 requests per minute)
    session_start();
    $rateLimitKey = 'rate_limit_' . $clientId;
    $currentTime = time();
    
    if (!isset($_SESSION[$rateLimitKey])) {
        $_SESSION[$rateLimitKey] = [];
    }
    
    // Clean old requests (older than 1 minute)
    $_SESSION[$rateLimitKey] = array_filter($_SESSION[$rateLimitKey], function($timestamp) use ($currentTime) {
        return ($currentTime - $timestamp) < 60;
    });
    
    if (count($_SESSION[$rateLimitKey]) >= 100) {
        http_response_code(429);
        echo json_encode([
            'error' => 'Rate limit exceeded',
            'message' => 'Too many requests. Please wait before making another request.',
            'code' => 'RATE_LIMIT_EXCEEDED',
            'retryAfter' => 60
        ]);
        exit;
    }
    
    $_SESSION[$rateLimitKey][] = $currentTime;
    
    // Get and validate date parameter
    $date = filter_input(INPUT_GET, 'date', FILTER_SANITIZE_STRING);
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
    
    // Validate date format
    if (!$date || !preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/", $date)) {
        http_response_code(400);
        echo json_encode([
            'error' => 'Invalid date format',
            'message' => 'Date must be in YYYY-MM-DD format',
            'code' => 'INVALID_DATE'
        ]);
        exit;
    }
    
    // Validate limit and offset
    $limit = min(max($limit, 1), 100); // Between 1 and 100
    $offset = max($offset, 0);
    
    // Get database connection
    $conn = get_enhanced_db_connection();
    if (!$conn) {
        http_response_code(500);
        echo json_encode([
            'error' => 'Database connection failed',
            'message' => 'Unable to connect to database',
            'code' => 'DB_CONNECTION_ERROR'
        ]);
        exit;
    }
    
    // Prepare and execute query with proper sanitization
    $stmt = $conn->prepare("
        SELECT 
            name, 
            text, 
            created_at,
            DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') as formatted_date
        FROM calendar_comments 
        WHERE comment_date = ? 
        ORDER BY created_at ASC 
        LIMIT ? OFFSET ?
    ");
    
    if (!$stmt) {
        error_log("Query preparation failed: " . $conn->error);
        http_response_code(500);
        echo json_encode([
            'error' => 'Query preparation failed',
            'message' => 'Internal server error',
            'code' => 'QUERY_PREP_ERROR'
        ]);
        exit;
    }
    
    $stmt->bind_param("sii", $date, $limit, $offset);
    
    if (!$stmt->execute()) {
        error_log("Query execution failed: " . $stmt->error);
        http_response_code(500);
        echo json_encode([
            'error' => 'Query execution failed',
            'message' => 'Internal server error',
            'code' => 'QUERY_EXEC_ERROR'
        ]);
        exit;
    }
    
    $result = $stmt->get_result();
    $comments = [];
    
    while ($row = $result->fetch_assoc()) {
        // Sanitize output to prevent XSS
        $comments[] = [
            'name' => htmlspecialchars($row['name'], ENT_QUOTES, 'UTF-8'),
            'text' => htmlspecialchars($row['text'], ENT_QUOTES, 'UTF-8'),
            'created_at' => $row['formatted_date']
        ];
    }
    
    $stmt->close();
    $conn->close();
    
    // Return success response
    echo json_encode([
        'status' => 'success',
        'data' => $comments,
        'meta' => [
            'date' => $date,
            'count' => count($comments),
            'limit' => $limit,
            'offset' => $offset
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Comment retrieval error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'error' => 'Internal server error',
        'message' => 'An unexpected error occurred',
        'code' => 'INTERNAL_ERROR'
    ]);
}

