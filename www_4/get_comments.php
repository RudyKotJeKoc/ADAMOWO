<?php
declare(strict_types=1);

require_once 'db_config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // W produkcji zawęź do domeny aplikacji

// Walidacja daty z parametru GET
$date = filter_input(INPUT_GET, 'date', FILTER_SANITIZE_STRING);

if (!$date || !preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/", $date)) {
    http_response_code(400); // Bad Request
    echo json_encode(['status' => 'error', 'message' => 'Nieprawidłowy lub brakujący parametr daty.']);
    exit;
}

$conn = get_db_connection();
if (!$conn) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Błąd serwera: nie można połączyć się z bazą danych.']);
    exit;
}

// Użycie prepared statements
$stmt = $conn->prepare("SELECT name, text FROM calendar_comments WHERE comment_date = ? ORDER BY created_at ASC");
if (!$stmt) {
    error_log("Błąd przygotowania zapytania: " . $conn->error);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Błąd serwera.']);
    exit;
}

$stmt->bind_param("s", $date);
$stmt->execute();
$result = $stmt->get_result();

$comments = [];
while ($row = $result->fetch_assoc()) {
    $comments[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode([
    'status' => 'success',
    'data' => $comments
]);

