# Radio Adamowo - Deployment Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 2. Database Setup
```bash
# Import the comprehensive schema
mysql -u root -p < schema-comprehensive.sql

# Or use your preferred database administration tool
```

### 3. Environment Configuration
Create `.env.local` or set environment variables:

```bash
# Database Configuration
export DB_HOST=localhost
export DB_USER=radio_adamowo
export DB_PASS=your_secure_password
export DB_NAME=radio_adamowo
export DB_PORT=3306

# Application Configuration
export FRONTEND_URL=https://yourdomain.com
export NODE_ENV=production
```

### 4. Build and Test
```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Files Overview

### Core Application Files
- `app-comprehensive.js` - Main application logic with all features
- `config-enhanced.php` - Security framework and database configuration
- `api-*.php` - Secure API endpoints with CSRF protection
- `sw-comprehensive.js` - Advanced service worker with intelligent caching
- `schema-comprehensive.sql` - Complete database schema with optimization

### Configuration
- `vite.config.js` - Advanced build configuration with PWA support
- `package.json` - Enhanced with comprehensive dependencies
- `.gitignore` - Proper exclusions for build artifacts

### Documentation
- `README_COMPREHENSIVE.md` - Complete project documentation
- `DEPLOYMENT.md` - This deployment guide

## Security Features
- CSRF protection on all state-changing endpoints
- Rate limiting: 20 tokens/min, 10 comments/min
- SQL injection prevention with PDO prepared statements
- XSS protection with proper output escaping
- Input validation and sanitization
- Secure session management

## Performance Features
- Bundle splitting and lazy loading
- Intelligent caching by content type
- Service worker with offline support
- Optimized database queries with indexes
- CDN-ready asset organization

## Production Deployment
1. Configure web server (Apache/Nginx) with security headers
2. Set up SSL/TLS certificates
3. Configure environment variables
4. Run database migrations
5. Build and deploy application files
6. Test all functionality

## Monitoring
- Check service worker registration
- Monitor cache hit rates
- Verify security headers
- Test offline functionality
- Monitor database performance

The application is now production-ready with enterprise-grade security and performance optimization.