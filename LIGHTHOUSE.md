# PWA Lighthouse Checklist - Radio Adamowo

## Przegląd

Ten dokument zawiera kompletną checklistę dla audytu PWA (Progressive Web App) zgodnie ze standardami Google Lighthouse.

## Performance (Wydajność)

### ✅ Core Web Vitals
- [ ] **Largest Contentful Paint (LCP)** < 2.5s
- [ ] **First Input Delay (FID)** < 100ms
- [ ] **Cumulative Layout Shift (CLS)** < 0.1

### ✅ Optymalizacje zasobów
- [x] Kompresja CSS i JavaScript
- [x] Optymalizacja obrazów (WebP, odpowiednie rozmiary)
- [x] Lazy loading dla obrazów
- [x] Preload krytycznych zasobów
- [x] Minimalizacja HTTP requests

### ✅ Caching Strategy
- [x] Service Worker z odpowiednią strategią cache
- [x] Cache-Control headers dla statycznych zasobów
- [x] Brak cache'owania dla streamów (.m3u8, .ts)

## Accessibility (Dostępność)

### ✅ ARIA i semantyka
- [x] Odpowiednie aria-labels dla wszystkich interaktywnych elementów
- [x] Semantyczne HTML elementy (nav, main, section, header, footer)
- [x] Role attributes gdzie potrzebne
- [x] Alt text dla obrazów

### ✅ Nawigacja klawiaturą
- [x] Wszystkie interaktywne elementy dostępne przez Tab
- [x] Widoczny focus indicator
- [x] Logiczna kolejność tabulacji
- [x] Escape key zamyka modalne

### ✅ Kontrast i czytelność
- [x] Kontrast tekstu min. 4.5:1 dla normalnego tekstu
- [x] Kontrast tekstu min. 3:1 dla dużego tekstu
- [x] Responsywny design
- [x] Tekst skaluje się do 200% bez utraty funkcjonalności

## Best Practices (Najlepsze praktyki)

### ✅ Bezpieczeństwo
- [x] HTTPS w produkcji
- [x] Content Security Policy headers
- [x] Brak mieszanej zawartości (mixed content)
- [x] Secure cookies (w produkcji)

### ✅ Nowoczesne standardy
- [x] Doktype HTML5
- [x] Meta viewport tag
- [x] Charset declaration
- [x] Brak deprecated APIs

### ✅ Obrazy i media
- [x] Odpowiednie formaty obrazów
- [x] Rozmiary obrazów dostosowane do wyświetlania
- [x] Fallback dla audio elementów

## PWA (Progressive Web App)

### ✅ Manifest
- [x] **Web App Manifest** obecny i poprawny
- [x] **name** i **short_name** zdefiniowane
- [x] **icons** - minimum 192x192 i 512x512
- [x] **start_url** zdefiniowany
- [x] **display** ustawiony na "standalone"
- [x] **theme_color** i **background_color**
- [x] **description** aplikacji

### ✅ Service Worker
- [x] **Service Worker** zarejestrowany
- [x] **Offline functionality** - podstawowe UI działa offline
- [x] **Cache strategy** - Cache First dla statycznych zasobów
- [x] **Network First/Only** dla dynamicznych danych i streamów
- [x] **Fallback** do index.html dla nawigacji

### ✅ Instalowalność
- [x] Spełnia kryteria instalowalności PWA
- [x] Prompt instalacji może być wyświetlony
- [x] Aplikacja działa po instalacji
- [x] Ikony wyświetlają się poprawnie

### ✅ App-like experience
- [x] **Splash screen** konfiguracja
- [x] **Theme color** w meta tag
- [x] **Viewport** meta tag
- [x] **Apple touch icons** dla iOS

## SEO (Search Engine Optimization)

### ✅ Meta tags
- [x] **Title** tag unikalny i opisowy
- [x] **Meta description** zdefiniowany
- [x] **Meta viewport** dla responsywności
- [x] **Lang** attribute w HTML

### ✅ Struktura
- [x] **H1** tag obecny i unikalny
- [x] Hierarchia nagłówków (H1-H6)
- [x] **Alt** text dla obrazów
- [x] Poprawna struktura linków

### ✅ Crawlability
- [x] **robots.txt** (jeśli potrzebny)
- [x] Brak błędów 404 dla kluczowych zasobów
- [x] Canonical URLs

## Testy Lighthouse

### Uruchamianie testów

#### 1. Chrome DevTools
```bash
# Otwórz DevTools (F12)
# Przejdź do zakładki Lighthouse
# Wybierz kategorie: Performance, Accessibility, Best Practices, PWA, SEO
# Kliknij "Generate report"
```

#### 2. CLI Lighthouse
```bash
# Instalacja
npm install -g lighthouse

# Uruchomienie testu
lighthouse https://radioadamowo.pl --output html --output-path ./lighthouse-report.html

# Test PWA
lighthouse https://radioadamowo.pl --only-categories=pwa --output json --output-path ./pwa-report.json
```

#### 3. CI/CD Integration
```yaml
# GitHub Actions example
- name: Lighthouse CI
  uses: treosh/lighthouse-ci-action@v9
  with:
    urls: |
      https://radioadamowo.pl
    configPath: './lighthouserc.json'
```

### Oczekiwane wyniki

#### Minimalne wyniki dla produkcji:
- **Performance**: ≥ 90
- **Accessibility**: ≥ 95
- **Best Practices**: ≥ 95
- **PWA**: ≥ 95
- **SEO**: ≥ 90

#### Kluczowe metryki PWA:
- ✅ **Installable**: Tak
- ✅ **Works offline**: Tak
- ✅ **Uses HTTPS**: Tak
- ✅ **Fast and reliable**: Tak
- ✅ **Engaging**: Tak

## Optymalizacje specyficzne dla Radio Adamowo

### 1. Audio Streaming
- [x] HLS.js dla nowoczesnych przeglądarek
- [x] Fallback dla Safari (native HLS)
- [x] Brak cache'owania streamów w Service Worker
- [x] Preload="none" dla audio elementów

### 2. Visualizer
- [x] Canvas optymalizacja (requestAnimationFrame)
- [x] Cleanup przy pauzowaniu
- [x] Responsive canvas sizing

### 3. Interaktywność
- [x] CSRF protection nie blokuje UX
- [x] Rate limiting z odpowiednimi komunikatami
- [x] Graceful degradation przy braku JS

## Debugging i rozwiązywanie problemów

### Częste problemy PWA:

#### 1. "Does not provide a valid apple-touch-icon"
```html
<!-- Dodaj do <head> -->
<link rel="apple-touch-icon" href="/images/icons/icon-192x192.png">
```

#### 2. "Is not configured for a custom splash screen"
```json
// W manifest.json
{
  "background_color": "#121212",
  "theme_color": "#f59e0b"
}
```

#### 3. "Does not work offline"
```javascript
// Sprawdź Service Worker registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

#### 4. "Page does not have a <meta name='viewport'> tag"
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### Performance debugging:
```bash
# Sprawdź rozmiary bundli
npx vite-bundle-analyzer

# Analiza Core Web Vitals
lighthouse --only-categories=performance --form-factor=mobile
```

## Monitoring ciągły

### 1. Automatyczne testy
```javascript
// lighthouserc.json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.95}],
        "categories:best-practices": ["error", {"minScore": 0.95}],
        "categories:pwa": ["error", {"minScore": 0.95}],
        "categories:seo": ["error", {"minScore": 0.9}]
      }
    }
  }
}
```

### 2. Real User Monitoring (RUM)
```javascript
// Web Vitals tracking
import {getCLS, getFID, getFCP, getLCP, getTTFB} from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## Aktualizacje i maintenance

- [ ] Miesięczne audyty Lighthouse
- [ ] Monitoring Web Vitals w produkcji
- [ ] Aktualizacje Service Worker przy zmianach
- [ ] Testy PWA na różnych urządzeniach
- [ ] Sprawdzanie kompatybilności z nowymi wersjami przeglądarek

---

**Ostatnia aktualizacja**: 2025-01-10
**Wersja Lighthouse**: 10.x
**Cel**: 100% compliance z PWA standards