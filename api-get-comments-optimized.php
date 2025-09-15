<?php
/**
 * Radio Adamowo - Optimized Comment Retrieval API
 * Enhanced data retrieval with caching and performance optimization
 */

define('RADIO_ADAMOWO_API', true);
require_once 'config-optimized.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $dbConfig = OptimizedDatabaseConfig::getInstance();
    
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
    
    // Check rate limiting
    if (!$dbConfig->checkRateLimit($clientId, 'general')) {
        http_response_code(429);
        echo json_encode([
            'error' => 'Rate limit exceeded',
            'message' => 'Too many requests. Please wait before making another request.',
            'code' => 'RATE_LIMIT_EXCEEDED',
            'retryAfter' => 60
        ]);
        exit;
    }
    
    // Get query parameters with validation
    $date = $_GET['date'] ?? null;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
    $order = $_GET['order'] ?? 'desc';
    
    // Validate parameters
    $limit = min(max($limit, 1), 100); // Between 1 and 100
    $offset = max($offset, 0); // Non-negative
    $order = in_array(strtolower($order), ['asc', 'desc']) ? strtolower($order) : 'desc';
    
    // Build query based on parameters
    $whereClause = '';
    $params = [];
    
    if ($date) {
        // Validate date format
        $dateObj = DateTime::createFromFormat('Y-m-d', $date);
        if (!$dateObj || $dateObj->format('Y-m-d') !== $date) {
            http_response_code(400);
            echo json_encode([
                'error' => 'Invalid date format',
                'message' => 'Date must be in YYYY-MM-DD format',
                'code' => 'INVALID_DATE_FORMAT'
            ]);
            exit;
        }
        
        $whereClause = 'WHERE date = :date';
        $params[':date'] = $date;
    }
    
    // Main query to get comments
    $query = "
        SELECT 
            id,
            date,
            comment,
            created_at,
            CHAR_LENGTH(comment) as comment_length
        FROM calendar_comments 
        {$whereClause}
        ORDER BY created_at {$order}, id {$order}
        LIMIT :limit OFFSET :offset
    ";
    
    $params[':limit'] = $limit;
    $params[':offset'] = $offset;
    
    // Execute query using read replica if available
    $stmt = $dbConfig->executeQuery($query, $params, true);
    $comments = $stmt->fetchAll();
    
    // Get total count for pagination
    $countQuery = "SELECT COUNT(*) as total FROM calendar_comments {$whereClause}";
    $countParams = array_filter($params, function($key) {
        return $key !== ':limit' && $key !== ':offset';
    }, ARRAY_FILTER_USE_KEY);
    
    $countStmt = $dbConfig->executeQuery($countQuery, $countParams, true);
    $totalCount = $countStmt->fetch()['total'];
    
    // Process comments for response
    $processedComments = array_map(function($comment) {
        return [
            'id' => (int)$comment['id'],
            'date' => $comment['date'],
            'comment' => htmlspecialchars($comment['comment'], ENT_QUOTES | ENT_HTML5, 'UTF-8'),
            'created_at' => $comment['created_at'],
            'length' => (int)$comment['comment_length'],
            'preview' => mb_substr(strip_tags($comment['comment']), 0, 100) . 
                        (mb_strlen($comment['comment']) > 100 ? '...' : '')
        ];
    }, $comments);
    
    // Calculate pagination info
    $hasNext = ($offset + $limit) < $totalCount;
    $hasPrev = $offset > 0;
    $totalPages = ceil($totalCount / $limit);
    $currentPage = floor($offset / $limit) + 1;
    
    // Set cache headers for public data
    header('Cache-Control: public, max-age=300'); // 5 minutes cache
    header('ETag: "' . md5(json_encode($processedComments)) . '"');
    
    // Success response with pagination
    echo json_encode([
        'success' => true,
        'data' => $processedComments,
        'pagination' => [
            'total' => (int)$totalCount,
            'count' => count($processedComments),
            'limit' => $limit,
            'offset' => $offset,
            'hasNext' => $hasNext,
            'hasPrev' => $hasPrev,
            'totalPages' => $totalPages,
            'currentPage' => $currentPage
        ],
        'filters' => [
            'date' => $date,
            'order' => $order
        ],
        'timestamp' => time(),
        'version' => '3.0.0'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    
} catch (RuntimeException $e) {
    error_log('Database Error in get comments: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'error' => 'Database error',
        'message' => 'Unable to retrieve comments',
        'code' => 'DATABASE_ERROR'
    ]);
    
} catch (Exception $e) {
    error_log('Unexpected error in get comments: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'error' => 'Internal server error',
        'message' => 'An unexpected error occurred',
        'code' => 'INTERNAL_ERROR'
    ]);
}
?>