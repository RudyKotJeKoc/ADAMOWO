<?php
/**
 * Radio Adamowo Extended API - Notification System
 * REST API endpoints for comprehensive notification management
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

$endpoint = $pathParts[array_search('notifications', $pathParts) + 1] ?? '';
$notificationId = $pathParts[array_search('notifications', $pathParts) + 2] ?? null;

switch ($method) {
    case 'GET':
        handleGetRequest($endpoint, $notificationId, $pdo, $rateLimiter, $auth);
        break;
    case 'POST':
        handlePostRequest($endpoint, $notificationId, $pdo, $rateLimiter, $auth);
        break;
    case 'PUT':
        handlePutRequest($endpoint, $notificationId, $pdo, $rateLimiter, $auth);
        break;
    case 'DELETE':
        handleDeleteRequest($endpoint, $notificationId, $pdo, $rateLimiter, $auth);
        break;
    default:
        ApiResponse::error('Method not allowed', 405);
}

function handleGetRequest(string $endpoint, ?string $notificationId, PDO $pdo, ApiRateLimiter $rateLimiter, ApiAuth $auth): void
{
    if (!$rateLimiter->checkRateLimit('notifications_get', 100, 60)) {
        ApiResponse::error('Rate limit exceeded', 429);
    }
    
    switch ($endpoint) {
        case '':
        case 'list':
            $user = $auth->requireAuth();
            getUserNotifications($pdo, $user['user_id']);
            break;
        case 'unread':
            $user = $auth->requireAuth();
            getUnreadNotifications($pdo, $user['user_id']);
            break;
        case 'settings':
            $user = $auth->requireAuth();
            getNotificationSettings($pdo, $user['user_id']);
            break;
        case 'push':
            getPublicPushKey($pdo);
            break;
        default:
            if (is_numeric($endpoint)) {
                $user = $auth->requireAuth();
                getNotification($pdo, (int)$endpoint, $user['user_id']);
            } else {
                ApiResponse::notFound('Endpoint not found');
            }
    }
}

function handlePostRequest(string $endpoint, ?string $notificationId, PDO $pdo, ApiRateLimiter $rateLimiter, ApiAuth $auth): void
{
    if (!$rateLimiter->checkRateLimit('notifications_post', 30, 60)) {
        ApiResponse::error('Rate limit exceeded', 429);
    }
    
    switch ($endpoint) {
        case 'send':
            $auth->requireAdmin();
            sendNotification($pdo);
            break;
        case 'broadcast':
            $auth->requireAdmin();
            broadcastNotification($pdo);
            break;
        case 'subscribe':
            $user = $auth->requireAuth();
            subscribeToPush($pdo, $user['user_id']);
            break;
        case 'test':
            $auth->requireAdmin();
            sendTestNotification($pdo);
            break;
        default:
            ApiResponse::notFound('Endpoint not found');
    }
}

function handlePutRequest(string $endpoint, ?string $notificationId, PDO $pdo, ApiRateLimiter $rateLimiter, ApiAuth $auth): void
{
    $user = $auth->requireAuth();
    
    if (!$rateLimiter->checkRateLimit('notifications_put', 50, 60)) {
        ApiResponse::error('Rate limit exceeded', 429);
    }
    
    switch ($endpoint) {
        case 'read':
            if (!$notificationId || !is_numeric($notificationId)) {
                ApiResponse::error('Valid notification ID required', 400);
            }
            markAsRead($pdo, (int)$notificationId, $user['user_id']);
            break;
        case 'read-all':
            markAllAsRead($pdo, $user['user_id']);
            break;
        case 'settings':
            updateNotificationSettings($pdo, $user['user_id']);
            break;
        default:
            ApiResponse::notFound('Endpoint not found');
    }
}

function getUserNotifications(PDO $pdo, int $userId): void
{
    try {
        $pagination = ApiValidator::validatePagination($_GET['page'] ?? 1, $_GET['limit'] ?? 20);
        $type = $_GET['type'] ?? '';
        
        $whereClause = "WHERE (user_id = ? OR user_id IS NULL) AND (expires_at IS NULL OR expires_at > NOW())";
        $params = [$userId];
        
        if ($type) {
            $whereClause .= " AND type = ?";
            $params[] = $type;
        }
        
        // Get total count
        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM notifications $whereClause");
        $countStmt->execute($params);
        $totalCount = $countStmt->fetchColumn();
        
        // Get notifications
        $stmt = $pdo->prepare("
            SELECT * FROM notifications 
            $whereClause
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        ");
        
        foreach ($params as $key => $value) {
            $stmt->bindValue($key + 1, $value);
        }
        $stmt->bindValue(count($params) + 1, $pagination['limit'], PDO::PARAM_INT);
        $stmt->bindValue(count($params) + 2, $pagination['offset'], PDO::PARAM_INT);
        
        $stmt->execute();
        $notifications = $stmt->fetchAll();
        
        // Parse JSON data
        foreach ($notifications as &$notification) {
            $notification['data'] = $notification['data'] ? json_decode($notification['data'], true) : null;
            $notification['created_at_formatted'] = date('d.m.Y H:i', strtotime($notification['created_at']));
        }
        
        $response = [
            'notifications' => $notifications,
            'pagination' => [
                'current_page' => $pagination['page'],
                'per_page' => $pagination['limit'],
                'total' => $totalCount,
                'total_pages' => ceil($totalCount / $pagination['limit'])
            ]
        ];
        
        ApiResponse::success($response, 'Notifications retrieved successfully');
    } catch (PDOException $e) {
        error_log("Get notifications error: " . $e->getMessage());
        ApiResponse::error('Failed to retrieve notifications', 500);
    }
}

function getUnreadNotifications(PDO $pdo, int $userId): void
{
    try {
        $stmt = $pdo->prepare("
            SELECT * FROM notifications 
            WHERE (user_id = ? OR user_id IS NULL) 
            AND is_read = 0 
            AND (expires_at IS NULL OR expires_at > NOW())
            ORDER BY created_at DESC
            LIMIT 50
        ");
        $stmt->execute([$userId]);
        $notifications = $stmt->fetchAll();
        
        foreach ($notifications as &$notification) {
            $notification['data'] = $notification['data'] ? json_decode($notification['data'], true) : null;
        }
        
        ApiResponse::success([
            'notifications' => $notifications,
            'count' => count($notifications)
        ], 'Unread notifications retrieved successfully');
    } catch (PDOException $e) {
        error_log("Get unread notifications error: " . $e->getMessage());
        ApiResponse::error('Failed to retrieve unread notifications', 500);
    }
}

function sendNotification(PDO $pdo): void
{
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $required = ['user_id', 'type', 'title', 'message'];
        foreach ($required as $field) {
            if (!isset($input[$field])) {
                ApiResponse::error("Missing required field: $field", 400);
            }
        }
        
        $userId = (int)$input['user_id'];
        $type = $input['type'];
        $title = ApiValidator::sanitizeText($input['title'], 200);
        $message = ApiValidator::sanitizeText($input['message'], 1000);
        $data = $input['data'] ?? null;
        $expiresAt = $input['expires_at'] ?? null;
        
        // Validate type
        $validTypes = ['info', 'warning', 'success', 'error', 'podcast', 'comment', 'system'];
        if (!in_array($type, $validTypes)) {
            ApiResponse::error('Invalid notification type', 400);
        }
        
        // Insert notification
        $stmt = $pdo->prepare("
            INSERT INTO notifications (user_id, type, title, message, data, expires_at) 
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $userId,
            $type,
            $title,
            $message,
            $data ? json_encode($data) : null,
            $expiresAt
        ]);
        
        $notificationId = $pdo->lastInsertId();
        
        // Send push notification if user has subscriptions
        $pushSent = sendPushToUser($pdo, $userId, $title, $message, $data);
        
        // Update push status
        if ($pushSent) {
            $stmt = $pdo->prepare("UPDATE notifications SET is_push_sent = 1 WHERE id = ?");
            $stmt->execute([$notificationId]);
        }
        
        ApiResponse::success([
            'id' => $notificationId,
            'push_sent' => $pushSent
        ], 'Notification sent successfully', 201);
    } catch (PDOException $e) {
        error_log("Send notification error: " . $e->getMessage());
        ApiResponse::error('Failed to send notification', 500);
    }
}

function broadcastNotification(PDO $pdo): void
{
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $required = ['type', 'title', 'message'];
        foreach ($required as $field) {
            if (!isset($input[$field])) {
                ApiResponse::error("Missing required field: $field", 400);
            }
        }
        
        $type = $input['type'];
        $title = ApiValidator::sanitizeText($input['title'], 200);
        $message = ApiValidator::sanitizeText($input['message'], 1000);
        $data = $input['data'] ?? null;
        $expiresAt = $input['expires_at'] ?? null;
        
        // Insert broadcast notification (user_id = NULL)
        $stmt = $pdo->prepare("
            INSERT INTO notifications (user_id, type, title, message, data, expires_at) 
            VALUES (NULL, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $type,
            $title,
            $message,
            $data ? json_encode($data) : null,
            $expiresAt
        ]);
        
        $notificationId = $pdo->lastInsertId();
        
        // Send push to all subscribed users
        $pushCount = broadcastPushNotification($pdo, $title, $message, $data);
        
        // Update push status
        if ($pushCount > 0) {
            $stmt = $pdo->prepare("UPDATE notifications SET is_push_sent = 1 WHERE id = ?");
            $stmt->execute([$notificationId]);
        }
        
        ApiResponse::success([
            'id' => $notificationId,
            'push_recipients' => $pushCount
        ], 'Broadcast notification sent successfully', 201);
    } catch (PDOException $e) {
        error_log("Broadcast notification error: " . $e->getMessage());
        ApiResponse::error('Failed to send broadcast notification', 500);
    }
}

function subscribeToPush(PDO $pdo, int $userId): void
{
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $required = ['endpoint', 'p256dh_key', 'auth_key'];
        foreach ($required as $field) {
            if (!isset($input[$field])) {
                ApiResponse::error("Missing required field: $field", 400);
            }
        }
        
        $endpoint = $input['endpoint'];
        $p256dhKey = $input['p256dh_key'];
        $authKey = $input['auth_key'];
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
        $ipAddress = $_SERVER['REMOTE_ADDR'] ?? '';
        
        // Insert or update subscription
        $stmt = $pdo->prepare("
            INSERT INTO push_subscriptions (user_id, endpoint, p256dh_key, auth_key, user_agent, ip_address) 
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                user_id = VALUES(user_id),
                p256dh_key = VALUES(p256dh_key),
                auth_key = VALUES(auth_key),
                is_active = 1,
                last_used = NOW()
        ");
        $stmt->execute([$userId, $endpoint, $p256dhKey, $authKey, $userAgent, $ipAddress]);
        
        ApiResponse::success([
            'subscription_id' => $pdo->lastInsertId() ?: 'updated'
        ], 'Push subscription created successfully');
    } catch (PDOException $e) {
        error_log("Push subscription error: " . $e->getMessage());
        ApiResponse::error('Failed to create push subscription', 500);
    }
}

function markAsRead(PDO $pdo, int $notificationId, int $userId): void
{
    try {
        $stmt = $pdo->prepare("
            UPDATE notifications 
            SET is_read = 1, read_at = NOW() 
            WHERE id = ? AND (user_id = ? OR user_id IS NULL)
        ");
        $stmt->execute([$notificationId, $userId]);
        
        if ($stmt->rowCount() > 0) {
            ApiResponse::success(null, 'Notification marked as read');
        } else {
            ApiResponse::notFound('Notification not found');
        }
    } catch (PDOException $e) {
        error_log("Mark notification as read error: " . $e->getMessage());
        ApiResponse::error('Failed to mark notification as read', 500);
    }
}

function markAllAsRead(PDO $pdo, int $userId): void
{
    try {
        $stmt = $pdo->prepare("
            UPDATE notifications 
            SET is_read = 1, read_at = NOW() 
            WHERE (user_id = ? OR user_id IS NULL) AND is_read = 0
        ");
        $stmt->execute([$userId]);
        
        $updatedCount = $stmt->rowCount();
        
        ApiResponse::success([
            'updated_count' => $updatedCount
        ], 'All notifications marked as read');
    } catch (PDOException $e) {
        error_log("Mark all notifications as read error: " . $e->getMessage());
        ApiResponse::error('Failed to mark all notifications as read', 500);
    }
}

function sendPushToUser(PDO $pdo, int $userId, string $title, string $message, ?array $data): bool
{
    try {
        $stmt = $pdo->prepare("
            SELECT endpoint, p256dh_key, auth_key 
            FROM push_subscriptions 
            WHERE user_id = ? AND is_active = 1
        ");
        $stmt->execute([$userId]);
        $subscriptions = $stmt->fetchAll();
        
        $pushPayload = json_encode([
            'title' => $title,
            'body' => $message,
            'icon' => '/favicon.ico',
            'badge' => '/favicon.ico',
            'data' => $data ?: []
        ]);
        
        $sentCount = 0;
        foreach ($subscriptions as $subscription) {
            if (sendWebPush($subscription, $pushPayload)) {
                $sentCount++;
            }
        }
        
        return $sentCount > 0;
    } catch (Exception $e) {
        error_log("Send push to user error: " . $e->getMessage());
        return false;
    }
}

function broadcastPushNotification(PDO $pdo, string $title, string $message, ?array $data): int
{
    try {
        $stmt = $pdo->query("
            SELECT endpoint, p256dh_key, auth_key 
            FROM push_subscriptions 
            WHERE is_active = 1
        ");
        $subscriptions = $stmt->fetchAll();
        
        $pushPayload = json_encode([
            'title' => $title,
            'body' => $message,
            'icon' => '/favicon.ico',
            'badge' => '/favicon.ico',
            'data' => $data ?: []
        ]);
        
        $sentCount = 0;
        foreach ($subscriptions as $subscription) {
            if (sendWebPush($subscription, $pushPayload)) {
                $sentCount++;
            }
        }
        
        return $sentCount;
    } catch (Exception $e) {
        error_log("Broadcast push notification error: " . $e->getMessage());
        return 0;
    }
}

function sendWebPush(array $subscription, string $payload): bool
{
    // This is a simplified version. In production, use a proper Web Push library like Minishlink/web-push
    // For now, just simulate successful sending
    error_log("Simulating web push to: " . substr($subscription['endpoint'], 0, 50) . "...");
    return true;
}

function getPublicPushKey(PDO $pdo): void
{
    // In production, this would return the actual VAPID public key
    ApiResponse::success([
        'public_key' => 'BDemo-VAPID-Public-Key-For-Development-Only-Replace-In-Production'
    ], 'Public push key retrieved');
}

function sendTestNotification(PDO $pdo): void
{
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        $userId = $input['user_id'] ?? 1;
        
        $testNotification = [
            'user_id' => $userId,
            'type' => 'info',
            'title' => 'Test powiadomienia',
            'message' => 'To jest testowe powiadomienie z systemu Radio Adamowo. Jeśli je widzisz, wszystko działa poprawnie!',
            'data' => [
                'action' => 'test',
                'timestamp' => time()
            ]
        ];
        
        // Insert test notification
        $stmt = $pdo->prepare("
            INSERT INTO notifications (user_id, type, title, message, data) 
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $testNotification['user_id'],
            $testNotification['type'],
            $testNotification['title'],
            $testNotification['message'],
            json_encode($testNotification['data'])
        ]);
        
        $notificationId = $pdo->lastInsertId();
        
        ApiResponse::success([
            'id' => $notificationId,
            'message' => 'Test notification sent successfully'
        ], 'Test notification created');
    } catch (Exception $e) {
        error_log("Send test notification error: " . $e->getMessage());
        ApiResponse::error('Failed to send test notification', 500);
    }
}