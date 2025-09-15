<?php
declare(strict_types=1);

require_once 'db_config.php';

// Ustawienie nagłówków
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // W produkcji zawęź do domeny aplikacji
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Obsługa zapytania pre-flight OPTIONS dla CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Odczytaj dane JSON z ciała zapytania
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

// Walidacja danych
$date = $data['date'] ?? null;
$name = trim($data['name'] ?? '');
$text = trim($data['text'] ?? '');
$ip_address = $_SERVER['REMOTE_ADDR'];

// Sprawdzenie poprawności daty
if (!$date || !preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/", $date)) {
    echo json_encode(['status' => 'error', 'message' => 'Nieprawidłowy format daty.']);
    exit;
}
if (empty($name) || mb_strlen($name) < 2 || mb_strlen($name) > 50) {
    echo json_encode(['status' => 'error', 'message' => 'Imię musi zawierać od 2 do 50 znaków.']);
    exit;
}
if (empty($text) || mb_strlen($text) < 5 || mb_strlen($text) > 1000) {
    echo json_encode(['status' => 'error', 'message' => 'Wiadomość musi zawierać od 5 do 1000 znaków.']);
    exit;
}

$conn = get_db_connection();
if (!$conn) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Błąd serwera: nie można połączyć się z bazą danych.']);
    exit;
}

// Użycie prepared statements
$stmt = $conn->prepare("INSERT INTO calendar_comments (comment_date, name, text, ip_address) VALUES (?, ?, ?, ?)");
if (!$stmt) {
    error_log("Błąd przygotowania zapytania: " . $conn->error);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Błąd serwera.']);
    exit;
}

$stmt->bind_param("ssss", $date, $name, $text, $ip_address);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success']);
} else {
    error_log("Błąd wykonania zapytania: " . $stmt->error);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Nie udało się dodać komentarza.']);
}

$stmt->close();
$conn->close();

