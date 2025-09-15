<?php
declare(strict_types=1);

require_once 'db_config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: ' . (getenv('FRONTEND_URL') ?: 'http://localhost:3000'));
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Validate date parameter
$date = filter_input(INPUT_GET, 'date', FILTER_SANITIZE_STRING);

if (!$date || !preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/", $date)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Nieprawidłowy lub brakujący parametr daty.']);
    exit;
}

$conn = get_db_connection();
if (!$conn) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Błąd serwera: nie można połączyć się z bazą danych.']);
    exit;
}

// Use prepared statements
$stmt = $conn->prepare("SELECT name, text, created_at FROM calendar_comments WHERE comment_date = ? ORDER BY created_at ASC LIMIT 50");
if (!$stmt) {
    error_log("Error preparing statement: " . $conn->error);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Błąd serwera.']);
    $conn->close();
    exit;
}

$stmt->bind_param("s", $date);
$stmt->execute();
$result = $stmt->get_result();

$comments = [];
while ($row = $result->fetch_assoc()) {
    // Sanitize output to prevent XSS
    $comments[] = [
        'name' => htmlspecialchars($row['name'], ENT_QUOTES, 'UTF-8'),
        'text' => htmlspecialchars($row['text'], ENT_QUOTES, 'UTF-8'),
        'created_at' => $row['created_at']
    ];
}

$stmt->close();
$conn->close();

echo json_encode([
    'status' => 'success',
    'data' => $comments
]);