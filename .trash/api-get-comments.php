<?php
/**
 * Enhanced Comment Retrieval Endpoint
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
    $db = DatabaseConfig::getInstance()->getConnection();
    
    // Check rate limit
    if (!$security->checkRateLimit('get_comments')) {
        http_response_code(429);
        echo json_encode([
            'success' => false,
            'message' => 'Too many requests. Please try again later.'
        ]);
        exit();
    }
    
    // Validate and sanitize date parameter
    $date = $_GET['date'] ?? '';
    
    if (empty($date)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Date parameter is required'
        ]);
        exit();
    }
    
    if (!$security->validateDateInput($date)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid date format. Use YYYY-MM-DD.'
        ]);
        exit();
    }
    
    // Pagination parameters
    $page = max(1, intval($_GET['page'] ?? 1));
    $perPage = max(1, min(50, intval($_GET['per_page'] ?? 20))); // Max 50 per page
    $offset = ($page - 1) * $perPage;
    
    // Get total count for pagination
    $countStmt = $db->prepare("
        SELECT COUNT(*) as total
        FROM calendar_comments 
        WHERE comment_date = ?
    ");
    
    $countStmt->execute([$date]);
    $totalComments = $countStmt->fetch()['total'];
    
    // Get comments with pagination
    $stmt = $db->prepare("
        SELECT 
            id,
            name,
            text,
            created_at,
            CASE 
                WHEN created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR) THEN 1 
                ELSE 0 
            END as is_recent
        FROM calendar_comments 
        WHERE comment_date = ? 
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?
    ");
    
    $stmt->execute([$date, $perPage, $offset]);
    $comments = $stmt->fetchAll();
    
    // Process comments for output
    $processedComments = [];
    foreach ($comments as $comment) {
        $processedComments[] = [
            'id' => $comment['id'],
            'name' => $security->escapeOutput($comment['name']),
            'text' => $security->escapeOutput($comment['text']),
            'created_at' => $comment['created_at'],
            'is_recent' => (bool)$comment['is_recent'],
            'formatted_date' => date('d.m.Y H:i', strtotime($comment['created_at']))
        ];
    }
    
    // Calculate pagination info
    $totalPages = ceil($totalComments / $perPage);
    $hasNextPage = $page < $totalPages;
    $hasPrevPage = $page > 1;
    
    // Set appropriate cache headers
    if ($totalComments > 0) {
        // Cache for 5 minutes if there are comments
        header('Cache-Control: public, max-age=300');
        header('ETag: "' . md5($date . $totalComments . filemtime(__FILE__)) . '"');
    } else {
        // Cache for 1 minute if no comments (might be added soon)
        header('Cache-Control: public, max-age=60');
    }
    
    // Set content type
    header('Content-Type: application/json; charset=utf-8');
    
    echo json_encode([
        'success' => true,
        'date' => $date,
        'comments' => $processedComments,
        'pagination' => [
            'current_page' => $page,
            'per_page' => $perPage,
            'total_comments' => $totalComments,
            'total_pages' => $totalPages,
            'has_next_page' => $hasNextPage,
            'has_prev_page' => $hasPrevPage
        ],
        'meta' => [
            'request_time' => microtime(true) - $_SERVER['REQUEST_TIME_FLOAT'],
            'timestamp' => time()
        ]
    ], JSON_UNESCAPED_UNICODE | JSON_PARTIAL_OUTPUT_ON_ERROR);
    
} catch (PDOException $e) {
    error_log("Database error in get comments: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error occurred'
    ]);
    
} catch (Exception $e) {
    error_log("Error in get comments: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error'
    ]);
}
?>