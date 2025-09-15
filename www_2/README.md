# Radio Adamowo

Radio Adamowo to progresywna aplikacja webowa typu PWA (Progressive Web App) poświęcona edukacji na temat toksycznych relacji i manipulacji psychologicznej. Aplikacja łączy funkcjonalność radia internetowego z interaktywnymi narzędziami edukacyjnymi.

## Funkcje

- 🎵 **Radio strumieniowe** z obsługą HLS.js i fallback dla Safari
- 📱 **PWA** - instalowalna aplikacja z obsługą offline
- 🎨 **Audio Visualizer** z Web Audio API
- 💬 **System komentarzy** z zabezpieczeniem CSRF
- 🤖 **Symulator AI** do treningu reakcji na manipulację
- 🔒 **Bezpieczeństwo** - rate limiting, walidacja danych, ochrona XSS/SQLi
- 📊 **Media Session API** - integracja z systemowymi kontrolkami mediów

## Instalacja

### Wymagania

- Node.js 16+ i npm/pnpm
- PHP 8.0+
- MySQL/MariaDB 8.0+
- Serwer web (Apache/Nginx) lub środowisko deweloperskie

### Kroki instalacji

1. **Klonowanie projektu**
```bash
git clone <repository-url>
cd radio-adamowo
```

2. **Instalacja zależności**
```bash
pnpm install
# lub
npm install
```

3. **Konfiguracja bazy danych**
```bash
# Utwórz bazę danych i zaimportuj schemat
mysql -u root -p < schema.sql
```

4. **Zmienne środowiskowe**
Ustaw następujące zmienne środowiskowe:
```bash
export DB_HOST=127.0.0.1
export DB_USER=radio_adamowo
export DB_PASS=twoje_haslo
export DB_NAME=radio_adamowo
export DB_PORT=3306
export FRONTEND_URL=http://localhost:3000
```

5. **Uruchomienie deweloperskie**
```bash
pnpm run dev
```

6. **Build produkcyjny**
```bash
pnpm run build
pnpm run preview
```

## Konfiguracja serwera

### Apache (.htaccess)
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [QSA,L]

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
```

### Nginx
```nginx
location / {
    try_files $uri $uri/ /index.html;
}

location ~ \.php$ {
    fastcgi_pass unix:/var/run/php/php8.0-fpm.sock;
    fastcgi_index index.php;
    include fastcgi_params;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
}

# Security headers
add_header X-Content-Type-Options nosniff;
add_header X-Frame-Options DENY;
add_header X-XSS-Protection "1; mode=block";
```

## Struktura projektu

```
radio-adamowo/
├── index.html          # Główny plik HTML
├── styles.css          # Style CSS (bez arbitrary Tailwind classes)
├── app.js             # Główna logika aplikacji z HLS.js
├── sw.js              # Service Worker (nie cache'uje streamów)
├── manifest.json      # PWA manifest
├── playlist.json      # Playlista muzyczna
├── package.json       # Zależności Node.js
├── vite.config.js     # Konfiguracja Vite z PWA
├── schema.sql         # Schemat bazy danych
├── db_config.php      # Konfiguracja połączenia z bazą
├── get_csrf_token.php # Endpoint dla tokenów CSRF
├── add_comment.php    # Dodawanie komentarzy
├── get_comments.php   # Pobieranie komentarzy
├── README.md          # Ten plik
├── SECURITY.md        # Wytyczne bezpieczeństwa
└── LIGHTHOUSE.md      # Checklista PWA
```

## Testowanie

### Testy funkcjonalności
```bash
# Sprawdź czy aplikacja startuje bez błędów
pnpm run dev

# Sprawdź linting
pnpm run lint

# Sprawdź build
pnpm run build
```

### Testy bezpieczeństwa
- Sprawdź działanie CSRF protection
- Przetestuj rate limiting
- Zweryfikuj walidację danych wejściowych
- Sprawdź zabezpieczenia przed XSS/SQLi

### Testy PWA
- Sprawdź instalowalność aplikacji
- Przetestuj działanie offline
- Zweryfikuj caching strategy
- Sprawdź Service Worker registration

## Deployment

### Środowisko produkcyjne

1. **Zbuduj aplikację**
```bash
pnpm run build
```

2. **Skopiuj pliki na serwer**
```bash
rsync -av dist/ user@server:/var/www/radio-adamowo/
rsync -av *.php user@server:/var/www/radio-adamowo/
```

3. **Ustaw uprawnienia**
```bash
chmod 644 *.php
chmod 755 /var/www/radio-adamowo
```

4. **Konfiguruj zmienne środowiskowe na serwerze**

## Rozwiązywanie problemów

### Błąd parse5 (Vite)
✅ **Naprawione** - usunięto wszystkie arbitrary Tailwind classes `bg-[url('data:...')]`

### Stream nie działa
- Sprawdź konfigurację STREAM_URL w app.js
- Zweryfikuj czy serwer streamingu obsługuje CORS
- Sprawdź czy HLS.js jest poprawnie załadowany

### PWA nie instaluje się
- Sprawdź manifest.json
- Zweryfikuj Service Worker registration
- Sprawdź HTTPS (wymagane dla PWA)

### Błędy bazy danych
- Sprawdź zmienne środowiskowe
- Zweryfikuj uprawnienia użytkownika MySQL
- Sprawdź czy schemat został zaimportowany

## Wsparcie

Jeśli napotkasz problemy:
1. Sprawdź logi przeglądarki (F12 → Console)
2. Sprawdź logi serwera PHP
3. Zweryfikuj konfigurację zmiennych środowiskowych
4. Upewnij się, że wszystkie zależności są zainstalowane

## Licencja

MIT License - zobacz plik LICENSE dla szczegółów.

## Kontakt

Radio Adamowo Team
- Email: contact@radioadamowo.pl
- Website: https://radioadamowo.pl