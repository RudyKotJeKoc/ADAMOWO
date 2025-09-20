<?php
/**
 * Radio Adamowo - Playlist API
 * Secure playlist management endpoint
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
    
    // Simple rate limiting (60 requests per minute)
    session_start();
    $rateLimitKey = 'playlist_rate_limit_' . $clientId;
    $currentTime = time();
    
    if (!isset($_SESSION[$rateLimitKey])) {
        $_SESSION[$rateLimitKey] = [];
    }
    
    // Clean old requests (older than 1 minute)
    $_SESSION[$rateLimitKey] = array_filter($_SESSION[$rateLimitKey], function($timestamp) use ($currentTime) {
        return ($currentTime - $timestamp) < 60;
    });
    
    if (count($_SESSION[$rateLimitKey]) >= 60) {
        http_response_code(429);
        echo json_encode([
            'error' => 'Rate limit exceeded',
            'message' => 'Too many playlist requests',
            'code' => 'RATE_LIMIT_EXCEEDED',
            'retryAfter' => 60
        ]);
        exit;
    }
    
    $_SESSION[$rateLimitKey][] = $currentTime;
    
    // Get query parameters
    $category = $_GET['category'] ?? null;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : null;
    $shuffle = isset($_GET['shuffle']) && $_GET['shuffle'] === 'true';
    
    // Load playlist file
    $playlistFile = __DIR__ . '/playlist.json';
    if (!file_exists($playlistFile)) {
        http_response_code(404);
        echo json_encode([
            'error' => 'Playlist not found',
            'message' => 'Playlist file not available',
            'code' => 'PLAYLIST_NOT_FOUND'
        ]);
        exit;
    }
    
    $playlistContent = file_get_contents($playlistFile);
    $playlist = json_decode($playlistContent, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(500);
        echo json_encode([
            'error' => 'Invalid playlist format',
            'message' => 'Playlist file is corrupted',
            'code' => 'PLAYLIST_INVALID'
        ]);
        exit;
    }
    
    // Filter by category if specified
    if ($category && isset($playlist['playlists'][$category])) {
        $tracks = $playlist['playlists'][$category];
        $metadata = array_merge($playlist['metadata'], ['filtered_category' => $category]);
    } else {
        // Return all tracks from all categories
        $tracks = [];
        if (isset($playlist['playlists'])) {
            foreach ($playlist['playlists'] as $categoryName => $categoryTracks) {
                foreach ($categoryTracks as $track) {
                    $track['category'] = $categoryName;
                    $tracks[] = $track;
                }
            }
        }
        $metadata = $playlist['metadata'] ?? [];
    }
    
    // Shuffle if requested
    if ($shuffle && !empty($tracks)) {
        shuffle($tracks);
    }
    
    // Apply limit if specified
    if ($limit && $limit > 0) {
        $tracks = array_slice($tracks, 0, min($limit, 100)); // Max 100 tracks
    }
    
    // Sanitize track data for output
    $sanitizedTracks = array_map(function($track) {
        return [
            'id' => htmlspecialchars($track['id'] ?? '', ENT_QUOTES, 'UTF-8'),
            'title' => htmlspecialchars($track['title'] ?? 'Unknown Track', ENT_QUOTES, 'UTF-8'),
            'artist' => htmlspecialchars($track['artist'] ?? 'Unknown Artist', ENT_QUOTES, 'UTF-8'),
            'url' => htmlspecialchars($track['url'] ?? '', ENT_QUOTES, 'UTF-8'),
            'duration' => htmlspecialchars($track['duration'] ?? '00:00', ENT_QUOTES, 'UTF-8'),
            'category' => htmlspecialchars($track['category'] ?? 'uncategorized', ENT_QUOTES, 'UTF-8'),
            'mood' => htmlspecialchars($track['mood'] ?? '', ENT_QUOTES, 'UTF-8'),
            'year' => htmlspecialchars($track['year'] ?? '', ENT_QUOTES, 'UTF-8')
        ];
    }, $tracks);
    
    // Return successful response
    echo json_encode([
        'status' => 'success',
        'data' => $sanitizedTracks,
        'metadata' => [
            'total_tracks' => count($sanitizedTracks),
            'category' => $category,
            'shuffle' => $shuffle,
            'limit' => $limit,
            'version' => $metadata['version'] ?? '1.0.0',
            'generated_at' => date('c')
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Playlist API error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'error' => 'Internal server error',
        'message' => 'An unexpected error occurred',
        'code' => 'INTERNAL_ERROR'
    ]);
}