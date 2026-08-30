<?php
declare(strict_types=1);

require_once __DIR__.'/config.php';

function database(): PDO {
    static $connection = null;
    if ($connection instanceof PDO) return $connection;

    $dsn = (string) Config::get('DB_DSN', '');
    $user = (string) Config::get('DB_USER', '');
    $password = (string) Config::get('DB_PASS', '');
    if (!str_starts_with($dsn, 'mysql:') || $user === '' || $password === '') {
        throw new RuntimeException('MariaDB configuration is missing');
    }

    $connection = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    return $connection;
}
