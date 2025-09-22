# Testing for XSS Vulnerability in Comments

This document describes how to manually test for the stored XSS vulnerability in the comment submission system.

## Prerequisites

1.  A running instance of the application with the PHP built-in web server. You can start it from the root of the repository with:
    ```bash
    php -S localhost:8000
    ```
2.  `curl` command-line tool.
3.  A MySQL or SQLite database set up according to `db_config.php`. The original code uses MySQL, but for testing purposes, you can adapt it to use SQLite.

## Steps to Reproduce the Vulnerability (Before the Fix)

1.  **Get a CSRF Token:**
    First, you need a valid CSRF token. The session cookie will be stored in `cookie.txt`.
    ```bash
    curl -c cookie.txt http://localhost:8000/get_csrf_token.php
    ```
    Extract the token from the JSON response. Let's say the token is `YOUR_CSRF_TOKEN`.

2.  **Submit a Malicious Comment:**
    Use the CSRF token to submit a comment containing a JavaScript payload.
    ```bash
    curl -X POST -b cookie.txt -H "Content-Type: application/json" -H "X-CSRF-Token: YOUR_CSRF_TOKEN" -d '{"date":"2025-01-01","name":"Attacker","text":"<script>alert(\"XSS\");</script>"}' http://localhost:8000/add_comment.php
    ```

3.  **Fetch the Comments and Verify the Vulnerability:**
    Now, fetch the comments for the date you posted to.
    ```bash
    curl -b cookie.txt http://localhost:8000/get_comments.php?date=2025-01-01
    ```
    **Expected (Vulnerable) Output:**
    The response body will contain the unescaped JavaScript payload:
    ```json
    {
      "status": "success",
      "data": [
        {
          "name": "Attacker",
          "text": "<script>alert(\"XSS\");</script>"
        }
      ]
    }
    ```
    If you see the raw `<script>` tag, the application is vulnerable.

## Verifying the Fix

After applying the fix in `get_comments.php` (adding `htmlspecialchars`), repeat the same steps.

1.  Get a CSRF token.
2.  Submit a malicious comment.
3.  Fetch the comments.

**Expected (Fixed) Output:**
The response body should now contain the *escaped* payload:
```json
{
  "status": "success",
  "data": [
    {
      "name": "Attacker",
      "text": "&lt;script&gt;alert(&quot;XSS&quot;);&lt;/script&gt;"
    }
  ]
}
```
If the script tags are replaced with `&lt;` and `&gt;`, the fix is working correctly.
