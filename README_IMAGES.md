# 📸 System Zarządzania Obrazami - Radio Adamowo

**Wersja:** 2.0
**Data:** 2025-12-20
**Status:** ✅ Aktywny

---

## 🎯 Cel Systemu

Centralny system zarządzania grafikami, który pozwala zarządzać wszystkimi obrazami w aplikacji bez konieczności edytowania ścieżek w wielu plikach.

### Korzyści
- ✅ **Jedna zmiana, wszędzie działa** - podmień plik lub zmień mapowanie w jednym miejscu
- ✅ **Type-safety** - autouzupełnianie w IDE, brak literówek
- ✅ **Automatyczny fallback** - placeholder gdy obraz nie istnieje
- ✅ **Lazy loading** - domyślnie dla wszystkich obrazów
- ✅ **Walidacja** - automatyczne wykrywanie placeholderów (ASCII text files)

---

## 📁 Struktura Katalogów

```
/public/assets/images/
├── icons/              # Ikony aplikacji, favicons, PWA manifest icons
│   ├── favicon.ico                ✅ (używany)
│   ├── icon-pwa-master.svg        ✅ (master PWA icon, używany)
│   ├── icon-512x512.png           ⚠️ (opcjonalny PNG, nie wygenerowany)
│   ├── icon-192x192.png           ⚠️ (opcjonalny PNG, nie wygenerowany)
│   ├── icon-144x144.png           ⚠️ (opcjonalny PNG, nie wygenerowany)
│   ├── apple-touch-icon.png       ⚠️ (opcjonalny PNG, nie wygenerowany)
│   ├── maskable-icon-512x512.png  ⚠️ (opcjonalny PNG, nie wygenerowany)
│   ├── play-shortcut-96x96.png    ❌ (brak, opcjonalny)
│   ├── podcast-shortcut-96x96.png ❌ (brak, opcjonalny)
│   └── calendar-shortcut-96x96.png ❌ (brak, opcjonalny)
│
├── covers/             # Okładki albumów, playlisty, muzyka
│   ├── disco-001.jpg
│   ├── hiphop-001.jpg
│   └── kids-001.jpg
│
├── hero/               # Główne obrazy hero sections
│   ├── hero-main.jpg
│   └── hero-secondary.jpg
│
├── ui/                 # Elementy UI (logo, przyciski, tła)
│   ├── logo-radio-main.svg
│   ├── radio-logo-96.png
│   ├── radio-logo-256.png
│   ├── radio-logo-512.png
│   ├── player-background.jpg
│   └── studio-background.jpg
│
├── screenshots/        # Screenshoty PWA (manifest)
│   ├── desktop-home.png
│   ├── mobile-home.png
│   ├── desktop-player.png
│   └── mobile-calendar.png
│
└── placeholders/       # Obrazy fallback
    ├── cover-sunset-waves.svg     ✅ (default cover, używany)
    ├── cover-purple-frequency.svg ✅ (wariant purple)
    ├── cover-golden-hour.svg      ✅ (wariant golden)
    ├── default-avatar.jpg
    └── default-thumbnail.jpg
```

---

## 📝 Konwencja Nazewnictwa

**Format:** `{section}-{purpose}-{variant?}.{ext}`

### Przykłady:
- `hero-main.jpg` - główny obraz hero section
- `icon-app-512.png` - ikona aplikacji 512x512
- `cover-default.jpg` - domyślna okładka muzyczna
- `logo-radio-main.svg` - główne logo radia
- `ui-player-background.jpg` - tło odtwarzacza

### Zasady:
- **lowercase** - zawsze małe litery
- **kebab-case** - słowa rozdzielone myślnikami
- **opisowe** - nazwa odzwierciedla przeznaczenie
- **rozmiar w nazwie** - dla ikon (np. `icon-512x512.png`)

---

## 💻 Jak Używać

### 1. Podstawowe Użycie (Type-Safe Mapping)

```typescript
import IMAGE_PATHS from '@/config/imageMap';

// W komponencie
<img src={IMAGE_PATHS.placeholders.cover} alt="Cover" loading="lazy" />
```

### 2. Z React Hook (Automatyczny Fallback + Walidacja)

```typescript
import { useImage } from '@/hooks/useImage';

function MusicCard() {
  const { src, isLoading, isFallback } = useImage('covers', 'disco001');

  return (
    <img
      src={src}
      alt="Album cover"
      loading="lazy"
      className={isFallback ? 'opacity-50' : ''}
    />
  );
}
```

### 3. Dla Zewnętrznych URL (CDN, Dynamiczne)

```typescript
import { useDirectImage } from '@/hooks/useImage';

function ExternalImage({ url }: { url: string }) {
  const { src, isLoading, error } = useDirectImage(url);

  if (isLoading) return <Skeleton />;
  if (error) return <img src={IMAGE_PATHS.placeholders.cover} />;

  return <img src={src} alt="Content" loading="lazy" />;
}
```

### 4. Bez Walidacji (Dla Pewnych Ścieżek)

```typescript
import { useImagePath } from '@/hooks/useImage';

function Logo() {
  const logoPath = useImagePath('ui', 'logoMain');

  return <img src={logoPath} alt="Logo" />;
}
```

---

## 🗺️ Mapowanie Obrazów na Sekcje Strony

| Sekcja Strony | Plik Obrazu | Klucz w Mapie | Aktualny Status |
|---------------|-------------|---------------|-----------------|
| **Favicon (HTML)** | `/assets/images/icons/favicon.ico` | `icons.favicon` | ✅ Aktywny (228KB) |
| **PWA Ikona Master (SVG)** | `/assets/images/icons/icon-pwa-master.svg` | `icons.master` | ✅ Aktywny (3.2KB) |
| **PWA Ikona SVG** | `/assets/images/icons/icon-pwa-master.svg` | `icons.faviconSvg` | ✅ Aktywny (manifest) |
| **Domyślna okładka (SVG)** | `/assets/images/placeholders/cover-sunset-waves.svg` | `placeholders.cover` | ✅ Aktywny (1.9KB) |
| **Okładka Purple Variant** | `/assets/images/placeholders/cover-purple-frequency.svg` | `placeholders.coverPurple` | ✅ Aktywny (2.8KB) |
| **Okładka Golden Variant** | `/assets/images/placeholders/cover-golden-hour.svg` | `placeholders.coverGolden` | ✅ Aktywny (2.8KB) |
| **PWA Ikona 512 (PNG)** | `/assets/images/icons/icon-512x512.png` | `icons.app512` | ❌ Opcjonalny (nie utworzony) |
| **PWA Ikona 192 (PNG)** | `/assets/images/icons/icon-192x192.png` | `icons.app192` | ❌ Opcjonalny (nie utworzony) |
| **Apple Touch Icon (PNG)** | `/assets/images/icons/apple-touch-icon.png` | `icons.appleTouchIcon` | ❌ Opcjonalny (nie utworzony) |
| **Logo radia (główne)** | `/assets/images/ui/logo-radio-main.svg` | `ui.logoMain` | ❌ Brak (do dodania) |
| **Tło playera** | `/assets/images/ui/player-background.jpg` | `ui.playerBackground` | ❌ Brak (opcjonalne) |
| **Tło studia** | `/assets/images/ui/studio-background.jpg` | `ui.studioBackground` | ❌ Brak (do dodania) |
| **Hero główny** | `/assets/images/hero/hero-main.jpg` | `hero.main` | ❌ Brak (opcjonalne) |
| **Okładka Disco** | `/assets/images/covers/disco-001.jpg` | `covers.disco001` | ❌ Brak |
| **Okładka Hip-Hop** | `/assets/images/covers/hiphop-001.jpg` | `covers.hiphop001` | ❌ Brak |
| **Okładka Kids** | `/assets/images/covers/kids-001.jpg` | `covers.kids001` | ❌ Brak |

### Legenda Statusów:
- ✅ **Aktywny** - prawdziwy obraz, działa poprawnie
- ⚠️ **Placeholder** - plik istnieje, ale jest placeholderem (ASCII text, <500B)
- ❌ **Brak** - plik nie istnieje, używany fallback

---

## 🔄 Jak Zmienić Obraz

### Metoda 1: Podmień Plik (Preferowana)

```bash
# Przykład: Zmiana domyślnej okładki
cp nowa-okladka.jpg public/assets/images/placeholders/default-cover.jpg

# Przykład: Dodanie okładki disco
cp disco-cover.jpg public/assets/images/covers/disco-001.jpg
```

**Korzyści:**
- Nie musisz edytować żadnego kodu
- Zmiana działa natychmiast we wszystkich miejscach
- Zachowana konwencja nazewnictwa

### Metoda 2: Zmień Mapowanie

```typescript
// src/config/imageMap.ts

export const IMAGE_PATHS = {
  covers: {
    default: '/assets/images/new-path/new-cover.jpg', // Zmieniona ścieżka
  }
};
```

**Kiedy używać:**
- Gdy zmieniasz strukturę folderów
- Gdy dodajesz nową kategorię obrazów
- Gdy obrazy są hostowane na CDN

---

## 🛠️ Pliki Konfiguracyjne

### 1. `/src/config/imageMap.ts`
**Rola:** Centralna mapa wszystkich obrazów
**Edytuj gdy:** Dodajesz nowe obrazy, zmieniasz ścieżki
**Type-safe:** ✅ Tak (autocomplete w VS Code)

### 2. `/src/hooks/useImage.ts`
**Rola:** React hook z fallbackiem i lazy loading
**Edytuj gdy:** Zmieniasz logikę ładowania obrazów
**Funkcje:** `useImage()`, `useDirectImage()`, `useImagePath()`

### 3. `/src/utils/imageValidation.ts`
**Rola:** Walidacja obrazów, wykrywanie placeholderów
**Edytuj gdy:** Zmieniasz zasady walidacji
**Funkcje:** `isValidImage()`, `preloadImage()`, `checkImageExists()`

---

## 🚨 Problem Placeholderów

### Co to jest placeholder?

Podczas audytu odkryto, że **24 z 31** plików obrazów to **placeholdery ASCII** (130-132 bajty), nie prawdziwe obrazy.

**Przykład placeholdera:**
```bash
$ file public/images/Icon.jpg
public/images/Icon.jpg: ASCII text

$ ls -lh public/images/Icon.jpg
-rw-r--r-- 1 user user 130 Dec 20 14:00 public/images/Icon.jpg
```

### Jak System Radzi Sobie z Placeholderami?

1. **Walidacja automatyczna** - hook `useImage()` wykrywa pliki <500B
2. **Fallback automatyczny** - używa `placeholders.cover` gdy obraz jest placeholderem
3. **Logi w konsoli** - ostrzeżenia o wykrytych placeholderach
4. **Brak błędów UI** - użytkownik widzi fallback zamiast broken image

### ✅ Rozwiązanie Wdrożone (2025-12-20)

**Problem został rozwiązany** poprzez stworzenie SVG placeholderów:

1. **Master Ikona PWA** - `icon-pwa-master.svg` (3.2KB)
   - Mikrofon w stylu neonu pomarańczowego
   - Skalowalna do dowolnego rozmiaru
   - Używana w manifest.json i jako favicon

2. **3 Warianty Cover Placeholderów** (SVG, 1.9-2.8KB każdy):
   - **Sunset Waves** - diagonalny gradient pomarańczowy (domyślny)
   - **Purple Frequency** - horyzontalne pasma fioletowe
   - **Golden Hour** - ciepły złoty bokeh

**Korzyści SVG:**
- ✅ Małe pliki (1.9-3.2KB vs 130B placeholdery)
- ✅ Prawdziwe grafiki (nie ASCII text)
- ✅ Skalowalne do dowolnego rozmiaru
- ✅ Wspierane przez wszystkie nowoczesne przeglądarki (Chrome 90+, Safari 14.5+, Firefox 88+)
- ✅ Brak błędów 404 w PWA
- ✅ System automatycznie używa fallbacku

**Opcjonalna Konwersja PNG:**
Jeśli potrzebujesz PNG dla starszych urządzeń, zobacz: `docs/SVG_TO_PNG_CONVERSION.md`

---

## 📊 Statystyki Obecnego Stanu

### Obrazy (Stan po SVG Placeholderach - 2025-12-20)
- ✅ **Usunięte:** 15 nieużywanych ASCII placeholderów
- ✅ **Skonsolidowane:** `/images/` → `/assets/images/`
- ✅ **Dodane SVG:** 4 nowe pliki (ikona + 3 cover variants)
- ✅ **Rozmiar SVG:** 10.7KB total (vs 520B ASCII placeholders)
- ✅ **Rozwiązane:** Błędy 404 w PWA manifest
- ⚠️ **Opcjonalnie:** PNG versions dla legacy devices (zobacz `docs/SVG_TO_PNG_CONVERSION.md`)

### Komponenty (Zaktualizowane)
- ✅ `MusicPlayer.tsx` - używa `IMAGE_PATHS.placeholders.cover` (sunset-waves.svg)
- ✅ `nowPlaying.ts` - używa `IMAGE_PATHS.placeholders.cover` (sunset-waves.svg)
- ✅ `index.html` - używa `/assets/images/icons/favicon.ico`
- ✅ `imageMap.ts` - dodano referencje do wszystkich SVG-ów
- ✅ `manifest.json` - zaktualizowano ścieżki do icon-pwa-master.svg
- ✅ `public/sw.js` - cachuje wszystkie SVG (v3-svg-placeholders)

---

## 🔮 Następne Kroki (TODOs)

### ✅ Zakończone (2025-12-20)
1. ~~**Zastąp placeholder default-cover.jpg**~~ - **GOTOWE**: Użyto `cover-sunset-waves.svg`
2. ~~**Wygeneruj ikony PWA**~~ - **GOTOWE**: Utworzono `icon-pwa-master.svg` (SVG działa w PWA)
3. ~~**Napraw błędy 404 w manifest**~~ - **GOTOWE**: Wszystkie ścieżki zaktualizowane

### Priorytet WYSOKI 🟡
1. **Dodaj tło studia** - `styles.css` referencjonuje nieistniejące `studio.png`
2. Dodaj okładki albumów (disco, hiphop, kids) - 3 pliki
3. Stwórz screenshoty PWA (4 pliki) - desktop-home, mobile-home, etc.
4. Dodaj logo radia (SVG + PNG warianty)

### Priorytet ŚREDNI 🟢
5. Dodaj hero images (opcjonalnie)
6. Stwórz avatary placeholders
7. Rozważ WebP dla kompresji

### Opcjonalne (Jeśli potrzebne)
8. Konwertuj SVG → PNG dla legacy devices (zobacz `docs/SVG_TO_PNG_CONVERSION.md`)

---

## 💡 Najlepsze Praktyki

### DO ✅
- Używaj `useImage()` hook dla automatycznego fallbacku
- Dodawaj `loading="lazy"` do wszystkich obrazów (hook robi to automatycznie)
- Nazywaj pliki według konwencji `{section}-{purpose}`
- Trzymaj obrazy w odpowiednich folderach (icons/, covers/, etc.)
- Generuj ikony PWA we wszystkich wymaganych rozmiarach

### NIE ❌
- Nie hardcoduj ścieżek do obrazów w komponentach (użyj `IMAGE_PATHS`)
- Nie dodawaj obrazów poza `/public/assets/images/`
- Nie używaj obrazów <500B (placeholdery)
- Nie commituj Thumbs.db (dodano do .gitignore)
- Nie używaj spacji w nazwach plików

---

## 🐛 Troubleshooting

### Problem: Obraz nie wyświetla się

**Rozwiązanie:**
1. Sprawdź konsolę - hook `useImage()` loguje błędy
2. Sprawdź czy plik istnieje w `/public/assets/images/`
3. Sprawdź rozmiar pliku (`ls -lh`) - czy >500B?
4. Sprawdź typ pliku (`file <path>`) - czy to prawdziwy obraz?

### Problem: PWA nie instaluje się

**Rozwiązanie:**
1. Sprawdź manifest (`/manifest.json`)
2. Wygeneruj wszystkie ikony PWA (9 rozmiarów)
3. Dodaj screenshoty (desktop + mobile)
4. Sprawdź w Chrome DevTools → Application → Manifest

### Problem: Fallback zawsze się pojawia

**Rozwiązanie:**
1. Sprawdź czy obraz nie jest placeholderem (`file <path>`)
2. Sprawdź czy ścieżka w `imageMap.ts` jest poprawna
3. Wyczyść cache walidacji: `clearValidationCache()`
4. Wymuś reload: `checkImageExists(url, false)`

---

## 📚 API Reference

### `useImage(category, key, options?)`

**Parametry:**
- `category` - Kategoria obrazu (`'icons'`, `'covers'`, `'hero'`, etc.)
- `key` - Klucz w kategorii (`'favicon'`, `'default'`, etc.)
- `options` - Opcjonalna konfiguracja

**Zwraca:**
```typescript
{
  src: string,           // Ścieżka obrazu (primary lub fallback)
  isLoading: boolean,    // Czy trwa ładowanie/walidacja
  error: Error | null,   // Błąd jeśli wystąpił
  isFallback: boolean,   // Czy używany fallback
  loading: 'lazy' | 'eager'  // Atrybut loading dla <img>
}
```

**Przykład:**
```typescript
const { src, isLoading, isFallback } = useImage('covers', 'disco001', {
  lazy: true,                           // lazy loading (domyślnie: true)
  fallback: ['placeholders', 'cover'],  // fallback (domyślnie)
  skipValidation: false,                // pomiń walidację (domyślnie: false)
  onLoad: () => console.log('loaded'),
  onError: (err) => console.error(err)
});
```

---

## 📞 Wsparcie

**Problemy?** Otwórz issue na GitHub
**Pytania?** Sprawdź dokumentację w `/docs/`
**Sugestie?** Pull requests welcome!

---

**© 2025 Radio Adamowo | System Zarządzania Obrazami v2.0**
