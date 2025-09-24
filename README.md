# Radio Adamowo - Edukacyjne Radio Internetowe 🎵

**Nowoczesna Aplikacja PWA** poświęcona edukacji o manipulacji psychicznej i toksycznych relacjach.

> **Radio Adamowo** to więcej niż radio - to interaktywna platforma edukacyjna, która przez muzykę, audycje analityczne i interaktywne narzędzia pomaga rozpoznawać i przeciwdziałać manipulacji psychicznej oraz przemocy emocjonalnej.

![Radio Adamowo Screenshot](images/radio-adamowo-homepage.png)

## 🎯 Czemu powstało Radio Adamowo?

W Polsce co roku tysiące osób doświadcza przemocy psychicznej w relacjach rodzinnych i romantycznych. **Radio Adamowo** analizuje prawdziwe studium przypadku manipulacji, aby nauczyć rozpoznawania "czerwonych flag" i wzorców toksycznych zachowań.

**Osiem lat. To nie fatum, to wzorzec.** - główne przesłanie projektu pokazuje, jak manipulacja ma swoje powtarzalne cykle.

## ✨ Główne funkcje

### 🔴 Transmisja na żywo 24/7
- **Streaming HLS** z automatycznym fallbackiem
- **Wizualizacje audio** w czasie rzeczywistym
- **Wsparcie dla wszystkich przeglądarek**
- **Odtwarzanie offline** dzięki Service Worker

### 🎵 Różnorodne treści edukacyjne
- **Playlisty tematyczne** (Ambient, Disco, Hip-Hop)
- **Audycje analityczne** o manipulacji 
- **Interaktywny kalendarz** czerwonych flag
- **Symulator rozmów z manipulatorem (AI)**

### 🔒 Bezpieczeństwo i prywatność
- **Ochrona CSRF** z rate limiting
- **Walidacja danych** i ochrona XSS
- **Lokalne przechowywanie** prywatnych notatek
- **Anonimowe korzystanie** bez rejestracji

### 📱 Nowoczesna technologia
- **PWA** - instalowalna na telefonie i komputerze
- **Offline-first** - działa bez internetu
- **Responsive design** - dostosowana do wszystkich urządzeń  
- **Wysoka wydajność** - Lighthouse Score 95+

## 🚀 Szybki start

### Wymagania systemowe
- **Node.js** 18 lub nowszy
- **PHP** 8.0 lub nowszy  
- **MySQL/MariaDB** baza danych
- **Nowoczesna przeglądarka** (Chrome, Firefox, Safari, Edge)

### Instalacja krok po kroku

1. **Pobierz kod źródłowy**
   ```bash
   git clone https://github.com/RudyKotJeKoc/ADAMOWO.git
   cd ADAMOWO
   ```

2. **Zainstaluj zależności**
   ```bash
   npm install
   # lub jeśli używasz pnpm
   pnpm install
   ```

3. **Skonfiguruj bazę danych**
   ```bash
   # Skopiuj plik konfiguracji
   cp db_config_example.php db_config.php
   # Edytuj db_config.php własnymi danymi do bazy
   ```

4. **Zaimportuj schemat bazy danych**
   ```bash
   mysql -u twoja_nazwa_uzytkownika -p twoja_baza_danych < schema-comprehensive.sql
   ```

5. **Uruchom serwer deweloperski**  
   ```bash
   npm run dev
   ```
   Aplikacja będzie dostępna pod adresem: `http://localhost:3000`

6. **Zbuduj wersję produkcyjną**
   ```bash
   npm run build
   npm run preview
   ```

### 🔧 Rozwiązywanie problemów

**Problem**: `npm install` kończy się błędem
- **Rozwiązanie**: Sprawdź wersję Node.js (`node --version`) - musi być >= 18

**Problem**: Błąd połączenia z bazą danych  
- **Rozwiązanie**: Sprawdź konfigurację w `db_config.php` i uprawnienia użytkownika MySQL

**Problem**: Strumień audio nie działa
- **Rozwiązanie**: Sprawdź czy przeglądarka obsługuje Web Audio API (wszystkie nowoczesne przeglądarki)

## 📁 Struktura projektu

```
ADAMOWO/
├── 🏠 index.html                   # Główna strona aplikacji
├── ⚙️ app.js                       # Logika aplikacji i odtwarzacz
├── 🎨 styles.css                   # Style CSS i motywy
├── 📱 manifest.json                # Manifest PWA
├── 🔧 sw-comprehensive.js          # Service Worker (offline)
├── 🎵 playlist.json                # Lista utworów i podcastów
├── 💬 add_comment.php              # Backend systemu komentarzy  
├── 🛡️ get_csrf_token.php           # Zabezpieczenia CSRF
├── 🖼️ images/                      # Grafiki i ikony aplikacji
├── 📚 docs/                        # Dokumentacja techniczna
└── 🗄️ schema-comprehensive.sql     # Schemat bazy danych
```

### Kluczowe komponenty

- **🎧 Odtwarzacz audio** - Obsługuje HLS streaming i lokalne pliki
- **📅 Kalendarz czerwonych flag** - Interaktywny system notatek  
- **🤖 Symulator AI** - Ćwiczenia rozpoznawania manipulacji
- **📊 Wizualizator audio** - Animacje dźwięku w czasie rzeczywistym
- **🔒 System bezpieczeństwa** - CSRF, rate limiting, walidacja

## 🎵 Konfiguracja streamingu

Aplikacja obsługuje streaming na żywo przez HLS. Skonfiguruj URL streamingu w `app.js`:

```javascript
const STREAM_URL = 'https://twoja-domena.com/live.m3u8';
const FALLBACK_URL = 'https://backup-domena.com/stream';
```

**Obsługiwane formaty:**
- **HLS (.m3u8)** - zalecany dla streamingu na żywo
- **MP3** - dla lokalnych plików audio
- **WebRTC** - planowane w przyszłych wersjach

## 💬 System komentarzy i notatek

Interaktywny kalendarz umożliwia dodawanie prywatnych notatek o "czerwonych flagach":

- **🛡️ Zabezpieczenia CSRF** dla bezpiecznego dodawania
- **⏱️ Rate limiting** (5 komentarzy na 10 minut)  
- **✅ Walidacja danych** i ochrona przed XSS
- **💾 Lokalne przechowywanie** - twoje notatki pozostają prywatne
- **📱 Synchronizacja** między urządzeniami (opcjonalna)

### Jak używać kalendarza notatek:

1. Kliknij wybraną datę w kalendarzu
2. Dodaj swoją obserwację o manipulacji lub toksycznym zachowaniu  
3. Notatki są prywatne i przechowywane lokalnie
4. Możesz eksportować notatki do pliku JSON

## 🔧 Konfiguracja zaawansowana

### Zmienne środowiskowe
Utwórz plik `.env` z konfiguracją:

```env
# Baza danych
DB_HOST=localhost
DB_NAME=radio_adamowo  
DB_USER=twoja_nazwa_uzytkownika
DB_PASS=twoje_haslo
DB_PORT=3306

# Streaming
STREAM_URL=url_twojego_streamu
BACKUP_STREAM_URL=zapasowy_url

# Bezpieczeństwo
CSRF_SECRET=twoj_sekretny_klucz
RATE_LIMIT_WINDOW=600
RATE_LIMIT_MAX=10
```

### Konfiguracja PWA
Dostosuj `manifest.json` do swojego wdrożenia:

```json
{
  "name": "Radio Adamowo",
  "short_name": "Adamowo", 
  "description": "Edukacyjne radio o manipulacji psychicznej",
  "start_url": "/",
  "theme_color": "#f59e0b",
  "background_color": "#121212",
  "display": "standalone"
}
```

## 🧪 Testowanie i jakość kodu

### Audyty wydajności
Regularnie uruchamiaj testy wydajności:

```bash
npm run lighthouse
```

**Cele jakościowe:**
- ✅ **Wydajność**: 95+
- ✅ **Dostępność**: 95+  
- ✅ **Najlepsze praktyki**: 95+
- ✅ **SEO**: 90+
- ✅ **PWA**: 100

### Testowanie bezpieczeństwa
Aplikacja implementuje zabezpieczenia zgodne z **OWASP Top 10**:

- **Ochrona CSRF** - walidacja tokenów
- **Zapobieganie SQL Injection** - przygotowane zapytania PDO
- **Skanowanie XSS** - filtrowanie danych wejściowych  
- **Rate limiting** - ograniczenie częstotliwości żądań
- **Bezpieczne nagłówki HTTP** - CSP, HSTS, X-Frame-Options

### Dostępność (a11y)
- **Etykiety ARIA** dla czytników ekranu
- **Nawigacja klawiaturą** (Tab, Enter, Spacja)
- **Semantyczny HTML** zgodny ze standardami
- **Wysokie kontrasty** i motywy ciemne/jasne
- **Wsparcie dla technologii wspomagających**

## 🏗️ Rozwój aplikacji

### Uruchamianie trybu deweloperskiego
```bash
npm run dev          # Serwer deweloperski z Hot Reload
npm run build        # Budowanie wersji produkcyjnej  
npm run preview      # Podgląd buildu produkcyjnego
npm run lint         # Sprawdzanie kodu ESLint
npm run test         # Uruchamianie testów jednostkowych
```

### Struktura komponentów
- **🎚️ AudioEngine** - zarządzanie odtwarzaniem i streamingiem
- **🎨 UIManager** - interfejs użytkownika i animacje GSAP
- **📊 Visualizer** - wizualizacje audio Canvas/WebGL  
- **💾 DataManager** - lokalne przechowywanie i API
- **🔒 SecurityModule** - zabezpieczenia i walidacja

## 🤝 Współpraca i kontrybucje

**Radio Adamowo** to projekt open source - zachęcamy do współpracy!

### Jak pomóc w rozwoju:

1. **Fork** repozytorium na GitHubie
2. **Utwórz branch** z opisem funkcji (`git checkout -b feature/nowa-funkcja`)  
3. **Commituj zmiany** z jasnymi komunikatami (`git commit -m 'Dodaj nową funkcję'`)
4. **Push branch** (`git push origin feature/nowa-funkcja`)
5. **Otwórz Pull Request** z opisem zmian

### Standardy kodu
- **ESLint** do sprawdzania JavaScript
- **Prettier** do formatowania kodu  
- **Conventional commits** - jasne komunikaty commitów
- **Testy jednostkowe** dla nowych funkcji
- **Dokumentacja** dla API i komponentów

### Obszary, gdzie możesz pomóc:
- 🌐 **Tłumaczenia** na inne języki
- 📱 **Testy na różnych urządzeniach**  
- 🎨 **Ulepszenia interfejsu użytkownika**
- 🔊 **Nowe treści edukacyjne**
- 🐛 **Zgłaszanie i naprawianie błędów**
- 📖 **Dokumentacja i przykłady użycia**

## 📚 Dokumentacja rozszerzona

- **📋 [Pełna dokumentacja](README_COMPREHENSIVE.md)** - szczegółowy opis techniczny
- **🚀 [Przewodnik wdrożenia](DEPLOYMENT.md)** - instrukcje produkcyjne
- **🔧 [Dokumentacja developerska](docs/developer/README.md)** - API i architektura
- **🛡️ [Bezpieczeństwo](SECURITY.md)** - polityki bezpieczeństwa
- **🎯 [Wiki projektu](https://github.com/RudyKotJeKoc/ADAMOWO/wiki)** - tutoriale i FAQ

## 🆘 Wsparcie i pomoc

### Pomoc techniczna
- 📧 **Email**: contact@radioadamowo.pl
- 🐛 **Błędy**: [GitHub Issues](https://github.com/RudyKotJeKoc/ADAMOWO/issues)
- 💬 **Dyskusje**: [GitHub Discussions](https://github.com/RudyKotJeKoc/ADAMOWO/discussions)
- 📖 **Wiki**: [Dokumentacja](https://github.com/RudyKotJeKoc/ADAMOWO/wiki)

### Pomoc w kryzysie - Numery alarmowe
**Jeśli doświadczasz przemocy, nie jesteś sam/sama:**
- 🔵 **Niebieska Linia**: [800 120 002](tel:800120002) (przemoc domowa)
- 👩 **Centrum Praw Kobiet**: [800 120 226](tel:800120226) 
- 🚨 **Telefon Zaufania**: [116 123](tel:116123) (wsparcie emocjonalne)
- 🏥 **Pogotowie ratunkowe**: [999](tel:999) lub [112](tel:112)

## ⚖️ Licencja i prawa autorskie

Ten projekt jest udostępniony na licencji **MIT License** - szczegóły w pliku [LICENSE](LICENSE).

### Zastrzeżenia prawne
- **Treści edukacyjne** służą wyłącznie celom edukacyjnym i analizie zjawisk społecznych
- **Wszelka zbieżność** imion i wydarzeń z rzeczywistością jest przypadkowa
- **Symulacje AI** to narzędzia edukacyjne, nie zastępują profesjonalnej terapii
- **Radio Adamowo** nie świadczy usług medycznych ani terapeutycznych

### Oświadczenie o prywatności
- **Dane lokalne** - notatki przechowywane tylko na twoim urządzeniu
- **Bez śledzenia** - nie gromadzimy danych osobowych
- **Anonimowość** - możesz korzystać bez podawania danych
- **Bezpieczne API** - wszystkie połączenia zabezpieczone HTTPS

## 🙏 Podziękowania 

**Radio Adamowo** powstało dzięki wykorzystaniu doskonałych bibliotek open source:

- **🎵 [HLS.js](https://github.com/video-dev/hls.js/)** - streaming audio na żywo
- **⚡ [Vite](https://vitejs.dev/)** - błyskawiczne narzędzie budowania
- **🎨 [GSAP](https://greensock.com/gsap/)** - profesjonalne animacje
- **🎯 [Tailwind CSS](https://tailwindcss.com/)** - utility-first CSS framework  
- **📊 [Chart.js](https://www.chartjs.org/)** - wizualizacja danych
- **🔧 [Workbox](https://developers.google.com/web/tools/workbox)** - PWA i Service Worker

### Społeczność
Dziękujemy wszystkim, którzy:
- 🐛 **Zgłaszają błędy** i problemy
- 💡 **Proponują nowe funkcje** 
- 🌐 **Pomagają w tłumaczeniach**
- 📖 **Ulepszają dokumentację**
- ❤️ **Wspierają projekt** gwiazdkami na GitHub

---

## 🌟 Podsumowanie

**Radio Adamowo** to unikalna platforma edukacyjna, która:

✅ **Edukuje** o manipulacji psychicznej przez prawdziwe przypadki  
✅ **Chroni prywatność** użytkowników - bez rejestracji i śledzenia  
✅ **Oferuje narzędzia** do rozpoznawania toksycznych zachowań  
✅ **Wspiera** osoby doświadczające przemocy emocjonalnej  
✅ **Używa nowoczesnych technologii** dla lepszego doświadczenia  
✅ **Jest dostępna offline** dzięki technologii PWA  

**💫 Gwiazda na GitHubie** jeśli projekt Ci pomógł!

[![GitHub stars](https://img.shields.io/github/stars/RudyKotJeKoc/ADAMOWO?style=social)](https://github.com/RudyKotJeKoc/ADAMOWO)
[![GitHub forks](https://img.shields.io/github/forks/RudyKotJeKoc/ADAMOWO?style=social)](https://github.com/RudyKotJeKoc/ADAMOWO)
[![GitHub issues](https://img.shields.io/github/issues/RudyKotJeKoc/ADAMOWO)](https://github.com/RudyKotJeKoc/ADAMOWO/issues)

---

📍 **Oficjalna strona**: [https://radioadamowo.pl](https://radioadamowo.pl)  
📧 **Kontakt**: contact@radioadamowo.pl  
🎧 **Słuchaj online**: [Radio Adamowo Live](https://radioadamowo.pl/#live-player)