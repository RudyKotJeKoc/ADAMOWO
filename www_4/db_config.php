<?php
// Użyj `declare(strict_types=1);` dla bezpieczeństwa typów
declare(strict_types=1);

// Ustawienie raportowania błędów dla dewelopmentu
// W produkcji powinno być to wyłączone (logowanie do pliku)
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

/**
 * Zwraca połączenie z bazą danych MySQLi.
 * Używa zmiennych środowiskowych dla bezpieczeństwa.
 *
 * @return mysqli|null Obiekt połączenia mysqli lub null w przypadku błędu.
 */
function get_db_connection(): ?mysqli
{
    // W środowisku produkcyjnym te zmienne powinny być ustawione na serwerze
    $host = getenv('DB_HOST') ?: '127.0.0.1'; // lub 'localhost'
    $username = getenv('DB_USER') ?: 'root';
    $password = getenv('DB_PASS') ?: ''; // Puste hasło dla lokalnego XAMPP/MAMP
    $dbname = getenv('DB_NAME') ?: 'radio_adamowo';
    $port = (int)(getenv('DB_PORT') ?: 3306);

    // Wyłącz raportowanie błędów, aby obsłużyć je ręcznie
    mysqli_report(MYSQLI_REPORT_OFF);

    $conn = @new mysqli($host, $username, $password, $dbname, $port);

    if ($conn->connect_error) {
        // Loguj błąd zamiast go wyświetlać w produkcji
        error_log("Błąd połączenia z bazą danych: " . $conn->connect_error);
        return null;
    }

    $conn->set_charset("utf8mb4");

    return $conn;
}
