# Security Guidelines - Radio Adamowo

*Comprehensive security implementation guide for Radio Adamowo platform*

## 🔒 Implemented Security Features

### CSRF Protection
- **Synchronized Token Pattern** implementation
- **Unique tokens** per session with 32-byte entropy
- **Header-based validation** (`X-CSRF-Token`)
- **Automatic token refresh** on expiration

**Implementation:**
```php
// Token generation in api-csrf-token-optimized.php
class CSRFTokenManager {
    public function generateToken(): string {
        $token = bin2hex(random_bytes(32));
        $_SESSION['csrf_token'] = $token;
        $_SESSION['csrf_token_time'] = time();
        return $token;
    }
    
    public function validateToken(string $token): bool {
        $storedToken = $_SESSION['csrf_token'] ?? null;
        $tokenTime = $_SESSION['csrf_token_time'] ?? 0;
        
        // Check token existence and age (30 minutes max)
        if (!$storedToken || (time() - $tokenTime) > 1800) {
            return false;
        }
        
        return hash_equals($storedToken, $token);
    }
}
```

### Rate Limiting
- **Token requests**: 20 per minute per session
- **Comment submissions**: 5 per 10 minutes per session  
- **IP-based tracking** for additional protection
- **Sliding window** algorithm implementation

**Configuration:**
```php
'rate_limits' => [
    'general' => ['requests' => 60, 'window' => 60], // 60 req/min
    'comment' => ['requests' => 10, 'window' => 600], // 10 comments/10min
    'token' => ['requests' => 20, 'window' => 60]     // 20 tokens/min
]
```

### SQL Injection Prevention
- **PDO prepared statements** across all database operations
- **Type-safe parameter binding**
- **Input validation** before database queries
- **Query logging** for security monitoring

**Example:**
```php
public function getCommentsByDate(string $date): array {
    $stmt = $this->connection->prepare(
        "SELECT id, name, text, created_at 
         FROM calendar_comments 
         WHERE comment_date = ? AND approved = 1 
         ORDER BY created_at DESC"
    );
    
    $stmt->bindParam(1, $date, PDO::PARAM_STR);
    $stmt->execute();
    
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
```

### XSS Protection
- **Input sanitization** with `htmlspecialchars()`
- **Content-Type headers** properly set
- **CSP headers** implementation
- **Output encoding** for all user content

```php
public function sanitizeInput(array $input): array {
    $sanitized = [];
    foreach ($input as $key => $value) {
        if (is_string($value)) {
            $sanitized[$key] = htmlspecialchars(
                trim($value), 
                ENT_QUOTES | ENT_HTML5, 
                'UTF-8'
            );
        }
    }
    return $sanitized;
}
```

### Data Validation
- **Multi-layer validation** (client + server)
- **Type checking** with strict typing
- **Business rule validation**
- **Regex pattern matching** for complex inputs

**Validation Rules:**
```php
private const VALIDATION_RULES = [
    'date' => '/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/',
    'name' => '/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]{2,50}$/u',
    'comment' => '/^.{5,1000}$/s',
    'email' => FILTER_VALIDATE_EMAIL
];
```

## 🛠️ Development Security Practices

### Code Review Requirements
- [x] **Security-focused code review** for all changes
- [x] **Dependency updates** regularly applied  
- [x] **Static analysis** tools integrated in CI/CD
- [ ] **Penetration testing** before major releases

### Secure Coding Guidelines
1. **Never trust user input** - validate everything
2. **Use parameterized queries** - prevent SQL injection
3. **Encode output** - prevent XSS attacks
4. **Implement proper authentication** - secure session management
5. **Apply principle of least privilege** - minimal required permissions
6. **Keep dependencies updated** - patch known vulnerabilities

**Example Secure Endpoint:**
```php
<?php
define('RADIO_ADAMOWO_API', true);
require_once 'config-optimized.php';

try {
    $dbConfig = OptimizedDatabaseConfig::getInstance();
    
    // 1. Method validation
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new MethodNotAllowedException();
    }
    
    // 2. Rate limiting
    $clientId = hash('sha256', $_SERVER['REMOTE_ADDR'] . $_SERVER['HTTP_USER_AGENT']);
    if (!$dbConfig->checkRateLimit($clientId, 'comment')) {
        throw new RateLimitExceededException();
    }
    
    // 3. CSRF validation
    $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;
    if (!$dbConfig->validateCSRFToken($token)) {
        throw new InvalidCSRFTokenException();
    }
    
    // 4. Input validation and sanitization
    $input = json_decode(file_get_contents('php://input'), true);
    $sanitized = $dbConfig->sanitizeInput($input);
    $validated = $dbConfig->validateInput($sanitized);
    
    // 5. Business logic execution
    $result = $dbConfig->addComment($validated);
    
    // 6. Secure response
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['success' => true, 'data' => $result]);
    
} catch (SecurityException $e) {
    http_response_code($e->getCode());
    echo json_encode(['error' => $e->getMessage(), 'code' => $e->getErrorCode()]);
} catch (Exception $e) {
    error_log('API Error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
```

## 🔧 Production Security Checklist

### Server Configuration
- [x] **HTTPS only** with valid SSL certificate
- [x] **HSTS headers** enabled
- [x] **Security headers** configured:
  ```
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff  
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
  ```

### Database Security
- [x] **Separate database user** with minimal privileges
- [ ] **Connection encryption** enabled
- [ ] **Regular backups** with encryption
- [ ] **Database firewall** configured

### Application Security
- [x] **Environment variables** for sensitive data
- [x] **Error logging** without sensitive information exposure
- [x] **Session configuration** hardened:
  ```php
  session_start([
      'cookie_lifetime' => 86400,
      'cookie_secure' => true, 
      'cookie_httponly' => true,
      'cookie_samesite' => 'Strict',
      'use_strict_mode' => true,
      'use_cookies' => true,
      'use_only_cookies' => true
  ]);
  ```

### Monitoring & Alerting
- [x] **Security event logging** in place
- [ ] **Failed login attempt monitoring**
- [ ] **Unusual traffic pattern detection**
- [ ] **Real-time security alerts**

## 🚨 Security Incident Response

### Detection
1. **Automated monitoring** alerts
2. **Log analysis** for suspicious patterns
3. **User reports** of unusual behavior
4. **Third-party security notifications**

### Response Process
1. **Immediate containment** - isolate affected systems
2. **Impact assessment** - determine scope of compromise
3. **Evidence collection** - preserve logs and forensic data
4. **Mitigation** - patch vulnerabilities, reset credentials
5. **Recovery** - restore normal operations
6. **Lessons learned** - update security measures

### Contact Information
- **Security Team**: security@radioadamowo.pl
- **Emergency Hotline**: +48 XXX XXX XXX
- **Incident Report**: https://radioadamowo.pl/security/report

## 🏅 Security Compliance

This application follows these security standards:
- **OWASP Application Security Verification Standard (ASVS)**
- **NIST Cybersecurity Framework**
- **CWE/SANS Top 25 Most Dangerous Software Errors**
- **GDPR compliance** for data protection

### Security Audit Schedule
- **Monthly**: Dependency vulnerability scans
- **Quarterly**: Penetration testing
- **Annually**: Comprehensive security audit
- **As needed**: After major changes or incidents

### Security Metrics
- **Security incidents**: Target 0 critical/month
- **Vulnerability patches**: Within 24h for critical
- **Security training**: 100% team completion
- **Compliance score**: 95%+ on security audits

---

**Last Updated**: Styczeń 2025  
**Security Contact**: security@radioadamowo.pl  
**Emergency Response**: Available 24/7  
**Next Security Audit**: Q1 2025