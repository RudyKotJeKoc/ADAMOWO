<?php
/**
 * Radio Adamowo Extended API - Comments Management
 * REST API endpoints for enhanced comments with moderation and reactions
 */

require_once __DIR__ . '/config.php';

$pdo = getApiDbConnection();
if (!$pdo) {
    ApiResponse::error('Database connection failed', 500);
}

$rateLimiter = new ApiRateLimiter($pdo);
$auth = new ApiAuth($pdo);

$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['REQUEST_URI'];
$pathParts = explode('/', trim($path, '/'));

// Extract endpoint and parameters
$endpoint = $pathParts[array_search('comments', $pathParts) + 1] ?? '';
$commentId = $pathParts[array_search('comments', $pathParts) + 2] ?? null;

switch ($method) {
    case 'GET':
        handleGetRequest($endpoint, $commentId, $pdo, $rateLimiter);
        break;
    case 'POST':
        handlePostRequest($endpoint, $commentId, $pdo, $rateLimiter, $auth);
        break;
    case 'PUT':
        handlePutRequest($endpoint, $commentId, $pdo, $rateLimiter, $auth);
        break;
    case 'DELETE':
        handleDeleteRequest($endpoint, $commentId, $pdo, $rateLimiter, $auth);
        break;
    default:
        ApiResponse::error('Method not allowed', 405);
}

function handleGetRequest(string $endpoint, ?string $commentId, PDO $pdo, ApiRateLimiter $rateLimiter): void
{
    if (!$rateLimiter->checkRateLimit('comments_get', 100, 60)) {
        ApiResponse::error('Rate limit exceeded', 429);
    }
    
    switch ($endpoint) {
        case '':
        case 'list':
            getComments($pdo);
            break;
        case 'date':
            getCommentsByDate($pdo);
            break;
        case 'stats':
            getCommentsStats($pdo);
            break;
        case 'moderation':
            getModerationQueue($pdo);
            break;
        default:
            if (is_numeric($endpoint)) {
                getComment($pdo, (int)$endpoint);
            } else {
                ApiResponse::notFound('Endpoint not found');
            }
    }
}

function handlePostRequest(string $endpoint, ?string $commentId, PDO $pdo, ApiRateLimiter $rateLimiter, ApiAuth $auth): void
{
    if (!$rateLimiter->checkRateLimit('comments_post', 10, 60)) {
        ApiResponse::error('Rate limit exceeded', 429);
    }
    
    switch ($endpoint) {
        case '':
        case 'add':
            addComment($pdo);
            break;
        case 'react':
            if (!$commentId) {
                ApiResponse::error('Comment ID required', 400);
            }
            addReaction($pdo, (int)$commentId);
            break;
        case 'report':
            if (!$commentId) {
                ApiResponse::error('Comment ID required', 400);
            }
            reportComment($pdo, (int)$commentId);
            break;
        case 'moderate':
            $auth->requireAdmin();
            moderateComment($pdo);
            break;
        default:
            ApiResponse::notFound('Endpoint not found');
    }
}

function handlePutRequest(string $endpoint, ?string $commentId, PDO $pdo, ApiRateLimiter $rateLimiter, ApiAuth $auth): void
{
    if (!$rateLimiter->checkRateLimit('comments_put', 20, 60)) {
        ApiResponse::error('Rate limit exceeded', 429);
    }
    
    if (!$commentId || !is_numeric($commentId)) {
        ApiResponse::error('Valid comment ID required', 400);
    }
    
    switch ($endpoint) {
        case 'edit':
            editComment($pdo, (int)$commentId);
            break;
        case 'approve':
            $auth->requireAdmin();
            approveComment($pdo, (int)$commentId);
            break;
        case 'flag':
            $auth->requireAdmin();
            flagComment($pdo, (int)$commentId);
            break;
        default:
            ApiResponse::notFound('Endpoint not found');
    }
}

function getComments(PDO $pdo): void
{
    try {
        $pagination = ApiValidator::validatePagination($_GET['page'] ?? 1, $_GET['limit'] ?? 20);
        $date = $_GET['date'] ?? '';
        $approved = $_GET['approved'] ?? '1';
        
        $whereClause = "WHERE is_approved = :approved";
        $params = ['approved' => $approved];
        
        if ($date && ApiValidator::validateDate($date)) {
            $whereClause .= " AND comment_date = :date";
            $params['date'] = $date;
        }
        
        // Get total count
        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM calendar_comments $whereClause");
        $countStmt->execute($params);
        $totalCount = $countStmt->fetchColumn();
        
        // Get comments with reactions
        $stmt = $pdo->prepare("
            SELECT 
                c.*,
                COALESCE(r.like_count, 0) as like_count,
                COALESCE(r.dislike_count, 0) as dislike_count,
                COALESCE(r.heart_count, 0) as heart_count,
                COALESCE(rep.report_count, 0) as report_count
            FROM calendar_comments c
            LEFT JOIN (
                SELECT 
                    comment_id,
                    SUM(CASE WHEN reaction_type = 'like' THEN 1 ELSE 0 END) as like_count,
                    SUM(CASE WHEN reaction_type = 'dislike' THEN 1 ELSE 0 END) as dislike_count,
                    SUM(CASE WHEN reaction_type = 'heart' THEN 1 ELSE 0 END) as heart_count
                FROM comment_reactions 
                GROUP BY comment_id
            ) r ON c.id = r.comment_id
            LEFT JOIN (
                SELECT comment_id, COUNT(*) as report_count
                FROM comment_reports
                WHERE status = 'open'
                GROUP BY comment_id
            ) rep ON c.id = rep.comment_id
            $whereClause
            ORDER BY c.created_at DESC
            LIMIT :limit OFFSET :offset
        ");
        
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->bindValue('limit', $pagination['limit'], PDO::PARAM_INT);
        $stmt->bindValue('offset', $pagination['offset'], PDO::PARAM_INT);
        
        $stmt->execute();
        $comments = $stmt->fetchAll();
        
        // Format dates for frontend
        foreach ($comments as &$comment) {
            $comment['created_at_formatted'] = date('d.m.Y H:i', strtotime($comment['created_at']));
            $comment['comment_date_formatted'] = date('d.m.Y', strtotime($comment['comment_date']));
        }
        
        $response = [
            'comments' => $comments,
            'pagination' => [
                'current_page' => $pagination['page'],
                'per_page' => $pagination['limit'],
                'total' => $totalCount,
                'total_pages' => ceil($totalCount / $pagination['limit'])
            ]
        ];
        
        ApiResponse::success($response, 'Comments retrieved successfully');
    } catch (PDOException $e) {
        error_log("Get comments error: " . $e->getMessage());
        ApiResponse::error('Failed to retrieve comments', 500);
    }
}

function getCommentsByDate(PDO $pdo): void
{
    try {
        $date = $_GET['date'] ?? '';
        
        if (!$date || !ApiValidator::validateDate($date)) {
            ApiResponse::error('Valid date required (YYYY-MM-DD format)', 400);
        }
        
        $stmt = $pdo->prepare("
            SELECT 
                c.*,
                COALESCE(r.like_count, 0) as like_count,
                COALESCE(r.dislike_count, 0) as dislike_count,
                COALESCE(r.heart_count, 0) as heart_count
            FROM calendar_comments c
            LEFT JOIN (
                SELECT 
                    comment_id,
                    SUM(CASE WHEN reaction_type = 'like' THEN 1 ELSE 0 END) as like_count,
                    SUM(CASE WHEN reaction_type = 'dislike' THEN 1 ELSE 0 END) as dislike_count,
                    SUM(CASE WHEN reaction_type = 'heart' THEN 1 ELSE 0 END) as heart_count
                FROM comment_reactions 
                GROUP BY comment_id
            ) r ON c.id = r.comment_id
            WHERE c.comment_date = ? AND c.is_approved = 1
            ORDER BY c.created_at ASC
        ");
        
        $stmt->execute([$date]);
        $comments = $stmt->fetchAll();
        
        ApiResponse::success([
            'date' => $date,
            'comments' => $comments,
            'count' => count($comments)
        ], 'Comments for date retrieved successfully');
    } catch (PDOException $e) {
        error_log("Get comments by date error: " . $e->getMessage());
        ApiResponse::error('Failed to retrieve comments for date', 500);
    }
}

function addComment(PDO $pdo): void
{
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        $required = ['name', 'text', 'date'];
        foreach ($required as $field) {
            if (!isset($input[$field]) || empty(trim($input[$field]))) {
                ApiResponse::error("Missing required field: $field", 400);
            }
        }
        
        $date = trim($input['date']);
        $name = trim($input['name']);
        $text = trim($input['text']);
        
        // Validate data
        if (!ApiValidator::validateDate($date)) {
            ApiResponse::error('Invalid date format', 400);
        }
        
        if (strlen($name) < 2 || strlen($name) > 50) {
            ApiResponse::error('Name must be between 2 and 50 characters', 400);
        }
        
        if (strlen($text) < 5 || strlen($text) > 1000) {
            ApiResponse::error('Comment must be between 5 and 1000 characters', 400);
        }
        
        // Sanitize input
        $name = ApiValidator::sanitizeText($name, 50);
        $text = ApiValidator::sanitizeText($text, 1000);
        
        // Check for spam/duplicate
        $clientId = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . ($_SERVER['HTTP_USER_AGENT'] ?? ''));
        
        $stmt = $pdo->prepare("
            SELECT COUNT(*) FROM calendar_comments 
            WHERE ip_address = ? AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)
        ");
        $stmt->execute([$clientId]);
        
        if ($stmt->fetchColumn() >= 5) {
            ApiResponse::error('Too many comments in the last hour. Please wait.', 429);
        }
        
        // Insert comment
        $stmt = $pdo->prepare("
            INSERT INTO calendar_comments (comment_date, name, text, ip_address, is_approved) 
            VALUES (?, ?, ?, ?, 1)
        ");
        
        $stmt->execute([$date, $name, $text, $clientId]);
        $commentId = $pdo->lastInsertId();
        
        // Get the created comment
        $stmt = $pdo->prepare("SELECT * FROM calendar_comments WHERE id = ?");
        $stmt->execute([$commentId]);
        $comment = $stmt->fetch();
        
        // Log activity
        error_log("New comment added: ID $commentId, Date: $date, Name: $name");
        
        ApiResponse::success($comment, 'Comment added successfully', 201);
    } catch (PDOException $e) {
        error_log("Add comment error: " . $e->getMessage());
        ApiResponse::error('Failed to add comment', 500);
    }
}

function addReaction(PDO $pdo, int $commentId): void
{
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        $reactionType = $input['type'] ?? '';
        $validReactions = ['like', 'dislike', 'heart'];
        
        if (!in_array($reactionType, $validReactions)) {
            ApiResponse::error('Invalid reaction type. Must be: ' . implode(', ', $validReactions), 400);
        }
        
        // Check if comment exists
        $stmt = $pdo->prepare("SELECT id FROM calendar_comments WHERE id = ? AND is_approved = 1");
        $stmt->execute([$commentId]);
        if (!$stmt->fetch()) {
            ApiResponse::notFound('Comment not found');
        }
        
        $clientId = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . ($_SERVER['HTTP_USER_AGENT'] ?? ''));
        
        // Check if already reacted
        $stmt = $pdo->prepare("
            SELECT id FROM comment_reactions 
            WHERE comment_id = ? AND client_id = ?
        ");
        $stmt->execute([$commentId, $clientId]);
        
        if ($stmt->fetch()) {
            // Update existing reaction
            $stmt = $pdo->prepare("
                UPDATE comment_reactions 
                SET reaction_type = ?, created_at = NOW() 
                WHERE comment_id = ? AND client_id = ?
            ");
            $stmt->execute([$reactionType, $commentId, $clientId]);
        } else {
            // Create new reaction
            $stmt = $pdo->prepare("
                INSERT INTO comment_reactions (comment_id, client_id, reaction_type, ip_address) 
                VALUES (?, ?, ?, ?)
            ");
            $stmt->execute([$commentId, $clientId, $reactionType, $_SERVER['REMOTE_ADDR'] ?? '']);
        }
        
        // Get updated reaction counts
        $stmt = $pdo->prepare("
            SELECT 
                SUM(CASE WHEN reaction_type = 'like' THEN 1 ELSE 0 END) as like_count,
                SUM(CASE WHEN reaction_type = 'dislike' THEN 1 ELSE 0 END) as dislike_count,
                SUM(CASE WHEN reaction_type = 'heart' THEN 1 ELSE 0 END) as heart_count
            FROM comment_reactions 
            WHERE comment_id = ?
        ");
        $stmt->execute([$commentId]);
        $counts = $stmt->fetch();
        
        ApiResponse::success([
            'comment_id' => $commentId,
            'reaction_type' => $reactionType,
            'counts' => $counts
        ], 'Reaction added successfully');
    } catch (PDOException $e) {
        error_log("Add reaction error: " . $e->getMessage());
        ApiResponse::error('Failed to add reaction', 500);
    }
}

function reportComment(PDO $pdo, int $commentId): void
{
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        $reason = ApiValidator::sanitizeText($input['reason'] ?? '', 500);
        
        if (empty($reason)) {
            ApiResponse::error('Report reason is required', 400);
        }
        
        // Check if comment exists
        $stmt = $pdo->prepare("SELECT id FROM calendar_comments WHERE id = ?");
        $stmt->execute([$commentId]);
        if (!$stmt->fetch()) {
            ApiResponse::notFound('Comment not found');
        }
        
        $clientId = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . ($_SERVER['HTTP_USER_AGENT'] ?? ''));
        
        // Check if already reported by this client
        $stmt = $pdo->prepare("
            SELECT id FROM comment_reports 
            WHERE comment_id = ? AND client_id = ?
        ");
        $stmt->execute([$commentId, $clientId]);
        
        if ($stmt->fetch()) {
            ApiResponse::error('You have already reported this comment', 400);
        }
        
        // Create report
        $stmt = $pdo->prepare("
            INSERT INTO comment_reports (comment_id, client_id, reason, ip_address) 
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([$commentId, $clientId, $reason, $_SERVER['REMOTE_ADDR'] ?? '']);
        
        ApiResponse::success([
            'comment_id' => $commentId,
            'report_id' => $pdo->lastInsertId()
        ], 'Comment reported successfully');
    } catch (PDOException $e) {
        error_log("Report comment error: " . $e->getMessage());
        ApiResponse::error('Failed to report comment', 500);
    }
}

function getCommentsStats(PDO $pdo): void
{
    try {
        // Generate comprehensive comment statistics
        $stats = [];
        
        // Total counts
        $stmt = $pdo->query("
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN is_approved = 1 THEN 1 ELSE 0 END) as approved,
                SUM(CASE WHEN is_approved = 0 THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN is_flagged = 1 THEN 1 ELSE 0 END) as flagged
            FROM calendar_comments
        ");
        $stats['totals'] = $stmt->fetch();
        
        // Daily activity last 7 days
        $stmt = $pdo->query("
            SELECT DATE(created_at) as date, COUNT(*) as count
            FROM calendar_comments 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            GROUP BY DATE(created_at)
            ORDER BY date DESC
        ");
        $stats['daily_activity'] = $stmt->fetchAll();
        
        // Most active dates
        $stmt = $pdo->query("
            SELECT comment_date, COUNT(*) as comment_count
            FROM calendar_comments 
            WHERE is_approved = 1
            GROUP BY comment_date
            ORDER BY comment_count DESC
            LIMIT 10
        ");
        $stats['most_active_dates'] = $stmt->fetchAll();
        
        // Recent activity
        $stmt = $pdo->query("
            SELECT 
                name, 
                LEFT(text, 100) as preview,
                comment_date,
                created_at
            FROM calendar_comments 
            WHERE is_approved = 1
            ORDER BY created_at DESC 
            LIMIT 5
        ");
        $stats['recent_activity'] = $stmt->fetchAll();
        
        ApiResponse::success($stats, 'Comment statistics retrieved successfully');
    } catch (PDOException $e) {
        error_log("Comments stats error: " . $e->getMessage());
        ApiResponse::error('Failed to get comment statistics', 500);
    }
}