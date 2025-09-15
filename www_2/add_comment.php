<?php
declare(strict_types=1);

// Start session for CSRF
session_start([
    'cookie_lifetime' => 86400,
    'gc_maxlifetime' => 86400,
    'cookie_secure' => isset($_SERVER['HTTPS']),
    'cookie_httponly' => true,
    'cookie_samesite' => 'Strict'
]);

require_once 'db_config.php';

// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: ' . (getenv('FRONTEND_URL') ?: 'http://localhost:3000'));
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');
header('Content-Security-Policy: default-src \'self\'; script-src \'self\'; object-src \'none\';');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// Handle preflight OPTIONS request for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Rate limiting
$limit = 10; // 10 requests per minute
$time_frame = 60;
$ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
$_SESSION['comment_requests'] = $_SESSION['comment_requests'] ?? [];
$_SESSION['comment_requests'] = array_filter($_SESSION['comment_requests'], function ($timestamp) use ($time_frame) {
    return (time() - $timestamp) < $time_frame;
});
if (count($_SESSION['comment_requests']) >= $limit) {
    http_response_code(429);
    echo json_encode(['status' => 'error', 'message' => 'Przekroczono limit zapytań.']);
    exit;
}
$_SESSION['comment_requests'][] = time();

// Verify CSRF token
$csrf_token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
if (empty($csrf_token) || empty($_SESSION['csrf_token']) || $csrf_token !== $_SESSION['csrf_token']) {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Nieprawidłowy token CSRF.']);
    exit;
}

// Read JSON data from request body
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);
if ($data === null) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Błąd dekodowania JSON.']);
    exit;
}

// Validate data
$date = $data['date'] ?? null;
$name = trim($data['name'] ?? '');
$text = trim($data['text'] ?? '');

// Sanitize IP address
function sanitize_ip(string $ip): ?string {
    $ip = filter_var($ip, FILTER_VALIDATE_IP);
    return $ip ?: null;
}
$ip_address = sanitize_ip($_SERVER['REMOTE_ADDR'] ?? '127.0.0.1');
if (!$ip_address) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Nieprawidłowy adres IP.']);
    exit;
}

// Validate date format
if (!$date || !preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/", $date)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Nieprawidłowy format daty.']);
    exit;
}
if (empty($name) || mb_strlen($name) < 2 || mb_strlen($name) > 50) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Imię musi zawierać od 2 do 50 znaków.']);
    exit;
}
if (empty($text) || mb_strlen($text) < 5 || mb_strlen($text) > 1000) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Wiadomość musi zawierać od 5 do 1000 znaków.']);
    exit;
}

// Additional content filtering
if (preg_match('/<script|javascript:|on\w+=/i', $name . $text)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Niedozwolona zawartość.']);
    exit;
}

// Database connection with retry
$max_retries = 3;
$retry_count = 0;
$conn = null;
while ($retry_count < $max_retries) {
    $conn = get_db_connection();
    if ($conn) break;
    $retry_count++;
    sleep(1);
}
if (!$conn) {
    http_response_code(500);
    error_log("Failed to connect to database after $max_retries attempts.");
    echo json_encode(['status' => 'error', 'message' => 'Błąd serwera: nie można połączyć się z bazą danych.']);
    exit;
}

// Use prepared statements
$stmt = $conn->prepare("INSERT INTO calendar_comments (comment_date, name, text, ip_address) VALUES (?, ?, ?, ?)");
if (!$stmt) {
    error_log("Error preparing statement: " . $conn->error);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Błąd serwera.']);
    $conn->close();
    exit;
}

$stmt->bind_param("ssss", $date, $name, $text, $ip_address);

if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode(['status' => 'success', 'message' => 'Komentarz dodany pomyślnie.']);
} else {
    error_log("Error executing statement: " . $stmt->error);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Nie udało się dodać komentarza.']);
}

$stmt->close();
$conn->close();