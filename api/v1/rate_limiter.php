<?php
declare(strict_types=1);

require_once __DIR__.'/config.php';
require_once __DIR__.'/bootstrap.php';

/**
 * Middleware rate limiting
 */
function rate_limit_check(): void {
    $ip   = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $user = auth_user_id() ?? 'guest';
    $key  = $ip.'|'.$user;

    $max   = (int) Config::get('RATE_LIMIT_REQUESTS', 60);
    $win   = (int) Config::get('RATE_LIMIT_WINDOW', 60);

    $now   = time();
    $bucket = sys_get_temp_dir().'/ratelimit_'.md5($key);

    $data = ['start'=>$now, 'count'=>0];
    if (file_exists($bucket)) {
        $data = json_decode(file_get_contents($bucket), true) ?: $data;
        if ($now - $data['start'] > $win) {
            $data = ['start'=>$now, 'count'=>0];
        }
    }
    $data['count']++;

    file_put_contents($bucket, json_encode($data));

    if ($data['count'] > $max) {
        $retry = $win - ($now - $data['start']);
        header('Retry-After: '.$retry);
        json_response(429, [
            'error' => 'Too Many Requests',
            'retry_after' => $retry,
            'limit' => $max,
            'window' => $win
        ]);
    }
}

rate_limit_check();
