<?php
declare(strict_types=1);

// Start sesji dla CSRF
session_start([
    'cookie_lifetime' => 86400,
    'gc_maxlifetime' => 86400,
]);

require_once 'db_config.php';

// Ustawienie nagłówków
header('Content-Type: application/json');
// W produkcji ustaw na konkretną domenę, np. 'https://radioadamowo.pl'
header('Access-Control-Allow-Origin: ' . (getenv('FRONTEND_URL') ?: 'http://localhost'));
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');
// Content Security Policy dla ochrony przed XSS
header("Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none';");

// Obsługa zapytania pre-flight OPTIONS dla CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Prosty rate limiting
$limit = 10; // 10 zapytań na minutę
$time_frame = 60;
$ip = $_SERVER['REMOTE_ADDR'];
$_SESSION['comment_requests'] = $_SESSION['comment_requests'] ?? [];
$_SESSION['comment_requests'] = array_filter($_SESSION['comment_requests'], function ($timestamp) use ($time_frame) {
    return (time() - $timestamp) < $time_frame;
});
if (count($_SESSION['comment_requests']) >= $limit) {
    http_response_code(429); // Too Many Requests
    echo json_encode(['status' => 'error', 'message' => 'Przekroczono limit zapytań.']);
    exit;
}
$_SESSION['comment_requests'][] = time();

// Weryfikacja CSRF tokena
$csrf_token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
if (empty($csrf_token) || empty($_SESSION['csrf_token']) || $csrf_token !== $_SESSION['csrf_token']) {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Nieprawidłowy token CSRF.']);
    exit;
}

// Odczytaj dane JSON z ciała zapytania
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);
if ($data === null) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Błąd dekodowania JSON.']);
    exit;
}

// Walidacja danych
$date = $data['date'] ?? null;
$name = trim($data['name'] ?? '');
$text = trim($data['text'] ?? '');

// Sanitizacja IP
function sanitize_ip(string $ip): ?string {
    $ip = filter_var($ip, FILTER_VALIDATE_IP);
    return $ip ?: null;
}
$ip_address = sanitize_ip($_SERVER['REMOTE_ADDR']);
if (!$ip_address) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Nieprawidłowy adres IP.']);
    exit;
}

// Sprawdzenie poprawności daty
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

// Połączenie z bazą danych z retry
$max_retries = 3;
$retry_count = 0;
$conn = null;
while ($retry_count < $max_retries) {
    $conn = get_db_connection();
    if ($conn) break;
    $retry_count++;
    sleep(1); // Krótka przerwa przed retry
}
if (!$conn) {
    http_response_code(500);
    error_log("Nie udało się połączyć z bazą danych po $max_retries próbach.");
    echo json_encode(['status' => 'error', 'message' => 'Błąd serwera: nie można połączyć się z bazą danych.']);
    exit;
}

// Użycie prepared statements
$stmt = $conn->prepare("INSERT INTO calendar_comments (comment_date, name, text, ip_address) VALUES (?, ?, ?, ?)");
if (!$stmt) {
    error_log("Błąd przygotowania zapytania: " . $conn->error);
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
    error_log("Błąd wykonania zapytania: " . $stmt->error);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Nie udało się dodać komentarza.']);
}

$stmt->close();
$conn->close();