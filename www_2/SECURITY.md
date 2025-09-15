# Security Guidelines - Radio Adamowo

## Przegląd bezpieczeństwa

Radio Adamowo implementuje wielowarstwowe zabezpieczenia zgodnie z najlepszymi praktykami bezpieczeństwa aplikacji webowych.

## Zaimplementowane zabezpieczenia

### 1. CSRF Protection
- ✅ Tokeny CSRF generowane przez `get_csrf_token.php`
- ✅ Walidacja tokenów w `add_comment.php`
- ✅ Tokeny przechowywane w sesji PHP
- ✅ Automatyczne odświeżanie tokenów

### 2. Rate Limiting
- ✅ 20 żądań/minutę dla tokenów CSRF
- ✅ 10 żądań/minutę dla komentarzy
- ✅ Śledzenie per IP address
- ✅ Automatyczne czyszczenie starych wpisów

### 3. Input Validation & Sanitization
- ✅ Walidacja formatu daty (regex)
- ✅ Ograniczenia długości pól (2-50 znaków dla imienia, 5-1000 dla tekstu)
- ✅ Filtrowanie adresów IP
- ✅ Sanityzacja HTML na wyjściu (`htmlspecialchars`)
- ✅ Filtrowanie potencjalnie niebezpiecznej zawartości

### 4. SQL Injection Prevention
- ✅ Prepared statements we wszystkich zapytaniach SQL
- ✅ Parametryzowane zapytania
- ✅ Walidacja typów danych
- ✅ Ograniczenie uprawnień użytkownika bazy danych

### 5. XSS Protection
- ✅ Content Security Policy headers
- ✅ Sanityzacja danych wyjściowych
- ✅ Walidacja zawartości przed zapisem
- ✅ X-XSS-Protection headers

### 6. HTTP Security Headers
```php
// Zaimplementowane nagłówki
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Content-Security-Policy: default-src \'self\'; script-src \'self\'; object-src \'none\';');
```

### 7. Session Security
- ✅ Secure session configuration
- ✅ HTTPOnly cookies
- ✅ SameSite cookies
- ✅ Session timeout (24h)

### 8. Database Security
- ✅ Separate database user z ograniczonymi uprawnieniami
- ✅ UTF-8 encoding (utf8mb4)
- ✅ Prepared statements
- ✅ Connection error handling

## Konfiguracja produkcyjna

### 1. Zmienne środowiskowe
```bash
# Ustaw silne hasła
export DB_PASS="complex_password_here"
export DB_USER="radio_adamowo_user"

# Ustaw właściwą domenę
export FRONTEND_URL="https://radioadamowo.pl"
```

### 2. PHP Configuration (php.ini)
```ini
# Wyłącz wyświetlanie błędów
display_errors = Off
display_startup_errors = Off
log_errors = On
error_log = /var/log/php_errors.log

# Session security
session.cookie_secure = 1
session.cookie_httponly = 1
session.cookie_samesite = "Strict"
session.use_strict_mode = 1

# Inne ustawienia bezpieczeństwa
expose_php = Off
allow_url_fopen = Off
allow_url_include = Off
```

### 3. MySQL Security
```sql
-- Utwórz dedykowanego użytkownika
CREATE USER 'radio_adamowo'@'localhost' IDENTIFIED BY 'strong_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON radio_adamowo.* TO 'radio_adamowo'@'localhost';
FLUSH PRIVILEGES;

-- Usuń niepotrzebne uprawnienia
REVOKE ALL PRIVILEGES ON *.* FROM 'radio_adamowo'@'localhost';
```

### 4. Web Server Configuration

#### Apache
```apache
# .htaccess
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; media-src 'self'; connect-src 'self'"
</IfModule>

# Ukryj informacje o serwerze
ServerTokens Prod
ServerSignature Off
```

#### Nginx
```nginx
# Security headers
add_header X-Content-Type-Options nosniff;
add_header X-Frame-Options DENY;
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; media-src 'self'; connect-src 'self'";

# Hide server version
server_tokens off;
```

## Monitoring i audyt

### 1. Log Monitoring
```bash
# Monitoruj logi PHP
tail -f /var/log/php_errors.log

# Monitoruj logi serwera web
tail -f /var/log/apache2/error.log
tail -f /var/log/nginx/error.log
```

### 2. Security Checklist
- [ ] Zmienne środowiskowe ustawione
- [ ] Silne hasła do bazy danych
- [ ] HTTPS włączony (certyfikat SSL)
- [ ] Firewall skonfigurowany
- [ ] Regularne backupy bazy danych
- [ ] Aktualizacje bezpieczeństwa zainstalowane
- [ ] Logi monitorowane
- [ ] Rate limiting działa
- [ ] CSRF protection aktywny

### 3. Testy bezpieczeństwa

#### Test CSRF Protection
```bash
# Test bez tokena (powinien zwrócić 403)
curl -X POST http://localhost/add_comment.php \
  -H "Content-Type: application/json" \
  -d '{"date":"2025-01-01","name":"Test","text":"Test message"}'
```

#### Test Rate Limiting
```bash
# Wyślij więcej niż 10 żądań w minutę
for i in {1..15}; do
  curl -X POST http://localhost/add_comment.php \
    -H "Content-Type: application/json" \
    -H "X-CSRF-Token: valid_token" \
    -d '{"date":"2025-01-01","name":"Test","text":"Test message"}'
done
```

#### Test SQL Injection
```bash
# Test z potencjalnie niebezpiecznym inputem
curl -X POST http://localhost/add_comment.php \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: valid_token" \
  -d '{"date":"2025-01-01","name":"Robert\"; DROP TABLE calendar_comments; --","text":"Test"}'
```

## Incident Response

### W przypadku wykrycia ataku:

1. **Natychmiastowe działania**
   - Zablokuj podejrzane IP w firewall
   - Sprawdź logi pod kątem innych podejrzanych aktywności
   - Zmień hasła dostępowe

2. **Analiza**
   - Przeanalizuj logi serwera i aplikacji
   - Sprawdź integralność danych w bazie
   - Zidentyfikuj wektor ataku

3. **Naprawa**
   - Załataj lukę bezpieczeństwa
   - Zaktualizuj zabezpieczenia
   - Przywróć dane z backupu jeśli potrzeba

4. **Prewencja**
   - Wzmocnij monitorowanie
   - Zaktualizuj procedury bezpieczeństwa
   - Przeprowadź dodatkowe testy

## Kontakt bezpieczeństwa

W przypadku wykrycia luki bezpieczeństwa:
- Email: security@radioadamowo.pl
- Użyj odpowiedzialnego ujawniania (responsible disclosure)
- Nie publikuj szczegółów publicznie przed naprawą

## Aktualizacje

Ten dokument jest regularnie aktualizowany. Ostatnia aktualizacja: 2025-01-10