# Implementing the Synchronized Token Pattern for CSRF Protection in PHP and JavaScript

This guide provides a comprehensive walkthrough for implementing the Synchronized Token Pattern to protect a PHP backend and Vanilla JavaScript frontend against Cross-Site Request Forgery (CSRF) attacks.

### Understanding CSRF and the Synchronized Token Pattern

Cross-Site Request Forgery (CSRF) is a web security vulnerability that tricks an authenticated user's browser into performing an unwanted action on a trusted site [ref: 0-1]. The attack exploits the trust a website has in a user's browser, which automatically includes authentication tokens like session cookies with every request to a domain [ref: 0-0].

The Synchronized Token Pattern is a common and effective defense against CSRF [ref: 1-3]. The process involves [ref: 0-2, 1-3]:
1.  The server generates a unique, secret, and unpredictable token and associates it with the user's current session [ref: 0-2].
2.  This token is sent to the client.
3.  For any subsequent state-changing request (e.g., POST, PUT, DELETE), the client must send the token back to the server [ref: 0-1]. This is often done in a custom HTTP header [ref: 0-3].
4.  The server validates that the token received from the client matches the one stored in the user's session. If they match, the request is considered legitimate; otherwise, it is rejected [ref: 0-2].

An attacker cannot construct a fully valid request because they cannot guess or access the required CSRF token [ref: 0-2].

---

### Step 1: Generating a Secure, Session-Based CSRF Token (PHP)

The first step is to create a server-side script that generates a secure token and stores it in the user's session.

**Standard Procedure & Best Practices:**
*   **Secure Generation:** The token must be generated using a cryptographically secure pseudo-random number generator [ref: 0-3]. In PHP, `random_bytes()` is the recommended function [ref: 0-4]. Using functions like `md5(uniqid(rand()))` is insecure and should be avoided [ref: 0-4].
*   **Sufficient Length:** The token should be at least 32 bytes (256 bits) long to be resistant to brute-force attacks [ref: 0-0, 0-3].
*   **Session-Based:** The token should be generated once per user session and stored in the `$_SESSION` superglobal [ref: 0-0].

**Code Example: `get_csrf_token.php`**

This PHP script will start a session, generate a token if one doesn't already exist for the session, and then output it in JSON format.

```php
<?php
// get_csrf_token.php

// Always start the session at the beginning of the script.
session_start();

// Check if a CSRF token already exists in the session.
// If not, generate a new one.
if (empty($_SESSION['csrf_token'])) {
    // Generate a secure, 32-byte random token and convert it to a hexadecimal string.
    // random_bytes() produces cryptographically secure pseudo-random bytes. [ref: 0-4]
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// Set the content type header to indicate a JSON response.
header('Content-Type: application/json');

// Create an associative array to hold the token.
$response = [
    'csrf_token' => $_SESSION['csrf_token']
];

// Encode the array as a JSON string and output it.
echo json_encode($response);
?>
```

---

### Step 2: Fetching the CSRF Token on the Client-Side (JavaScript)

The client-side `app.js` needs to fetch the token from the `get_csrf_token.php` endpoint when the application loads.

**Procedure:**
*   Use the `fetch` API to make a GET request to your token-generating endpoint.
*   Parse the JSON response to extract the token.
*   Store the token in a variable within a scope that your request-making functions can access. Avoid storing tokens in globally accessible JavaScript variables [ref: 0-0].

**Code Example: `app.js` (Token Fetching)**

```javascript
// app.js

// A variable to hold the CSRF token.
let csrfToken = null;

/**
 * Fetches the CSRF token from the server and stores it.
 * This function should be called when the application initializes.
 */
async function getCsrfToken() {
    try {
        const response = await fetch('get_csrf_token.php');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        csrfToken = data.csrf_token;
        console.log('CSRF Token fetched successfully.');
    } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
    }
}

// Fetch the token as soon as the script loads.
document.addEventListener('DOMContentLoaded', () => {
    getCsrfToken();
});
```

---

### Step 3: Including the Token in AJAX Requests (JavaScript)

For any state-changing operations (like submitting a comment), the client must include the fetched token in a custom HTTP header. The `X-CSRF-Token` header is a common convention [ref: 0-0, 1-4].

**Procedure:**
*   When making a `fetch` request, add a `headers` object to the options.
*   Inside the `headers` object, create a key for your custom header (e.g., `'X-CSRF-Token'`) and set its value to the stored `csrfToken` variable.

**Code Example: `app.js` (Submitting Data with Token)**

```javascript
// app.js (continued)

/**
 * Example function to submit a comment to the server.
 * It includes the CSRF token in the request headers.
 * @param {object} commentData - The data to be sent.
 */
async function addComment(commentData) {
    // Ensure the token has been fetched before making the request.
    if (!csrfToken) {
        console.error('CSRF token is not available. Aborting request.');
        alert('Could not verify your request. Please refresh the page and try again.');
        return;
    }

    try {
        const response = await fetch('add_comment.php', {
            method: 'POST',
            headers: {
                // Include the CSRF token in a custom header. [ref: 0-0]
                'X-CSRF-Token': csrfToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commentData)
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Comment added:', result);
            alert('Comment added successfully!');
        } else {
            // Handle HTTP errors like 403 Forbidden for a failed CSRF check.
            console.error('Failed to add comment. Status:', response.status);
            alert('Error: Could not add comment. Your session may have expired.');
        }
    } catch (error) {
        console.error('Error submitting comment:', error);
    }
}

// Example usage:
// This would typically be triggered by a form submission.
// const myForm = document.getElementById('comment-form');
// myForm.addEventListener('submit', (event) => {
//     event.preventDefault();
//     const data = { comment: 'This is a test comment.' };
//     addComment(data);
// });
```

---

### Step 4: Validating the Token on the Server (PHP)

The final step is for the protected server-side script (e.g., `add_comment.php`) to validate the token sent by the client.

**Procedure:**
1.  Start the session to access the token stored in `$_SESSION`.
2.  Verify that the request method is one that changes state (e.g., `POST`).
3.  Retrieve the submitted token from the custom `X-CSRF-Token` header. The `getallheaders()` function is useful for this.
4.  Retrieve the expected token from the session.
5.  Compare the two tokens using a timing-safe comparison function like `hash_equals()` to prevent timing attacks [ref: 0-4, 0-0]. A simple `==` or `===` comparison is vulnerable [ref: 0-4].
6.  If validation fails, immediately stop execution and send an error response, such as an HTTP 403 Forbidden status code [ref: 0-0].

**Code Example: `add_comment.php`**

```php
<?php
// add_comment.php

// Start the session to access the stored token.
session_start();

// Only process POST requests.
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // --- CSRF Token Validation ---

    // Get all request headers.
    $headers = getallheaders();
    $submittedToken = isset($headers['X-CSRF-Token']) ? $headers['X-CSRF-Token'] : null;

    // Get the token stored in the session.
    $storedToken = isset($_SESSION['csrf_token']) ? $_SESSION['csrf_token'] : null;

    // Validate the token.
    // 1. Check if both tokens exist.
    // 2. Use hash_equals() for a timing-attack-safe comparison. [ref: 0-0]
    if (
        $submittedToken === null ||
        $storedToken === null ||
        !hash_equals($storedToken, $submittedToken)
    ) {
        // If tokens do not match, send a 403 Forbidden response and terminate.
        http_response_code(403);
        die('CSRF token validation failed');
    }

    // --- End of CSRF Validation ---

    // If validation is successful, proceed with processing the request.
    // For example, get the JSON payload from the request body.
    $json = file_get_contents('php://input');
    $data = json_decode($json);

    // (Here you would add the comment to the database)
    // ...

    // Send a success response.
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success', 'message' => 'Comment added.']);

} else {
    // If not a POST request, send a 405 Method Not Allowed response.
    http_response_code(405);
    die('Method Not Allowed');
}
?>
```