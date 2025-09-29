<?php
declare(strict_types=1);

/**
 * Prosty loader .env + centralny dostp do konfiguracji.
 */
function env_load(string $path): array {
    $vars = [];
    if (!is_file($path)) return $vars;
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (str_starts_with(trim($line), '#')) continue;
        [$k, $v] = array_map('trim', explode('=', $line, 2) + [null, null]);
        if ($k === null) continue;
        $v = preg_replace('/^["\']?(.*?)["\']?$/', '$1', (string)$v);
        $vars[$k] = $v;
        $_ENV[$k] = $v;
        putenv("$k=$v");
    }
    return $vars;
}

final class Config {
    private static ?array $C = null;

    public static function get(string $key, mixed $default=null): mixed {
        self::boot();
        return self::$C[$key] ?? $default;
    }

    public static function all(): array {
        self::boot(); return self::$C;
    }

    private static function boot(): void {
        if (self::$C !== null) return;
        $root = dirname(__DIR__, 1);                 // /api
        $env  = env_load($root.'/.env');

        $defaults = [
            'APP_ENV' => 'dev',
            'APP_DEBUG' => '1',
            'DB_DSN' => 'sqlite:'.$root.'/data/app.sqlite',
            'DB_USER' => '',
            'DB_PASS' => '',
            'RATE_LIMIT_REQUESTS' => '60',
            'RATE_LIMIT_WINDOW'   => '60',
            'RATE_LIMIT_STORAGE'  => 'sqlite', // sqlite|files
        ];

        self::$C = array_merge($defaults, $env, $_ENV);
    }
}
