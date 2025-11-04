# Radio Adamowo – Front-end

Radio Adamowo to wielojęzyczny serwis edukacyjny z transmisją radiową. Repozytorium zawiera front-end budowany w oparciu o Vite, React i TypeScript.

## Wymagania
- Node.js 20+
- pnpm 9+

## Szybki start
```bash
pnpm install
pnpm dev
```

Aplikacja uruchomi się pod adresem `http://localhost:5173`.

## Skrypty
- `pnpm dev` – uruchamia tryb deweloperski z Vite.
- `pnpm build` – buduje aplikację (poprzedzone kontrolą typów).
- `pnpm test` – uruchamia testy jednostkowe Vitest.
- `pnpm lint` – sprawdza projekt ESLint-em.

## Konfiguracja Supabase
Warstwa danych aplikacji korzysta z Supabase. Aby połączyć się z własnym projektem:

1. Skopiuj plik `.env.example` do `.env.local` i uzupełnij wartości zmiennych `VITE_SUPABASE_URL` oraz `VITE_SUPABASE_ANON`.
2. W Supabase utwórz tabele `playlist`, `now_playing` oraz `episodes` zgodnie ze schematem w dokumentacji backendu i włącz polityki odczytu publicznego (RLS `select`).
3. Klucze środowiskowe przechowuj jako sekrety GitHub Actions (`Settings → Secrets and variables → Actions`). Testy jednostkowe korzystają z mocków i nie wymagają tych wartości.

Bez ustawionych zmiennych środowiskowych aplikacja przełącza się na lokalne mocki (`src/assets/data/*`, `src/features/analysis-archive/data.local.json`), dzięki czemu development offline pozostaje możliwy.

## Struktura
- `src/components` – komponenty współdzielone.
- `src/features/*` – moduły funkcjonalne opisane w README danego katalogu.
- `src/pages` – widoki routingowe.
- `src/state` – globalne store'y (Zustand, konteksty).
- `src/i18n` – pliki tłumaczeń.

## Moduły edukacyjne
### Biblioteka Przypadków
- Konfiguracja danych znajduje się w `src/features/library/library.data.ts`, a schemat typów w `src/features/library/library.schema.ts`.
- Każdy wpis (`LibraryEntry`) zawiera klucze tłumaczeń (tytuł, streszczenie, treści, wskazówki) oraz opcjonalne osie czasu i materiały do pobrania.
- Teksty przechowywane są w plikach `src/i18n/*.json` pod przestrzenią `library.entries.<nazwaPrzypadku>`.
- Aby dodać nowy przypadek:
  1. Dodaj identyfikator do typu `LibraryEntry['id']` w `library.schema.ts`.
  2. Wprowadź rekord w `library.data.ts` z odpowiednimi kluczami tłumaczeń i tagami.
  3. Uzupełnij treści we wszystkich plikach tłumaczeń (`pl.json`, `nl.json`, `en.json`).

### Mitologia Narcyza
- Dane symboli znajdują się w `src/features/mythology/mythology.data.ts`, a typy w `src/features/mythology/mythology.schema.ts`.
- Każdy symbol (`MythSymbol`) przechowuje identyfikator, klucze do nagłówków, opis znaczenia, momenty występowania oraz działania profilaktyczne.
- Ikony SVG zlokalizowane są w `src/features/mythology/icons` i mapowane przez pole `icon`.
- Aby dodać nowy symbol:
  1. Rozszerz typ `SymbolId` i pole `icon` (dodaj nową ikonę lub wskaż istniejącą).
  2. Dodaj wpis do `mythology.data.ts` wraz z kluczami tłumaczeń.
  3. Uzupełnij treści w `pl.json`, `nl.json` oraz `en.json` w przestrzeni `mythology.symbol.<id>`.

## Dostępność i i18n
- Dostępne przełączniki motywu i języka.
- Translacje dla PL/NL/EN z autodetekcją języka przeglądarki.


### Kocioł Wiedźmy: Pętla Przemocy
- Animowany diagram nieskończoności wykorzystuje pętlę o długości ~14 s z możliwością pauzy, resetu oraz ręcznego wyboru fazy.
- Przy włączonym systemowym `prefers-reduced-motion` animacja startuje w stanie pauzy, a w UI dostępny jest przełącznik "Ogranicz animacje".
- Wskaźnik faz przekazuje krótkie komunikaty w regionie `aria-live` oraz obsługuje nawigację Tab/Enter/strzałki.

## Testy
Testy jednostkowe znajdują się w katalogu obok komponentów lub w `src/test`.

## Utrzymanie jakości Lighthouse
- Uruchamiaj `pnpm build && pnpm preview` przed pomiarem, aby testować zoptymalizowany bundle.
- Sprawdzaj `pnpm lint`, `pnpm test` oraz podstawowe scenariusze e2e po każdej zmianie nawigacji, dostępności lub layoutu.
- Na stronach startowych i kluczowych podstronach utrzymuj wyniki Lighthouse: Performance ≥ 85, Accessibility ≥ 90, Best Practices ≥ 90, SEO ≥ 90.
- Upewnij się, że wszystkie obrazy i multimedia mają atrybuty `loading="lazy"`, zdefiniowane wymiary oraz alternatywne teksty.
- Weryfikuj dostępność klawiaturą: skip link, fokusy i brak pułapek w menu mobilnym, modalach i zakładkach.
- Respektuj `prefers-reduced-motion`, ograniczając animacje i opóźnioną inicjalizację ciężkich efektów do interakcji użytkownika.

## Audycje Analityczne
- Kontener funkcjonalności znajduje się w `src/features/analysis-archive`.

- Dane lokalne i schemat typów są w plikach `data.local.json` oraz `data.schema.ts`.
- Domyślnie aplikacja korzysta z mocka JSON; aby włączyć Supabase ustaw zmienne środowiskowe:

```bash
VITE_SUPABASE_URL="https://<projekt>.supabase.co"
VITE_SUPABASE_ANON="<anon-key>"
```

- API pobiera dane z tabeli `episodes` i wspiera filtrowanie po tytule/opisie, kategoriach, tagach i sortowaniu.

## Studio Radia Adamowo
- Metadane czterech głównych audycji znajdują się w `src/features/studio/studio.data.ts`, a typy w `src/features/studio/studio.schema.ts`.
- Ikony SVG zapisane są w `src/features/studio/icons` i mapowane przez pole `icon`.
- Mini-ramówka korzysta ze struktury `ScheduleEntry` i komponentu `ScheduleMini` (tabela z nagłówkami `<th scope>` oraz skrótami dni tygodnia).
- Ostatnie odcinki ładowane są przez hook `useRecentEpisodes`, który deleguje do `getEpisodes` (Supabase → fallback JSON). W mocku `data.local.json` każde nagranie musi mieć `programId`.
- Aby dodać nowy program:
  1. Rozszerz typ `ProgramId` i dodaj wpis w `studio.data.ts` (tytuł, opis, prowadzący, harmonogram, ikona).
  2. Uzupełnij tłumaczenia w `pl.json`, `nl.json` i `en.json` (przestrzeń `studio.*`).
  3. Jeżeli potrzebna jest nowa ikona, utwórz komponent w `src/features/studio/icons` i zarejestruj go w mapie `PROGRAM_ICON_MAP`.
  4. Dodaj `programId` do powiązanych odcinków w Supabase oraz w `data.local.json`.
=======
- Warstwa danych korzysta z modułu `src/data/episodes.ts`, który obsługuje Supabase oraz lokalny fallback (`data.local.json`).
- Typy domenowe dostępne są w `src/data/types.ts` oraz rozszerzeniach w `data.schema.ts`.
- Zapytania obsługują filtrowanie po tytule/opisie, kategoriach, tagach i sortowaniu oraz paginację na poziomie Supabase.

---

## System Multimedialny (Audio, Wideo, Wizualizacje)

Radio Adamowo posiada zaawansowany system multimedialny zbudowany w oparciu o Web Audio API, Canvas 2D/3D, oraz PWA. Komponenty znajdują się w `src/features/media/`.

### Architektura

```
src/features/media/
├── AudioEngine.tsx           # Silnik audio z Web Audio API
├── AudioVisualizer.tsx       # Wizualizator 2D/3D
├── Slideshow.tsx             # Pokaz slajdów dla obrazów i wideo
├── Rating.tsx                # System ocen utworów
├── PlaylistService.ts        # Zarządzanie playlistami
├── ThemeEngine.ts            # Dynamiczne motywy reagujące na audio
├── media.schema.ts           # Typy TypeScript
└── index.ts                  # Eksporty modułu

src/state/media.ts            # Zustand store dla multimediów
public/sw-comprehensive.js    # Zaawansowany Service Worker
public/data/media-manifest.json # Manifest multimediów
node/scripts/generateMediaManifest.ts # Generator manifestu
```

### 1. AudioEngine – Silnik odtwarzania audio

**Funkcje:**
- Web Audio API z crossfade między utworami (konfigurowalne 1-10s)
- Inteligentne cachowanie AudioBuffer (LRU, limit rozmiaru)
- Preładowanie następnego utworu w tle
- Analiza FFT w czasie rzeczywistym dla wizualizacji
- Obsługa błędów z automatycznym retry
- Pełna integracja z playlistami i kolejkami

**Użycie:**
```tsx
import { AudioEngine } from '@/features/media';
import { useAudioEngineStore } from '@/state/media';

function MyPlayer() {
  const { status, currentTrack, volume } = useAudioEngineStore();

  return (
    <>
      <AudioEngine
        onEvent={(e) => console.log('Audio event:', e)}
        onAnalysisUpdate={(data) => console.log('FFT data:', data)}
      />
      <p>Status: {status}</p>
      <p>Playing: {currentTrack?.title}</p>
    </>
  );
}
```

**Konfiguracja:**
```ts
const config = {
  crossfadeDuration: 3000,      // ms
  preloadNextTrack: true,
  enableCaching: true,
  cacheSize: 10,                // max liczba utworów
  volume: 0.8,
  enableVisualization: true
};
```

### 2. AudioVisualizer – Wizualizacje audio

**Tryby 2D (Canvas):**
- `2d-bars` – klasyczne słupki częstotliwości
- `2d-wave` – fala czasu rzeczywistego
- `2d-circular` – wizualizacja okrągła

**Tryby 3D (Three.js - opcjonalnie):**
- `3d-bars`, `3d-wave`, `3d-particles` – wymaga instalacji `three`

**Użycie:**
```tsx
import { AudioVisualizer, VisualizerModeSwitcher } from '@/features/media';
import { useVisualizerStore } from '@/state/media';

function Visualizer() {
  const { config, isActive } = useVisualizerStore();

  return (
    <div>
      <VisualizerModeSwitcher />
      <AudioVisualizer
        analysisData={audioAnalysisData}
        className="w-full h-64"
      />
    </div>
  );
}
```

**Konfiguracja kolorów:**
```ts
const colorScheme = {
  primary: '#f59e0b',
  secondary: '#d97706',
  accent: '#fbbf24',
  background: '#0a0e27',
  gradient: ['#f59e0b', '#d97706', '#b45309']
};
```

### 3. Slideshow – Pokaz slajdów

**Funkcje:**
- Automatyczne odtwarzanie z konfigurowalnym interwałem
- Przejścia: fade, slide, zoom
- Obsługa wideo (MP4, WebM)
- Miniaturki z nawigacją
- Tryb pełnoekranowy
- Obsługa gestów (swipe) i klawiatury

**Użycie:**
```tsx
import { Slideshow } from '@/features/media';
import { useSlideshowStore } from '@/state/media';

function MediaSlideshow() {
  const { setItems } = useSlideshowStore();

  useEffect(() => {
    // Załaduj media z manifestu
    fetch('/data/media-manifest.json')
      .then(res => res.json())
      .then(manifest => {
        setItems([...manifest.images, ...manifest.videos]);
      });
  }, []);

  return <Slideshow showThumbnails enableKeyboard />;
}
```

**Struktura MediaItem:**
```ts
interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  duration?: number;  // dla wideo lub czasu wyświetlania
  tags?: string[];
}
```

### 4. Rating – System ocen

**Komponenty:**
- `StarRatingInput` – interaktywny widget gwiazdek (1-5)
- `TrackRatingCard` – pełna karta oceny z komentarzem
- `RatingStatistics` – statystyki i dystrybucja ocen
- `RatingsList` – lista ocenionych utworów

**Użycie:**
```tsx
import { TrackRatingCard, RatingStatistics } from '@/features/media';
import { useRatingStore } from '@/state/media';

function TrackRating({ track }) {
  const { getAllRatings } = useRatingStore();

  return (
    <div>
      <TrackRatingCard
        track={track}
        showComment
        onRatingChange={(rating) => console.log('Rated:', rating)}
      />
      <RatingStatistics ratings={getAllRatings()} />
    </div>
  );
}
```

**Persistence:**
- Oceny zapisywane do `localStorage` jako `adamowo-ratings`
- Struktura wspiera synchronizację z backendem (pole `syncStatus`)
- Maksymalnie 500 znaków komentarza

### 5. PlaylistService – Zarządzanie playlistami

**API:**
```ts
import {
  loadPlaylistFromUrl,
  createQueue,
  addToQueue,
  removeFromQueue,
  getNextTrack,
  getPreviousTrack,
  searchTracks,
  filterTracks,
  sortTracks,
  checkTrackAvailability
} from '@/features/media/PlaylistService';

// Ładowanie playlisty
const tracks = await loadPlaylistFromUrl('/music/playlist.json');

// Tworzenie kolejki z shufflem
const queue = createQueue(tracks, { shuffle: true, startIndex: 0 });

// Wyszukiwanie
const results = searchTracks(tracks, 'meditation');

// Filtrowanie
const ambient = filterTracks(tracks, { genre: 'Ambient' });

// Sprawdzanie dostępności offline
const availability = await checkTrackAvailability(track);
```

**Historia odtwarzania:**
- Automatyczne zapisywanie do `localStorage`
- Limit 100 ostatnich wpisów
- API: `getRecentlyPlayed()`, `getMostPlayed()`

### 6. ThemeEngine – Motywy reagujące na audio

**Funkcje:**
- Dynamiczne zmiany kolorów w reakcji na poziomy bas/mid/treble
- 5 predefiniowanych motywów (dark, light, sunset, ocean, forest)
- Automatyczne przełączanie dzień/noc
- Respektowanie `prefers-reduced-motion`
- Generator palet kolorów

**Użycie:**
```ts
import { getThemeEngine, THEMES } from '@/features/media/ThemeEngine';

const themeEngine = getThemeEngine({
  mode: 'dark',
  animations: {
    enabled: true,
    audioReactive: true,
    intensity: 'medium',
    respectsMotionPreference: true
  }
});

// Zmiana motywu
themeEngine.setTheme('ocean');

// Audio-reactive (wywołaj w pętli animacji)
themeEngine.updateFromAudio(audioAnalysisData);

// Auto day/night
themeEngine.enableAutoTheme('light', 'dark');

// Śledź system
themeEngine.followSystemTheme();
```

**CSS Custom Properties:**
```css
:root {
  --theme-primary: #f59e0b;
  --theme-secondary: #d97706;
  --theme-accent: #fbbf24;
  --theme-background: #0a0e27;
  --theme-text: #f3f5ff;
  --theme-border: #1e2854;

  /* Audio-reactive (tylko gdy włączone) */
  --theme-audio-bass: #...;
  --theme-audio-mid: #...;
  --theme-audio-treble: #...;
  --theme-audio-intensity: 0.0-1.0;
}
```

### 7. PWA & Service Worker

**sw-comprehensive.js – Zaawansowany Service Worker:**

**Strategie cachowania:**
- **App Shell**: Cache-first z aktualizacją w tle
- **Media (audio/video)**: Cache-first, preload następnego
- **Obrazy**: Cache-first z expiracją (30 dni)
- **API**: Network-first z cache fallback (5 min)
- **Statyczne (JS/CSS)**: Cache-first, aktualizacja w tle

**Limity cache:**
- Media: 100 MB
- Obrazy: 50 MB
- API: 5 MB
- Automatyczne czyszczenie najstarszych wpisów

**Użycie z aplikacji:**
```ts
// Wyczyść cache
if ('serviceWorker' in navigator) {
  const registration = await navigator.serviceWorker.ready;
  const sw = registration.active;

  const messageChannel = new MessageChannel();
  sw?.postMessage({ type: 'CLEAR_CACHE' }, [messageChannel.port2]);

  messageChannel.port1.onmessage = (event) => {
    if (event.data.success) console.log('Cache cleared');
  };
}

// Prekachuj utwory do offline
sw?.postMessage({
  type: 'PRECACHE_TRACKS',
  data: { tracks: [...] }
});
```

**Background Sync (jeśli obsługiwane):**
- `sync-ratings` – synchronizacja ocen
- `update-playlist` – okresowa aktualizacja playlisty

### 8. Generator manifestu multimediów

**Skrypt:** `node/scripts/generateMediaManifest.ts`

**Uruchomienie:**
```bash
pnpm tsx node/scripts/generateMediaManifest.ts
```

**Działanie:**
1. Skanuje `public/media/images/` dla obrazów (jpg, png, webp, svg)
2. Skanuje `public/media/video/` dla wideo (mp4, webm, ogg)
3. Ładuje `public/music/playlist.json` dla audio
4. Oblicza checksums SHA-256 dla każdego pliku
5. Generuje `public/data/media-manifest.json`

**Manifest JSON:**
```json
{
  "version": "1.0.0",
  "generatedAt": "2025-01-01T00:00:00.000Z",
  "images": [
    {
      "id": "image-sunset-xyz",
      "type": "image",
      "url": "/media/images/sunset.jpg",
      "title": "Sunset",
      "fileSize": 245678,
      "checksum": "abc123...",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "videos": [...],
  "audio": [...],
  "totalSize": 12345678,
  "checksums": {
    "/media/images/sunset.jpg": "abc123..."
  }
}
```

**Integracja z CI/CD:**
Dodaj do workflow przed buildem:
```yaml
- name: Generate media manifest
  run: pnpm tsx node/scripts/generateMediaManifest.ts
```

### 9. Zustand Stores

**src/state/media.ts** – Centralne zarządzanie stanem:

**Store'y:**
- `useAudioEngineStore` – stan odtwarzacza
- `useVisualizerStore` – konfiguracja wizualizatora
- `usePlaylistQueueStore` – kolejka i historia
- `useSlideshowStore` – stan pokazu slajdów
- `useRatingStore` – oceny utworów

**Persistencja:**
- Automatyczny zapis do `localStorage`
- Klucze: `adamowo-audio-engine`, `adamowo-visualizer`, etc.
- Wybiórcze zapisywanie (partialize) – np. tylko volume i config

**Przykład:**
```ts
import { useAudioEngineStore } from '@/state/media';

function VolumeControl() {
  const { volume, setVolume, muted, setMuted } = useAudioEngineStore();

  return (
    <div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        disabled={muted}
      />
      <button onClick={() => setMuted(!muted)}>
        {muted ? 'Unmute' : 'Mute'}
      </button>
    </div>
  );
}
```

### 10. Internacjonalizacja

Wszystkie komponenty multimedialne w pełni przetłumaczone na 3 języki:
- Polski (`pl.json`)
- Holenderski (`nl.json`)
- Angielski (`en.json`)

**Namespace:** `multimedia.*`

**Sekcje:**
- `multimedia.audioEngine` – komunikaty odtwarzacza
- `multimedia.visualizer` – tryby wizualizatora
- `multimedia.playlist` – zarządzanie playlistą
- `multimedia.slideshow` – pokaz slajdów
- `multimedia.rating` – system ocen
- `multimedia.player` – kontrolki
- `multimedia.theme` – motywy
- `multimedia.offline` – tryb offline
- `multimedia.errors` – komunikaty błędów

**Użycie:**
```tsx
import { useTranslation } from 'react-i18next';

function Component() {
  const { t } = useTranslation();

  return (
    <button>{t('multimedia.player.play')}</button>
  );
}
```

### 11. Testowanie

**Testy jednostkowe:**
```bash
pnpm test src/features/media/
```

**Testowanie offline:**
1. Uruchom aplikację: `pnpm build && pnpm preview`
2. W DevTools: Application → Service Workers → Offline
3. Sprawdź dostępność utworów w cache
4. Przetestuj przełączanie między utworami

**Testowanie wizualizatora:**
- Użyj przykładowego audio lub `OscillatorNode`
- Sprawdź wszystkie tryby 2D
- Zweryfikuj `prefers-reduced-motion`

**Testowanie tłumaczeń:**
Przełącz język i sprawdź każdą sekcję UI dla multimedia.

### 12. Wydajność i Optymalizacja

**Zalecenia:**
- Używaj `loading="lazy"` dla obrazów w slideshow
- Ogranicz rozmiar cache w Service Worker według potrzeb
- Dla długich playlist (>100 utworów) stosuj wirtualizację
- Opcjonalnie: Web Workers dla ciężkich obliczeń FFT
- Preload tylko następnego utworu, nie całej kolejki
- Używaj `requestAnimationFrame` dla wizualizacji

**Monitoring:**
```ts
// AudioEngine events
onEvent={(event) => {
  if (event.type === 'error') {
    console.error('Playback error:', event.error);
    // Zgłoś do analytics/Sentry
  }
}}
```

### 13. Roadmap

**Planowane funkcje:**
- [ ] Three.js 3D visualizer (wymaga dodania three do dependencies)
- [ ] Lyrics display with synchronization
- [ ] Equalizer z presetami
- [ ] Eksport playlist do M3U/PLS
- [ ] Integracja z Supabase dla synchronizacji ocen
- [ ] Background audio (Media Session API)
- [ ] Bluetooth/car controls (Media Session API)
- [ ] Shareable timestamps dla utworów
- [ ] Picture-in-Picture dla wideo

**Dodanie Three.js (opcjonalne):**
```bash
pnpm add three @types/three
```

Następnie 3D tryby wizualizatora będą automatycznie dostępne.

---

