<?php
declare(strict_types=1);

require_once __DIR__.'/bootstrap.php';
require_once __DIR__.'/rate_limiter.php';
require_once __DIR__.'/database.php';

header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function total_visits(PDO $database, ?string $path = null): int {
    if ($path === null) {
        return (int) $database->query('SELECT COUNT(*) FROM page_visits')->fetchColumn();
    }
    $statement = $database->prepare('SELECT COUNT(*) FROM page_visits WHERE path = :path');
    $statement->execute(['path' => $path]);
    return (int) $statement->fetchColumn();
}

function valid_path(mixed $path): ?string {
    if (!is_string($path) || $path === '' || strlen($path) > 500 || $path[0] !== '/') return null;
    return $path;
}

try {
    $database = database();
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    if ($method === 'GET') {
        $path = isset($_GET['path']) ? valid_path($_GET['path']) : null;
        if (isset($_GET['path']) && $path === null) {
            json_response(400, ['ok' => false, 'error' => 'Invalid path']);
        }
        json_response(200, ['ok' => true, 'visits' => total_visits($database, $path)]);
    }

    if ($method !== 'POST') {
        header('Allow: GET, POST');
        json_response(405, ['ok' => false, 'error' => 'Method not allowed']);
    }
    if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 4096) {
        json_response(413, ['ok' => false, 'error' => 'Request body too large']);
    }

    $payload = json_decode((string) file_get_contents('php://input'), true);
    if (!is_array($payload)) {
        json_response(400, ['ok' => false, 'error' => 'Invalid JSON body']);
    }
    $path = valid_path($payload['path'] ?? null);
    $sessionId = $payload['session_id'] ?? null;
    $referrer = $payload['referrer'] ?? null;
    if ($path === null || !is_string($sessionId)
        || preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i', $sessionId) !== 1
        || ($referrer !== null && (!is_string($referrer) || strlen($referrer) > 1000))) {
        json_response(400, ['ok' => false, 'error' => 'Invalid visit data']);
    }

    $statement = $database->prepare(
        'INSERT INTO page_visits (path, session_id, referrer) VALUES (:path, :session_id, :referrer)'
    );
    $statement->execute([
        'path' => $path,
        'session_id' => $sessionId,
        'referrer' => $referrer === '' ? null : $referrer,
    ]);
    json_response(201, ['ok' => true, 'visits' => total_visits($database)]);
} catch (Throwable $error) {
    error_log('Visits API failure: '.$error->getMessage());
    json_response(500, ['ok' => false, 'error' => 'Analytics service unavailable']);
}
