<?php
declare(strict_types=1);

require_once __DIR__.'/bootstrap.php';

function rate_limit_check(): void {
    $key = ($_SERVER['REMOTE_ADDR'] ?? 'unknown').'|'.(auth_user_id() ?? 'guest');
    $maximum = max(1, (int) Config::get('RATE_LIMIT_REQUESTS', 120));
    $window = max(1, (int) Config::get('RATE_LIMIT_WINDOW', 60));
    $now = time();
    $bucket = sys_get_temp_dir().'/adamowo_rate_'.md5($key);
    $data = ['start' => $now, 'count' => 0];

    $handle = fopen($bucket, 'c+');
    if ($handle !== false && flock($handle, LOCK_EX)) {
        $stored = stream_get_contents($handle);
        $decoded = $stored !== false && $stored !== '' ? json_decode($stored, true) : null;
        if (is_array($decoded) && isset($decoded['start'], $decoded['count'])) $data = $decoded;
        if ($now - (int) $data['start'] >= $window) $data = ['start' => $now, 'count' => 0];
        $data['count']++;
        ftruncate($handle, 0);
        rewind($handle);
        fwrite($handle, json_encode($data));
        fflush($handle);
        flock($handle, LOCK_UN);
        fclose($handle);
    }

    if ((int) $data['count'] > $maximum) {
        $retryAfter = max(1, $window - ($now - (int) $data['start']));
        header('Retry-After: '.$retryAfter);
        json_response(429, ['ok' => false, 'error' => 'Too many requests', 'retry_after' => $retryAfter]);
    }
}

rate_limit_check();
