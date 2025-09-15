# Radio Adamowo - Complete Implementation Plan

## MVP Todo List

### Core Files to Create/Fix:
1. **index.html** - Fixed HTML without arbitrary Tailwind bg-[url()] classes
2. **styles.css** - Fixed CSS with proper SVG background strategy
3. **app.js** - Enhanced with Hls.js integration and Media Session API
4. **manifest.json** - Complete PWA manifest
5. **sw.js** - Service Worker with proper caching strategy
6. **playlist.json** - Music playlist data
7. **package.json** - Project dependencies and scripts
8. **vite.config.js** - Vite configuration with PWA plugin

### Backend PHP Files:
1. **db_config.php** - Database connection with environment variables
2. **get_csrf_token.php** - CSRF token generation
3. **add_comment.php** - Secure comment addition with PDO
4. **get_comments.php** - Comment retrieval
5. **schema.sql** - Database schema

### Documentation:
1. **README.md** - Installation and usage instructions
2. **SECURITY.md** - Security guidelines
3. **LIGHTHOUSE.md** - PWA checklist

### Key Fixes:
- Remove all bg-[url('data:...svg...')] arbitrary Tailwind classes
- Use consistent CSS background strategy with .hero-bg class
- Integrate Hls.js for streaming with Safari fallback
- Implement proper PWA with offline support
- Add CSRF protection and rate limiting
- Create complete database schema
- Ensure no stream caching in Service Worker

### File Structure:
```
/
├── index.html
├── styles.css
├── app.js
├── manifest.json
├── sw.js
├── playlist.json
├── package.json
├── vite.config.js
├── schema.sql
├── db_config.php
├── get_csrf_token.php
├── add_comment.php
├── get_comments.php
├── README.md
├── SECURITY.md
└── LIGHTHOUSE.md
```