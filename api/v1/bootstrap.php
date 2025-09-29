<?php
declare(strict_types=1);

require_once __DIR__.'/config.php';

function json_response(int $status, array $data): never {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Placeholder autoryzacji – na razie czyta X-User-Id.
 * Podmie póniej na realne auth (JWT/session).
 */
function auth_user_id(): ?string {
    $uid = $_SERVER['HTTP_X_USER_ID'] ?? null;
    return $uid ? preg_replace('/\s+/', '', $uid) : null;
}
