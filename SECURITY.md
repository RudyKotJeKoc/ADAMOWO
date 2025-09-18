# Security Guidelines

## 🛡️ Security Overview

Radio Adamowo implements multiple layers of security to protect users and data integrity. This document outlines our security measures and best practices.

## 🔒 Implemented Security Features

### CSRF Protection
- **Synchronized Token Pattern** implementation
- **Unique tokens** per session with 32-byte entropy
- **Header-based validation** (`X-CSRF-Token`)
- **Automatic token refresh** on expiration

**Implementation:**
```php
// Token generation in get_csrf_token.php
$_SESSION['csrf_token'] = bin2hex(random_bytes(32));

// Token validation in add_comment.php  
$submitted_token = $headers['X-CSRF-Token'] ?? null;
$stored_token = $_SESSION['csrf_token'] ?? null;
hash_equals($stored_token, $submitted_token);
```

### Rate Limiting
- **Token requests**: 20 per minute per session
- **Comment submissions**: 5 per 10 minutes per session
- **IP-based tracking** for additional protection
- **Sliding window** algorithm implementation

### SQL Injection Prevention
All database operations use **prepared statements**:

```php
$stmt = $conn->prepare("INSERT INTO calendar_comments (comment_date, name, text, ip_address) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $date, $name, $text, $ip_address);
```

### XSS Protection
- **Input validation** with length and format constraints
- **Output encoding** using `htmlspecialchars()`
- **Content-Type headers** properly set
- **CSP headers** recommended for production

### Data Validation
```php
// Date format validation
preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/", $date)

// Text length validation
mb_strlen($name) >= 2 && mb_strlen($name) <= 50
mb_strlen($text) >= 5 && mb_strlen($text) <= 1000
```

## 🔧 Production Security Checklist

### Server Configuration
- [ ] **HTTPS only** with valid SSL certificate
- [ ] **HSTS headers** enabled
- [ ] **Security headers** configured:
  ```
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  ```

### Database Security  
- [ ] **Separate database user** with minimal privileges
- [ ] **Connection encryption** enabled
- [ ] **Regular backups** with encryption
- [ ] **Database firewall** configured

### Application Security
- [ ] **Environment variables** for sensitive data
- [ ] **Error logging** without sensitive information exposure
- [ ] **Session configuration** hardened:
  ```php
  session_start([
      'cookie_lifetime' => 86400,
      'cookie_secure' => true,
      'cookie_httponly' => true,
      'cookie_samesite' => 'Strict'
  ]);
  ```

### CORS Configuration
Update CORS headers for production:
```php
// Replace wildcard with specific domains
header('Access-Control-Allow-Origin: https://your-domain.com');
```

## 🚨 Vulnerability Reporting

### Responsible Disclosure
If you discover a security vulnerability, please report it responsibly:

1. **DO NOT** create public GitHub issues for security vulnerabilities
2. **Email us directly** at: security@radioadamowo.pl
3. **Include detailed information**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact assessment
   - Suggested fix (if applicable)

### Response Timeline
- **Acknowledgment**: Within 48 hours
- **Initial assessment**: Within 7 days
- **Fix deployment**: Within 30 days (critical issues prioritized)
- **Public disclosure**: After fix verification

## 🔍 Security Monitoring

### Recommended Tools
- **OWASP ZAP** for vulnerability scanning
- **Nessus/OpenVAS** for network security assessment  
- **Snyk** for dependency vulnerability scanning
- **CSP Evaluator** for Content Security Policy validation

### Log Monitoring
Monitor these events in production:
- Failed CSRF token validations
- Rate limiting triggers
- Database connection failures
- Suspicious input patterns
- Multiple failed authentication attempts

## 🛠️ Development Security Practices

### Code Review Requirements
- [ ] **Security-focused code review** for all changes
- [ ] **Dependency updates** regularly applied
- [ ] **Static analysis** tools integrated in CI/CD
- [ ] **Penetration testing** before major releases

### Secure Coding Guidelines
1. **Never trust user input** - validate everything
2. **Use parameterized queries** - prevent SQL injection
3. **Encode output** - prevent XSS attacks
4. **Implement proper authentication** - secure session management
5. **Apply principle of least privilege** - minimal required permissions
6. **Keep dependencies updated** - patch known vulnerabilities

## 📚 Security Resources

### External References
- [OWASP Top 10](https://owasp.org/Top10/)
- [OWASP Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/)
- [PHP Security Best Practices](https://www.php.net/manual/en/security.php)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)

### Training Resources
- [OWASP WebGoat](https://owasp.org/www-project-webgoat/) - Hands-on security training
- [PortSwigger Web Security Academy](https://portswigger.net/web-security) - Free security training
- [SANS Secure Coding Practices](https://www.sans.org/white-papers/2172/) - Development guidelines

## 🏅 Security Compliance

This application follows these security standards:
- **OWASP Application Security Verification Standard (ASVS)**
- **NIST Cybersecurity Framework**
- **CWE/SANS Top 25 Most Dangerous Software Errors**

---

**Last Updated**: December 2024  
**Security Contact**: security@radioadamowo.pl