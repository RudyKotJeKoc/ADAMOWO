<?php
declare(strict_types=1);

/**
 * Ratings Synchronization Endpoint
 *
 * POST /api/v1/ratings/sync
 *
 * Receives track ratings from Service Worker and synchronizes them to Supabase.
 * Requires authentication via JWT token in Authorization header.
 *
 * Request body format:
 * [
 *   {
 *     "trackId": "string",
 *     "rating": number (1-5),
 *     "timestamp": "ISO8601 datetime string",
 *     "comment": "string (optional)"
 *   },
 *   ...
 * ]
 *
 * Response:
 * - 200 OK: { "success": true, "synced": number, "failed": number }
 * - 400 Bad Request: { "error": "error message" }
 * - 401 Unauthorized: { "error": "authentication required" }
 * - 500 Internal Server Error: { "error": "error message" }
 */

require_once __DIR__.'/../bootstrap.php';
require_once __DIR__.'/../supabase_client.php';

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(405, ['error' => 'Method not allowed. Use POST.']);
}

/**
 * Extract JWT token from Authorization header
 */
function getAuthToken(): ?string {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

    if (empty($authHeader)) {
        return null;
    }

    // Extract Bearer token
    if (preg_match('/Bearer\s+(.+)/i', $authHeader, $matches)) {
        return $matches[1];
    }

    return null;
}

/**
 * Validate a single rating object
 */
function validateRating(array $rating): array {
    $errors = [];

    // Validate trackId
    if (!isset($rating['trackId']) || !is_string($rating['trackId']) || empty(trim($rating['trackId']))) {
        $errors[] = 'trackId is required and must be a non-empty string';
    }

    // Validate rating
    if (!isset($rating['rating'])) {
        $errors[] = 'rating is required';
    } elseif (!is_numeric($rating['rating'])) {
        $errors[] = 'rating must be a number';
    } else {
        $ratingValue = (int)$rating['rating'];
        if ($ratingValue < 1 || $ratingValue > 5) {
            $errors[] = 'rating must be between 1 and 5';
        }
    }

    // Validate timestamp
    if (!isset($rating['timestamp']) || !is_string($rating['timestamp'])) {
        $errors[] = 'timestamp is required and must be a string';
    } elseif (!strtotime($rating['timestamp'])) {
        $errors[] = 'timestamp must be a valid ISO8601 datetime string';
    }

    // Validate comment (optional)
    if (isset($rating['comment'])) {
        if (!is_string($rating['comment'])) {
            $errors[] = 'comment must be a string';
        } elseif (strlen($rating['comment']) > 500) {
            $errors[] = 'comment must not exceed 500 characters';
        }
    }

    return $errors;
}

try {
    // Get and verify authentication token
    $token = getAuthToken();

    if (!$token) {
        json_response(401, [
            'error' => 'Authentication required. Please provide a valid JWT token in the Authorization header.'
        ]);
    }

    // Initialize Supabase client
    $supabase = new SupabaseClient();

    // Verify user
    $user = $supabase->verifyUser($token);

    if (!$user || !isset($user['id'])) {
        json_response(401, [
            'error' => 'Invalid or expired token. Please authenticate again.'
        ]);
    }

    $userId = $user['id'];

    // Get request body
    $rawBody = file_get_contents('php://input');

    if (empty($rawBody)) {
        json_response(400, [
            'error' => 'Request body is required. Please send an array of rating objects.'
        ]);
    }

    // Parse JSON
    $ratings = json_decode($rawBody, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        json_response(400, [
            'error' => 'Invalid JSON: ' . json_last_error_msg()
        ]);
    }

    // Validate that ratings is an array
    if (!is_array($ratings)) {
        json_response(400, [
            'error' => 'Request body must be an array of rating objects'
        ]);
    }

    // Check for empty array
    if (empty($ratings)) {
        json_response(200, [
            'success' => true,
            'synced' => 0,
            'failed' => 0,
            'message' => 'No ratings to sync'
        ]);
    }

    // Limit number of ratings per request
    $maxRatingsPerRequest = 100;
    if (count($ratings) > $maxRatingsPerRequest) {
        json_response(400, [
            'error' => "Too many ratings in single request. Maximum is $maxRatingsPerRequest."
        ]);
    }

    // Validate all ratings
    $validationErrors = [];
    foreach ($ratings as $index => $rating) {
        if (!is_array($rating)) {
            $validationErrors[] = "Rating at index $index is not an object";
            continue;
        }

        $errors = validateRating($rating);
        if (!empty($errors)) {
            $validationErrors["rating[$index]"] = $errors;
        }
    }

    if (!empty($validationErrors)) {
        json_response(400, [
            'error' => 'Validation failed',
            'details' => $validationErrors
        ]);
    }

    // Prepare data for Supabase upsert
    $supabaseRatings = [];
    foreach ($ratings as $rating) {
        $supabaseRatings[] = [
            'user_id' => $userId,
            'track_id' => trim($rating['trackId']),
            'rating' => (int)$rating['rating'],
            'rated_at' => $rating['timestamp'],
            'comment' => isset($rating['comment']) && !empty(trim($rating['comment']))
                ? trim($rating['comment'])
                : null
        ];
    }

    // Perform upsert using Supabase client
    $syncedCount = 0;
    $failedCount = 0;
    $errors = [];

    // Process ratings individually for better error handling
    foreach ($supabaseRatings as $index => $ratingData) {
        try {
            $result = $supabase->upsert('user_ratings', $ratingData, $token);

            if ($result !== null) {
                $syncedCount++;
            } else {
                $failedCount++;
                $errors[] = [
                    'index' => $index,
                    'trackId' => $ratingData['track_id'],
                    'error' => 'Failed to sync rating'
                ];
            }
        } catch (Exception $e) {
            $failedCount++;
            $errors[] = [
                'index' => $index,
                'trackId' => $ratingData['track_id'],
                'error' => $e->getMessage()
            ];
            error_log("Failed to sync rating for track {$ratingData['track_id']}: " . $e->getMessage());
        }
    }

    // Return response
    $response = [
        'success' => $failedCount === 0,
        'synced' => $syncedCount,
        'failed' => $failedCount
    ];

    if (!empty($errors)) {
        $response['errors'] = $errors;
    }

    // Return 200 if at least some synced, 500 if all failed
    $statusCode = $syncedCount > 0 ? 200 : 500;

    json_response($statusCode, $response);

} catch (RuntimeException $e) {
    // Configuration errors
    error_log("Runtime error in ratings sync: " . $e->getMessage());
    json_response(500, [
        'error' => 'Server configuration error. Please contact administrator.'
    ]);
} catch (Exception $e) {
    // Unexpected errors
    error_log("Unexpected error in ratings sync: " . $e->getMessage());
    json_response(500, [
        'error' => 'An unexpected error occurred. Please try again later.'
    ]);
}
