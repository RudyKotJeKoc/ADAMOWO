<?php
/**
 * Radio Adamowo - Secure Comment Addition API
 * Enhanced security with comprehensive validation and CSRF protection
 */

declare(strict_types=1);

session_start([
    'cookie_lifetime' => 86400,
    'gc_maxlifetime' => 86400,
    'cookie_secure' => isset($_SERVER['HTTPS']),
    'cookie_httponly' => true,
    'cookie_samesite' => 'Strict'
]);

require_once 'config-enhanced.php';

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

header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');
header('Access-Control-Allow-Credentials: true');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // Only allow POST requests
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode([
            'error' => 'Method not allowed',
            'message' => 'Only POST requests are accepted',
            'code' => 'METHOD_NOT_ALLOWED'
        ]);
        exit;
    }
    
    // CSRF Protection
    $headers = getallheaders();
    $submitted_token = $headers['X-CSRF-Token'] ?? $headers['x-csrf-token'] ?? null;
    $stored_token = $_SESSION['csrf_token'] ?? null;
    
    if (!$submitted_token || !$stored_token || !hash_equals($stored_token, $submitted_token)) {
        http_response_code(403);
        echo json_encode([
            'error' => 'CSRF validation failed',
            'message' => 'Invalid or missing CSRF token',
            'code' => 'CSRF_ERROR'
        ]);
        exit;
    }
    
    // Rate Limiting - more restrictive for comments (5 per 10 minutes)
    $comment_limit = 5;
    $comment_time_frame = 600; // 10 minutes
    $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
    
    $_SESSION['comment_requests'] = $_SESSION['comment_requests'] ?? [];
    
    // Clean old requests
    $_SESSION['comment_requests'] = array_filter($_SESSION['comment_requests'], function ($timestamp) use ($comment_time_frame) {
        return (time() - $timestamp) < $comment_time_frame;
    });
    
    if (count($_SESSION['comment_requests']) >= $comment_limit) {
        http_response_code(429);
        echo json_encode([
            'error' => 'Rate limit exceeded',
            'message' => 'Too many comments. Please wait before submitting another.',
            'code' => 'RATE_LIMIT_EXCEEDED',
            'retryAfter' => 600
        ]);
        exit;
    }
    
    $_SESSION['comment_requests'][] = time();
    
    // Get and validate JSON input
    $raw_input = file_get_contents('php://input');
    $data = json_decode($raw_input, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode([
            'error' => 'Invalid JSON',
            'message' => 'Request body must be valid JSON',
            'code' => 'INVALID_JSON'
        ]);
        exit;
    }
    
    // Extract and sanitize data
    $date = trim($data['date'] ?? '');
    $name = trim($data['name'] ?? '');
    $text = trim($data['text'] ?? '');
    $ip_address = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
    
    // Comprehensive validation
    $errors = [];
    
    // Validate date
    if (!$date || !preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/", $date)) {
        $errors[] = 'Invalid date format. Use YYYY-MM-DD.';
    }
    
    // Validate name
    if (empty($name)) {
        $errors[] = 'Name is required.';
    } elseif (mb_strlen($name) < 2 || mb_strlen($name) > 50) {
        $errors[] = 'Name must be between 2 and 50 characters.';
    } elseif (!preg_match('/^[\p{L}\p{N}\s\-_.]+$/u', $name)) {
        $errors[] = 'Name contains invalid characters.';
    }
    
    // Validate text
    if (empty($text)) {
        $errors[] = 'Comment text is required.';
    } elseif (mb_strlen($text) < 5 || mb_strlen($text) > 1000) {
        $errors[] = 'Comment must be between 5 and 1000 characters.';
    }
    
    // Check for spam patterns
    if (preg_match('/(https?:\/\/|www\.|@\w+\.\w+)/i', $text) || 
        preg_match('/(.)\1{4,}/', $text) ||
        str_word_count($text) < 2) {
        $errors[] = 'Comment appears to be spam.';
    }
    
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode([
            'error' => 'Validation failed',
            'message' => 'Input validation errors',
            'details' => $errors,
            'code' => 'VALIDATION_ERROR'
        ]);
        exit;
    }
    
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
    
    // Check for duplicate comments (same user, same text in last hour)
    $duplicate_check = $conn->prepare("
        SELECT COUNT(*) as count 
        FROM calendar_comments 
        WHERE ip_address = ? AND text = ? AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)
    ");
    
    if ($duplicate_check) {
        $duplicate_check->bind_param("ss", $ip_address, $text);
        $duplicate_check->execute();
        $result = $duplicate_check->get_result();
        $row = $result->fetch_assoc();
        
        if ($row['count'] > 0) {
            http_response_code(409);
            echo json_encode([
                'error' => 'Duplicate comment',
                'message' => 'You have already submitted this comment recently',
                'code' => 'DUPLICATE_ERROR'
            ]);
            $duplicate_check->close();
            $conn->close();
            exit;
        }
        $duplicate_check->close();
    }
    
    // Insert comment using prepared statement
    $stmt = $conn->prepare("
        INSERT INTO calendar_comments (comment_date, name, text, ip_address, created_at) 
        VALUES (?, ?, ?, ?, NOW())
    ");
    
    if (!$stmt) {
        error_log("Comment insertion preparation failed: " . $conn->error);
        http_response_code(500);
        echo json_encode([
            'error' => 'Query preparation failed',
            'message' => 'Internal server error',
            'code' => 'QUERY_PREP_ERROR'
        ]);
        exit;
    }
    
    $stmt->bind_param("ssss", $date, $name, $text, $ip_address);
    
    if ($stmt->execute()) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Comment added successfully',
            'data' => [
                'id' => $conn->insert_id,
                'date' => $date,
                'name' => htmlspecialchars($name, ENT_QUOTES, 'UTF-8'),
                'created_at' => date('Y-m-d H:i:s')
            ]
        ]);
    } else {
        error_log("Comment insertion failed: " . $stmt->error);
        http_response_code(500);
        echo json_encode([
            'error' => 'Insert failed',
            'message' => 'Failed to save comment',
            'code' => 'INSERT_ERROR'
        ]);
    }
    
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    error_log("Comment addition error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'error' => 'Internal server error',
        'message' => 'An unexpected error occurred',
        'code' => 'INTERNAL_ERROR'
    ]);
}

