<?php
declare(strict_types=1);

require_once __DIR__.'/bootstrap.php';
require_once __DIR__.'/rate_limiter.php';

json_response(200, [
    'pong' => true,
    'time' => date('c')
]);
