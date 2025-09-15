<?php
declare(strict_types=1);

session_start([
    'cookie_lifetime' => 86400,
    'gc_maxlifetime' => 86400,
    'cookie_secure' => isset($_SERVER['HTTPS']),
    'cookie_httponly' => true,
    'cookie_samesite' => 'Strict'
]);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: ' . (getenv('FRONTEND_URL') ?: 'http://localhost:3000'));
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit(0);
}

// Simple rate limiting
$limit = 20; // 20 tokens per minute
$time_frame = 60;
$ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';

$_SESSION['token_requests'] = $_SESSION['token_requests'] ?? [];
// Remove old entries
$_SESSION['token_requests'] = array_filter($_SESSION['token_requests'], function ($timestamp) use ($time_frame) {
    return (time() - $timestamp) < $time_frame;
});

if (count($_SESSION['token_requests']) >= $limit) {
    http_response_code(429); // Too Many Requests
    echo json_encode(['error' => 'Przekroczono limit zapytań.']);
    exit;
}

$_SESSION['token_requests'][] = time();

// Generate CSRF token
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

echo json_encode(['token' => $_SESSION['csrf_token']]);