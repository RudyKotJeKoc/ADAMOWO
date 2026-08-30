<?php
declare(strict_types=1);

function env_load(string $path): array {
    $variables = [];
    if (!is_file($path) || !is_readable($path)) return $variables;

    foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) continue;

        [$key, $value] = array_map('trim', explode('=', $line, 2));
        if ($key === '') continue;
        if (strlen($value) >= 2 && (($value[0] === '"' && str_ends_with($value, '"'))
            || ($value[0] === "'" && str_ends_with($value, "'")))) {
            $value = substr($value, 1, -1);
        }
        $variables[$key] = $value;
    }
    return $variables;
}

final class Config {
    private static ?array $values = null;

    public static function get(string $key, mixed $default = null): mixed {
        if (self::$values === null) {
            $apiRoot = dirname(__DIR__);
            self::$values = array_merge([
                'APP_ENV' => 'prod',
                'APP_DEBUG' => '0',
                'DB_DSN' => '',
                'DB_USER' => '',
                'DB_PASS' => '',
                'RATE_LIMIT_REQUESTS' => '120',
                'RATE_LIMIT_WINDOW' => '60',
            ], env_load($apiRoot.'/.env'));
        }
        return self::$values[$key] ?? $default;
    }
}
