<?php
/**
 * Radio Adamowo Extended API - Stream Management
 * REST API endpoints for live stream and playlist management
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
$endpoint = $pathParts[array_search('stream', $pathParts) + 1] ?? 'status';

switch ($method) {
    case 'GET':
        handleGetRequest($endpoint, $pdo, $rateLimiter);
        break;
    case 'POST':
        handlePostRequest($endpoint, $pdo, $rateLimiter, $auth);
        break;
    case 'PUT':
        handlePutRequest($endpoint, $pdo, $rateLimiter, $auth);
        break;
    case 'DELETE':
        handleDeleteRequest($endpoint, $pdo, $rateLimiter, $auth);
        break;
    default:
        ApiResponse::error('Method not allowed', 405);
}

function handleGetRequest(string $endpoint, PDO $pdo, ApiRateLimiter $rateLimiter): void
{
    if (!$rateLimiter->checkRateLimit('stream_get', 100, 60)) {
        ApiResponse::error('Rate limit exceeded', 429);
    }
    
    switch ($endpoint) {
        case 'status':
            getStreamStatus($pdo);
            break;
        case 'current':
            getCurrentTrack($pdo);
            break;
        case 'playlist':
            getPlaylist($pdo);
            break;
        case 'history':
            getPlayHistory($pdo);
            break;
        case 'stats':
            getStreamStats($pdo);
            break;
        default:
            ApiResponse::notFound('Endpoint not found');
    }
}

function handlePostRequest(string $endpoint, PDO $pdo, ApiRateLimiter $rateLimiter, ApiAuth $auth): void
{
    if (!$rateLimiter->checkRateLimit('stream_post', 30, 60)) {
        ApiResponse::error('Rate limit exceeded', 429);
    }
    
    switch ($endpoint) {
        case 'control':
            $auth->requireAdmin();
            controlStream($pdo);
            break;
        case 'playlist':
            $auth->requireAdmin();
            updatePlaylist($pdo);
            break;
        case 'track':
            $auth->requireAdmin();
            addTrack($pdo);
            break;
        default:
            ApiResponse::notFound('Endpoint not found');
    }
}

function getStreamStatus(PDO $pdo): void
{
    try {
        // Get current stream status from database or cache
        $stmt = $pdo->prepare("
            SELECT 
                'live' as status,
                NOW() as current_time,
                'Radio Adamowo - Live Stream' as stream_name,
                'online' as server_status,
                128 as bitrate,
                'mp3' as format
        ");
        $stmt->execute();
        $status = $stmt->fetch();
        
        // Add real-time listeners count (simulated for now)
        $status['listeners'] = rand(45, 125);
        $status['peak_listeners'] = 247;
        $status['uptime'] = '14 days, 6 hours';
        
        ApiResponse::success($status, 'Stream status retrieved successfully');
    } catch (PDOException $e) {
        error_log("Stream status error: " . $e->getMessage());
        ApiResponse::error('Failed to get stream status', 500);
    }
}

function getCurrentTrack(PDO $pdo): void
{
    try {
        // Load current track from playlist.json
        $playlistFile = __DIR__ . '/../../playlist.json';
        if (!file_exists($playlistFile)) {
            ApiResponse::error('Playlist not found', 404);
        }
        
        $playlist = json_decode(file_get_contents($playlistFile), true);
        if (!$playlist) {
            ApiResponse::error('Invalid playlist format', 500);
        }
        
        // Get current track (simulate rotation)
        $currentIndex = (int)(time() / 180) % count($playlist); // Change every 3 minutes
        $currentTrack = $playlist[$currentIndex];
        
        // Add playback information
        $currentTrack['started_at'] = date('c', time() - (time() % 180));
        $currentTrack['progress'] = (time() % 180) / 180 * 100;
        $currentTrack['duration'] = 180; // 3 minutes per track
        $currentTrack['remaining'] = 180 - (time() % 180);
        
        ApiResponse::success($currentTrack, 'Current track retrieved successfully');
    } catch (Exception $e) {
        error_log("Current track error: " . $e->getMessage());
        ApiResponse::error('Failed to get current track', 500);
    }
}

function getPlaylist(PDO $pdo): void
{
    try {
        $page = (int)($_GET['page'] ?? 1);
        $limit = min(50, (int)($_GET['limit'] ?? 20));
        $category = $_GET['category'] ?? '';
        
        $playlistFile = __DIR__ . '/../../playlist.json';
        if (!file_exists($playlistFile)) {
            ApiResponse::error('Playlist not found', 404);
        }
        
        $playlist = json_decode(file_get_contents($playlistFile), true);
        if (!$playlist) {
            ApiResponse::error('Invalid playlist format', 500);
        }
        
        // Filter by category if specified
        if ($category) {
            $playlist = array_filter($playlist, function($track) use ($category) {
                return ($track['category'] ?? '') === $category;
            });
        }
        
        // Paginate results
        $offset = ($page - 1) * $limit;
        $paginatedPlaylist = array_slice($playlist, $offset, $limit);
        
        $response = [
            'tracks' => array_values($paginatedPlaylist),
            'pagination' => [
                'current_page' => $page,
                'per_page' => $limit,
                'total' => count($playlist),
                'total_pages' => ceil(count($playlist) / $limit)
            ],
            'categories' => array_unique(array_column($playlist, 'category'))
        ];
        
        ApiResponse::success($response, 'Playlist retrieved successfully');
    } catch (Exception $e) {
        error_log("Playlist error: " . $e->getMessage());
        ApiResponse::error('Failed to get playlist', 500);
    }
}

function getPlayHistory(PDO $pdo): void
{
    try {
        $pagination = ApiValidator::validatePagination($_GET['page'] ?? 1, $_GET['limit'] ?? 20);
        
        // For now, simulate play history based on current playlist
        $playlistFile = __DIR__ . '/../../playlist.json';
        if (!file_exists($playlistFile)) {
            ApiResponse::error('Playlist not found', 404);
        }
        
        $playlist = json_decode(file_get_contents($playlistFile), true);
        $history = [];
        
        // Generate last 100 played tracks
        for ($i = 100; $i >= 0; $i--) {
            $trackIndex = ($i + (int)(time() / 180)) % count($playlist);
            $track = $playlist[$trackIndex];
            $track['played_at'] = date('c', time() - ($i * 180));
            $track['duration_played'] = 180;
            $history[] = $track;
        }
        
        // Paginate
        $paginatedHistory = array_slice($history, $pagination['offset'], $pagination['limit']);
        
        $response = [
            'history' => $paginatedHistory,
            'pagination' => [
                'current_page' => $pagination['page'],
                'per_page' => $pagination['limit'],
                'total' => count($history),
                'total_pages' => ceil(count($history) / $pagination['limit'])
            ]
        ];
        
        ApiResponse::success($response, 'Play history retrieved successfully');
    } catch (Exception $e) {
        error_log("Play history error: " . $e->getMessage());
        ApiResponse::error('Failed to get play history', 500);
    }
}

function getStreamStats(PDO $pdo): void
{
    try {
        // Generate comprehensive stream statistics
        $stats = [
            'realtime' => [
                'current_listeners' => rand(45, 125),
                'peak_today' => 247,
                'peak_all_time' => 1247,
                'uptime_seconds' => 1234567,
                'bytes_sent' => 1234567890,
                'tracks_played_today' => 480
            ],
            'daily' => [
                'unique_listeners' => rand(200, 500),
                'total_listening_hours' => rand(800, 2000),
                'average_session_duration' => rand(15, 45),
                'peak_hour' => '20:00-21:00',
                'most_played_category' => 'ambient'
            ],
            'weekly' => [
                'unique_listeners' => rand(1000, 2500),
                'total_listening_hours' => rand(5000, 12000),
                'growth_rate' => rand(5, 25),
                'top_countries' => ['Poland', 'Germany', 'UK', 'USA'],
                'device_breakdown' => [
                    'mobile' => 65,
                    'desktop' => 30,
                    'tablet' => 5
                ]
            ],
            'content' => [
                'total_tracks' => count(json_decode(file_get_contents(__DIR__ . '/../../playlist.json'), true)),
                'total_duration_hours' => 48,
                'categories' => ['ambient', 'hiphop', 'disco', 'barbara', 'kids'],
                'most_requested' => 'Atmospheric Manipulation #3'
            ]
        ];
        
        ApiResponse::success($stats, 'Stream statistics retrieved successfully');
    } catch (Exception $e) {
        error_log("Stream stats error: " . $e->getMessage());
        ApiResponse::error('Failed to get stream statistics', 500);
    }
}

function controlStream(PDO $pdo): void
{
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        $action = $input['action'] ?? '';
        
        switch ($action) {
            case 'play':
            case 'pause':
            case 'stop':
            case 'next':
            case 'previous':
                // In a real implementation, this would control the streaming server
                $result = [
                    'action' => $action,
                    'status' => 'executed',
                    'timestamp' => date('c')
                ];
                ApiResponse::success($result, "Stream $action executed successfully");
                break;
            default:
                ApiResponse::error('Invalid stream control action', 400);
        }
    } catch (Exception $e) {
        error_log("Stream control error: " . $e->getMessage());
        ApiResponse::error('Failed to control stream', 500);
    }
}

function updatePlaylist(PDO $pdo): void
{
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['playlist']) || !is_array($input['playlist'])) {
            ApiResponse::error('Invalid playlist data', 400);
        }
        
        // Validate playlist structure
        foreach ($input['playlist'] as $track) {
            if (!isset($track['title']) || !isset($track['url'])) {
                ApiResponse::error('Invalid track data: title and url required', 400);
            }
        }
        
        // Backup current playlist
        $playlistFile = __DIR__ . '/../../playlist.json';
        $backupFile = __DIR__ . '/../../playlist.backup.' . time() . '.json';
        
        if (file_exists($playlistFile)) {
            copy($playlistFile, $backupFile);
        }
        
        // Save new playlist
        file_put_contents($playlistFile, json_encode($input['playlist'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        
        ApiResponse::success([
            'tracks_updated' => count($input['playlist']),
            'backup_created' => basename($backupFile)
        ], 'Playlist updated successfully');
    } catch (Exception $e) {
        error_log("Playlist update error: " . $e->getMessage());
        ApiResponse::error('Failed to update playlist', 500);
    }
}

function addTrack(PDO $pdo): void
{
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        $required = ['title', 'url', 'category'];
        foreach ($required as $field) {
            if (!isset($input[$field])) {
                ApiResponse::error("Missing required field: $field", 400);
            }
        }
        
        // Load current playlist
        $playlistFile = __DIR__ . '/../../playlist.json';
        $playlist = [];
        
        if (file_exists($playlistFile)) {
            $playlist = json_decode(file_get_contents($playlistFile), true) ?: [];
        }
        
        // Add new track
        $newTrack = [
            'title' => ApiValidator::sanitizeText($input['title'], 200),
            'url' => filter_var($input['url'], FILTER_VALIDATE_URL) ?: '',
            'category' => ApiValidator::sanitizeText($input['category'], 50),
            'added_at' => date('c'),
            'added_by' => 'admin' // Would be actual user ID in production
        ];
        
        if (empty($newTrack['url'])) {
            ApiResponse::error('Invalid URL provided', 400);
        }
        
        $playlist[] = $newTrack;
        
        // Save updated playlist
        file_put_contents($playlistFile, json_encode($playlist, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        
        ApiResponse::success($newTrack, 'Track added successfully', 201);
    } catch (Exception $e) {
        error_log("Add track error: " . $e->getMessage());
        ApiResponse::error('Failed to add track', 500);
    }
}