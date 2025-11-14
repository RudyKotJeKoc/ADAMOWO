<?php
declare(strict_types=1);

/**
 * Supabase PHP Client
 *
 * Simple wrapper for Supabase REST API interactions
 */
class SupabaseClient {
    private string $url;
    private string $anonKey;
    private string $serviceRoleKey;

    public function __construct() {
        $this->url = Config::get('SUPABASE_URL', '');
        $this->anonKey = Config::get('SUPABASE_ANON_KEY', '');
        $this->serviceRoleKey = Config::get('SUPABASE_SERVICE_ROLE_KEY', '');

        if (empty($this->url) || empty($this->anonKey)) {
            throw new RuntimeException('Supabase configuration missing. Please set SUPABASE_URL and SUPABASE_ANON_KEY in .env');
        }
    }

    /**
     * Verify JWT token and extract user ID
     *
     * @param string $token JWT token from Authorization header
     * @return array|null User data or null if invalid
     */
    public function verifyUser(string $token): ?array {
        try {
            // Call Supabase auth API to verify token
            $response = $this->request(
                'GET',
                '/auth/v1/user',
                null,
                ['Authorization' => "Bearer $token"]
            );

            if ($response && isset($response['id'])) {
                return $response;
            }

            return null;
        } catch (Exception $e) {
            error_log("Supabase user verification failed: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Upsert (insert or update) data into a table
     *
     * @param string $table Table name
     * @param array $data Data to upsert
     * @param string|null $token User JWT token (optional, uses service role key if not provided)
     * @return array|null Response data or null on failure
     */
    public function upsert(string $table, array $data, ?string $token = null): ?array {
        $headers = [
            'Prefer' => 'resolution=merge-duplicates,return=representation'
        ];

        if ($token) {
            $headers['Authorization'] = "Bearer $token";
        } else {
            // Use service role key for server-side operations
            $headers['apikey'] = $this->serviceRoleKey;
            $headers['Authorization'] = "Bearer {$this->serviceRoleKey}";
        }

        return $this->request(
            'POST',
            "/rest/v1/{$table}",
            $data,
            $headers
        );
    }

    /**
     * Insert data into a table
     *
     * @param string $table Table name
     * @param array $data Data to insert
     * @param string|null $token User JWT token
     * @return array|null Response data or null on failure
     */
    public function insert(string $table, array $data, ?string $token = null): ?array {
        $headers = [
            'Prefer' => 'return=representation'
        ];

        if ($token) {
            $headers['Authorization'] = "Bearer $token";
        }

        return $this->request(
            'POST',
            "/rest/v1/{$table}",
            $data,
            $headers
        );
    }

    /**
     * Make HTTP request to Supabase
     *
     * @param string $method HTTP method
     * @param string $path API path
     * @param array|null $body Request body
     * @param array $additionalHeaders Additional headers
     * @return array|null Response data or null on failure
     */
    private function request(string $method, string $path, ?array $body = null, array $additionalHeaders = []): ?array {
        $url = $this->url . $path;

        $headers = array_merge([
            'apikey' => $this->anonKey,
            'Content-Type' => 'application/json',
        ], $additionalHeaders);

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);

        // Set headers
        $headerArray = [];
        foreach ($headers as $key => $value) {
            $headerArray[] = "$key: $value";
        }
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headerArray);

        // Set body for POST/PUT/PATCH
        if ($body !== null && in_array($method, ['POST', 'PUT', 'PATCH'])) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
        }

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);

        curl_close($ch);

        if ($curlError) {
            error_log("Supabase request failed: $curlError");
            return null;
        }

        if ($httpCode >= 400) {
            error_log("Supabase request failed with status $httpCode: $response");
            return null;
        }

        if (empty($response)) {
            return [];
        }

        return json_decode($response, true);
    }
}
