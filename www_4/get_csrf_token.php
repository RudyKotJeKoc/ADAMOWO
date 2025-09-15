<?php
declare(strict_types=1);

session_start([
    'cookie_lifetime' => 86400,
    'gc_maxlifetime' => 86400,
]);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // W produkcji zawęź do domeny aplikacji
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Prosty rate limiting
$limit = 20; // 20 tokenów na minutę
$time_frame = 60;
$ip = $_SERVER['REMOTE_ADDR'];

$_SESSION['token_requests'] = $_SESSION['token_requests'] ?? [];
// Usuń stare wpisy
$_SESSION['token_requests'] = array_filter($_SESSION['token_requests'], function ($timestamp) use ($time_frame) {
    return (time() - $timestamp) < $time_frame;
});

if (count($_SESSION['token_requests']) >= $limit) {
    http_response_code(429); // Too Many Requests
    echo json_encode(['error' => 'Przekroczono limit zapytań.']);
    exit;
}

$_SESSION['token_requests'][] = time();


// Generowanie tokenu
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

echo json_encode(['token' => $_SESSION['csrf_token']]);
