<?php
declare(strict_types=1);

// Error reporting configuration
// In production, disable display_errors and log to file instead
ini_set('display_errors', '0');
ini_set('log_errors', '1');
ini_set('error_log', '/var/log/php_errors.log');
error_reporting(E_ALL);

/**
 * Returns MySQLi database connection.
 * Uses environment variables for security.
 *
 * @return mysqli|null MySQLi connection object or null on error.
 */
function get_db_connection(): ?mysqli
{
    // Environment variables should be set on the server in production
    $host = getenv('DB_HOST') ?: '127.0.0.1';
    $username = getenv('DB_USER') ?: 'root';
    $password = getenv('DB_PASS') ?: '';
    $dbname = getenv('DB_NAME') ?: 'radio_adamowo';
    $port = (int)(getenv('DB_PORT') ?: 3306);

    // Disable mysqli error reporting to handle errors manually
    mysqli_report(MYSQLI_REPORT_OFF);

    try {
        $conn = new mysqli($host, $username, $password, $dbname, $port);

        if ($conn->connect_error) {
            error_log("Database connection error: " . $conn->connect_error);
            return null;
        }

        // Set charset to UTF-8
        if (!$conn->set_charset("utf8mb4")) {
            error_log("Error setting charset: " . $conn->error);
            $conn->close();
            return null;
        }

        return $conn;
    } catch (Exception $e) {
        error_log("Database connection exception: " . $e->getMessage());
        return null;
    }
}

/**
 * Initialize database tables if they don't exist
 */
function initialize_database(): bool
{
    $conn = get_db_connection();
    if (!$conn) {
        return false;
    }

    $sql = "
    CREATE TABLE IF NOT EXISTS calendar_comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        comment_date DATE NOT NULL,
        name VARCHAR(50) NOT NULL,
        text TEXT NOT NULL,
        ip_address VARCHAR(45) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_date (comment_date),
        INDEX idx_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ";

    if ($conn->query($sql) === TRUE) {
        $conn->close();
        return true;
    } else {
        error_log("Error creating table: " . $conn->error);
        $conn->close();
        return false;
    }
}