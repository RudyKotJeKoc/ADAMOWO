# Research Framework
- **Project Goal & Architecture:** The primary goal is to analyze, fix, and enhance "Radio Adamowo," a lightweight web radio application. The architecture uses a Vite-powered frontend (Vanilla JS, Tailwind CSS) communicating with a PHP backend. The data flow is: UI -> `app.js` -> PHP API -> Database. This will be documented in `ARCHITECTURE.md` with an ASCII diagram.

- **Build Process & UI:** The immediate priority is to fix a Vite build error ("missing-whitespace-between-attributes") caused by an inline SVG in a Tailwind class. The chosen solution is to move the `data:` URI into a dedicated class in `styles.css` and apply it in the HTML. The project will adhere to a performance budget (JS < 200kB minified) and include `.eslintrc.cjs` and `.prettierrc` for code quality.

- **Audio Streaming:** The application will integrate HLS streaming. `app.js` will use `Hls.js` if supported, with a fallback to native HLS for browsers like Safari. The Media Session API will be implemented to provide rich media controls and metadata (title, artwork, play/pause handlers).

- **Progressive Web App (PWA) & Offline:** The application will be an installable PWA.
    - **Service Worker (`sw.js`):** Generated via `vite-plugin-pwa`, it will precache all core UI assets (HTML, CSS, JS, icons) for offline availability. It will be explicitly configured (using `workbox.runtimeCaching`) to **never cache** the HLS stream (`.m3u8`, `.ts` files) or API calls, ensuring live content is always fetched from the network.
    - **Web App Manifest (`manifest.json`):** Contains all necessary properties to make the application installable.
    - **Documentation:** `LIGHTHOUSE.md` will serve as a checklist for verifying PWA functionality. `README.md` will provide setup and build instructions.

- **Backend API and Security (OWASP):** The PHP backend will be hardened against common vulnerabilities.
    - **CSRF Protection:** Implements the Synchronized Token Pattern. `get_csrf_token.php` generates a token, which the client must send in an `X-CSRF-Token` header for state-changing requests like `add_comment.php`.
    - **XSS Prevention:** All dynamic content will be escaped on the client side before rendering to prevent XSS. Unsafe `innerHTML` usage will be avoided.
    - **Rate Limiting:** A simple cool-down mechanism will be implemented on the backend for `add_comment.php`, likely using the `ip_hash` and `created_at` fields in the database to prevent spam.
    - **Security Headers:** A `SECURITY.md` file will be created to propose a `Content-Security-Policy` and other important headers (`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`).

- **Database Interaction and Data Management:**
    - **Secure Configuration:** Database credentials will be loaded from environment variables via `getenv()` in `db_config.php`.
    - **SQL Injection Prevention:** All database queries will exclusively use PDO with prepared statements.
    - **Database Schema:** A `schema.sql` file will define the `comments` table (`id`, `author`, `content`, `ip_hash`, `created_at`). The `README.md` will detail how to import the schema and set up the required environment variables (`DB_HOST`, `DB_NAME`, etc.).

# Search Plan
1.  Research the method of moving an inline `data:image/svg+xml` URI from a Tailwind HTML class into a separate `.css` file to fix the Vite `parse5` build error, including correct URL encoding for the SVG data.

2.  Investigate the implementation of `Hls.js` in `app.js`, including the `Hls.isSupported()` check and the logic for falling back to native HLS playback on platforms like Safari.

3.  Explore the integration of the Media Session API to set playback metadata (e.g., `title`, `artist`, `artwork`) and handle media events like `play`, `pause`, `nexttrack`, and `previoustrack`.

4.  Analyze the configuration of `vite-plugin-pwa`, specifically focusing on the `workbox.runtimeCaching` options to define a `cacheFirst` strategy for UI assets and a `networkOnly` strategy for API calls and HLS stream files (`.m3u8`, `.ts`).

5.  Review the complete Synchronized Token Pattern for CSRF protection, covering token generation in a PHP session, fetching via `app.js`, and validation in an `X-CSRF-Token` header on the server.

6.  Research simple, database-driven rate-limiting techniques in PHP. The focus will be on querying the `comments` table for the latest entry from a given `ip_hash` to enforce a cool-down period before allowing a new insertion.

7.  Formulate a strict `Content-Security-Policy` (CSP) for the application, and research the purpose and syntax for other security headers (`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) to be documented in `SECURITY.md`.

8.  Verify that all PHP database interactions use PDO with prepared statements, ensuring parameters are correctly bound in both `INSERT` (`add_comment.php`) and `SELECT` (`get_comments.php`) queries to prevent SQL injection.

9.  Plan the structure and content for all new documentation files: `ARCHITECTURE.md` (with an ASCII data flow diagram), `SECURITY.md`, `README.md` (with full setup instructions), `LIGHTHOUSE.md` (PWA test checklist), and `schema.sql`.

10. Research standard `.eslintrc.cjs` and `.prettierrc` configurations for a modern Vanilla JS project to enforce code quality and consistency.