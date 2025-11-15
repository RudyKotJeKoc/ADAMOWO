<?php
/**
 * Radio Adamowo - Optimized Comment Addition API  
 * Enhanced security with comprehensive validation and rate limiting
 */

define('RADIO_ADAMOWO_API', true);
require_once 'config-optimized.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $dbConfig = OptimizedDatabaseConfig::getInstance();
    
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
    
    // Get and sanitize input data
    $rawInput = file_get_contents('php://input');
    $inputData = json_decode($rawInput, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode([
            'error' => 'Invalid JSON',
            'message' => 'Request body must be valid JSON',
            'code' => 'INVALID_JSON'
        ]);
        exit;
    }
    
    // Validate required fields
    $requiredFields = ['comment', 'date', 'csrf_token'];
    $missingFields = [];
    
    foreach ($requiredFields as $field) {
        if (!isset($inputData[$field]) || empty(trim($inputData[$field]))) {
            $missingFields[] = $field;
        }
    }
    
    if (!empty($missingFields)) {
        http_response_code(400);
        echo json_encode([
            'error' => 'Missing required fields',
            'message' => 'The following fields are required: ' . implode(', ', $missingFields),
            'code' => 'MISSING_FIELDS',
            'missingFields' => $missingFields
        ]);
        exit;
    }
    
    // Sanitize input data
    $sanitizedData = $dbConfig->sanitizeInput($inputData);
    
    // Validate CSRF token
    if (!$dbConfig->validateCSRFToken($sanitizedData['csrf_token'])) {
        http_response_code(403);
        echo json_encode([
            'error' => 'Invalid CSRF token',
            'message' => 'CSRF token is invalid or expired',
            'code' => 'CSRF_INVALID'
        ]);
        exit;
    }
    
    // Get client identifier for rate limiting
    $clientIP = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
    $clientId = hash('sha256', $clientIP . $userAgent);
    
    // Check comment rate limiting
    if (!$dbConfig->checkRateLimit($clientId, 'comment')) {
        http_response_code(429);
        echo json_encode([
            'error' => 'Rate limit exceeded',
            'message' => 'Too many comments submitted. Please wait before adding another comment.',
            'code' => 'RATE_LIMIT_EXCEEDED',
            'retryAfter' => 300
        ]);
        exit;
    }
    
    // Validate date format
    $date = DateTime::createFromFormat('Y-m-d', $sanitizedData['date']);
    if (!$date || $date->format('Y-m-d') !== $sanitizedData['date']) {
        http_response_code(400);
        echo json_encode([
            'error' => 'Invalid date format',
            'message' => 'Date must be in YYYY-MM-DD format',
            'code' => 'INVALID_DATE_FORMAT'
        ]);
        exit;
    }
    
    // Validate date range (not too far in the past or future)
    $now = new DateTime();
    $maxPast = (clone $now)->sub(new DateInterval('P1Y')); // 1 year ago
    $maxFuture = (clone $now)->add(new DateInterval('P1Y')); // 1 year ahead
    
    if ($date < $maxPast || $date > $maxFuture) {
        http_response_code(400);
        echo json_encode([
            'error' => 'Invalid date range',
            'message' => 'Date must be within one year from today',
            'code' => 'DATE_OUT_OF_RANGE'
        ]);
        exit;
    }
    
    // Additional comment validation
    $comment = trim($sanitizedData['comment']);
    $commentLength = mb_strlen($comment, 'UTF-8');
    $maxCommentLength = $dbConfig->getConfig('security.max_comment_length');
    
    if ($commentLength < 3) {
        http_response_code(400);
        echo json_encode([
            'error' => 'Comment too short',
            'message' => 'Comment must be at least 3 characters long',
            'code' => 'COMMENT_TOO_SHORT'
        ]);
        exit;
    }
    
    if ($commentLength > $maxCommentLength) {
        http_response_code(400);
        echo json_encode([
            'error' => 'Comment too long',
            'message' => "Comment must not exceed {$maxCommentLength} characters",
            'code' => 'COMMENT_TOO_LONG',
            'maxLength' => $maxCommentLength
        ]);
        exit;
    }
    
    // Check for spam patterns
    if (isSpamComment($comment)) {
        http_response_code(400);
        echo json_encode([
            'error' => 'Spam detected',
            'message' => 'Comment appears to be spam',
            'code' => 'SPAM_DETECTED'
        ]);
        exit;
    }
    
    // Insert comment into database
    $query = "
        INSERT INTO calendar_comments (date, comment, created_at, ip_address, user_agent) 
        VALUES (:date, :comment, NOW(), :ip_address, :user_agent)
    ";
    
    $params = [
        ':date' => $sanitizedData['date'],
        ':comment' => $comment,
        ':ip_address' => hash('sha256', $clientIP), // Store hashed IP for privacy
        ':user_agent' => substr($userAgent, 0, 255) // Limit length
    ];
    
    $stmt = $dbConfig->executeQuery($query, $params);
    $commentId = $dbConfig->getConnection()->lastInsertId();
    
    // Success response
    echo json_encode([
        'success' => true,
        'message' => 'Comment added successfully',
        'data' => [
            'id' => (int)$commentId,
            'date' => $sanitizedData['date'],
            'comment' => $comment,
            'created_at' => date('Y-m-d H:i:s'),
            'length' => $commentLength
        ],
        'version' => '3.0.0'
    ]);
    
} catch (InvalidArgumentException $e) {
    http_response_code(400);
    echo json_encode([
        'error' => 'Validation error',
        'message' => $e->getMessage(),
        'code' => 'VALIDATION_ERROR'
    ]);
    
} catch (RuntimeException $e) {
    error_log('Database Error in add comment: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'error' => 'Database error',
        'message' => 'Unable to save comment',
        'code' => 'DATABASE_ERROR'
    ]);
    
} catch (Exception $e) {
    error_log('Unexpected error in add comment: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'error' => 'Internal server error',
        'message' => 'An unexpected error occurred',
        'code' => 'INTERNAL_ERROR'
    ]);
}

/**
 * Simple spam detection function
 */
function isSpamComment(string $comment): bool {
    // Convert to lowercase for pattern matching
    $lowerComment = strtolower($comment);
    
    // Spam patterns to detect
    $spamPatterns = [
        // Excessive repetition
        '/(.)\1{10,}/', // Same character repeated more than 10 times
        '/(\b\w+\b)(\s+\1){4,}/', // Same word repeated more than 4 times
        
        // Common spam phrases (Polish)
        '/kup teraz/i',
        '/darmowa dostawa/i',
        '/promocja/i',
        '/rabat [0-9]+%/i',
        
        // URL patterns (basic)
        '/https?:\/\/[^\s]+\.[^\s]+/i',
        '/www\.[^\s]+\.[^\s]+/i',
        
        // Email patterns
        '/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i',
        
        // Phone number patterns
        '/\b[0-9]{3}[-.\s]?[0-9]{3}[-.\s]?[0-9]{3}\b/',
        '/\b[+]?[0-9]{2}[-.\s]?[0-9]{3}[-.\s]?[0-9]{3}[-.\s]?[0-9]{3}\b/'
    ];
    
    // Check against spam patterns
    foreach ($spamPatterns as $pattern) {
        if (preg_match($pattern, $comment)) {
            return true;
        }
    }
    
    // Check for excessive capital letters
    $capitalRatio = 0;
    $totalLetters = 0;
    
    for ($i = 0; $i < mb_strlen($comment); $i++) {
        $char = mb_substr($comment, $i, 1);
        if (ctype_alpha($char)) {
            $totalLetters++;
            if (ctype_upper($char)) {
                $capitalRatio++;
            }
        }
    }
    
    if ($totalLetters > 10 && ($capitalRatio / $totalLetters) > 0.7) {
        return true; // More than 70% capitals
    }
    
    return false;
}
?>