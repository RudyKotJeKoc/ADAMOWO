# Implementing a Database-Driven Rate Limiter in PHP

This guide provides a detailed walkthrough for implementing a simple but effective database-driven rate-limiting system for a PHP endpoint, specifically designed to prevent comment spamming in the "Radio Adamowo" application's `add_comment.php` script. The method uses the user's IP address and the timestamp of their last submission.

### Prerequisites

It is assumed you have a `comments` table in your database with a structure similar to the following. The key columns for this implementation are `ip_hash` and `created_at`.

| Column | Type | Attributes | Description |
|---|---|---|---|
| `id` | `INT` | `PRIMARY KEY`, `AUTO_INCREMENT` | Unique identifier for the comment. |
| `comment_text` | `TEXT` | | The content of the user's comment. |
| `ip_hash` | `VARCHAR(64)` | `INDEX` | A SHA256 hash of the commenter's IP address. |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | The timestamp when the comment was created. |

**Note:** Storing a hash of the IP address (`ip_hash`) is a better practice for user privacy than storing the raw IP address. An index on this column is crucial for fast lookups.

---

### 1. SQL Query for the Last Comment Timestamp

To implement rate limiting, you first need to retrieve the timestamp of the most recent comment made by a specific user. The user is identified by the hash of their IP address.

The correct SQL query selects the `created_at` value from the `comments` table, filtering by the user's `ip_hash`, ordering the results in descending order by creation time, and limiting the result to just one record.

```sql
SELECT created_at FROM comments WHERE ip_hash = ? ORDER BY created_at DESC LIMIT 1;
```

**Query Breakdown:**
*   **`SELECT created_at`**: Specifies that we only need to retrieve the value from the `created_at` column.
*   **`FROM comments`**: Indicates the table to query.
*   **`WHERE ip_hash = ?`**: Filters the records to find only those matching a specific IP hash. The `?` is a placeholder for a prepared statement, which prevents SQL injection attacks.
*   **`ORDER BY created_at DESC`**: Sorts the matching comments so the most recent one appears first.
*   **`LIMIT 1`**: Restricts the output to only the first row after sorting, which is the most recent comment.

---

### 2. PHP Logic for Query Execution and Time Comparison

In your `add_comment.php` script, you will execute the SQL query and use the result to decide whether to allow the new comment.

#### Key Steps:
1.  **Get and Hash the User's IP:** Retrieve the user's IP address from the `$_SERVER` global variable and create a secure hash.
2.  **Execute the Query:** Use PHP's PDO (PHP Data Objects) to securely prepare and execute the SQL query.
3.  **Fetch the Timestamp:** Retrieve the `created_at` value from the query result.
4.  **Compare Timestamps:** If a previous comment exists, calculate the time elapsed since it was posted. Compare this duration against your defined cool-down period.

---

### 3. Handling the First-Time Commenter

A critical part of the logic is handling users who have never commented before. In this scenario, the SQL query will not find any matching records in the `comments` table.

**Best Practice:** When the database query returns zero rows, it signifies that the user is posting for the first time (or for the first time since their old comments were pruned). The rate-limiting check should be bypassed, and the script should proceed directly to inserting the new comment into the database.

In PDO, you can check this by seeing if the `fetch()` method returns `false`, which indicates no rows were found.

---

### 4. Complete `add_comment.php` Code Snippet

The following is a complete, annotated PHP code snippet demonstrating the entire rate-limiting logic. It should be placed at the beginning of your `add_comment.php` script, before any database insertion logic.

```php
<?php

// --- Configuration ---

// Database connection details (replace with your actual connection logic)
$dsn = 'mysql:host=localhost;dbname=radio_adamowo;charset=utf8mb4';
$username = 'db_user';
$password = 'db_password';

try {
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    // On connection failure, return a generic server error
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Database connection failed.']);
    exit;
}

// Define the cool-down period in seconds.
$coolDownPeriod = 60; // 1 minute

// --- Rate-Limiting Logic ---

// 1. Get the user's IP address and create a hash for privacy and consistency.
$userIp = $_SERVER['REMOTE_ADDR'];
$ip_hash = hash('sha256', $userIp);

// 2. Prepare and execute the query to find the last comment from this IP hash.
$sql = "SELECT created_at FROM comments WHERE ip_hash = ? ORDER BY created_at DESC LIMIT 1";
$stmt = $pdo->prepare($sql);
$stmt->execute([$ip_hash]);

// 3. Fetch the result.
$lastComment = $stmt->fetch(PDO::FETCH_ASSOC);

// 4. Check if a previous comment exists.
if ($lastComment) {
    // A previous comment was found. Now, check the timestamp.
    $lastCommentTime = strtotime($lastComment['created_at']);
    $currentTime = time();
    
    $timeDifference = $currentTime - $lastCommentTime;
    
    // 5. If the cool-down period has not elapsed, block the request.
    if ($timeDifference < $coolDownPeriod) {
        // The user is posting too frequently.
        // Send an HTTP 429 Too Many Requests status code.
        http_response_code(429);
        header('Content-Type: application/json');
        
        // Provide a helpful error message.
        $timeLeft = $coolDownPeriod - $timeDifference;
        echo json_encode([
            'error' => 'Too Many Requests',
            'message' => "Please wait {$timeLeft} more seconds before posting another comment."
        ]);
        
        // Stop script execution.
        exit;
    }
}
// If $lastComment is false, it means this is the user's first comment.
// The script will continue execution automatically.


// --- Main Application Logic ---

// If the script reaches this point, the rate limit check has passed.
// You can now proceed with validating and inserting the new comment.

/*
 *
 * YOUR COMMENT INSERTION LOGIC GOES HERE
 * e.g., $commentText = $_POST['comment'];
 * e.g., $insertSql = "INSERT INTO comments (comment_text, ip_hash) VALUES (?, ?)";
 * ...
 *
 */

// Example success response
header('Content-Type: application/json');
echo json_encode(['success' => 'Comment posted successfully.']);

?>
```

**Handling the HTTP 429 Response:**

When the rate limit is exceeded, the script performs two key actions:
1.  **`http_response_code(429);`**: This PHP function sets the HTTP status code. `429 Too Many Requests` is the semantically correct code for rate-limiting.
2.  **`echo json_encode(...)`**: It returns a JSON object to the client-side application. This allows your frontend to gracefully handle the error and inform the user, for example, by displaying a message like "Please wait 35 more seconds before posting."
3.  **`exit;`**: This immediately terminates the script to prevent the new comment from being processed and saved.

This implementation provides a robust and straightforward defense against simple comment spam bots and users flooding the comment section.