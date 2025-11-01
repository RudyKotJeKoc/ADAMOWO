# Najlepsze Praktyki do Replikacji - Radio Adamowo

**Data:** 2025-11-01
**Cel:** Ekstrakcja reużywalnych wzorców i praktyk do innych projektów

---

## Spis treści

1. [Code Patterns](#code-patterns)
2. [Architecture Patterns](#architecture-patterns)
3. [TypeScript Patterns](#typescript-patterns)
4. [React Patterns](#react-patterns)
5. [State Management](#state-management)
6. [Data Layer Patterns](#data-layer-patterns)
7. [Accessibility Patterns](#accessibility-patterns)
8. [Testing Patterns](#testing-patterns)
9. [Build & Performance](#build--performance)
10. [Documentation Patterns](#documentation-patterns)

---

## Code Patterns

### Pattern 1: Graceful Degradation Data Layer

**Problem:** App przestaje działać gdy external service (Supabase) jest niedostępny

**Rozwiązanie:** Automatic fallback do local data

```typescript
// ✅ GOOD - Progressive Enhancement Pattern
export async function getData(): Promise<Data> {
  const client = getExternalClient();

  // Fallback jeśli external service niedostępny
  if (!client) {
    return loadLocalData();
  }

  try {
    const { data, error } = await client.from('table').select('*');
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('External service failed, using local data', error);
    return loadLocalData();
  }
}

async function loadLocalData(): Promise<Data> {
  const module = await import('./data.local.json');
  return module.default;
}
```

**Zastosowanie:**
- ✅ Każdy external API call
- ✅ Database queries
- ✅ Third-party services

**Korzyści:**
- 🎯 Zero downtime
- 🎯 Works offline
- 🎯 Better developer experience (no API setup needed)

---

### Pattern 2: Type-Safe Data Mapping

**Problem:** Data z API ma różne naming conventions (snake_case vs camelCase)

**Rozwiązanie:** Centralized mapping funkcja z type safety

```typescript
// ✅ GOOD - Adapter Pattern with Type Safety
type ApiRow = {
  id: string;
  user_name?: string | null;
  created_at?: string | null;
  // ... API format (snake_case)
};

type AppModel = {
  id: string;
  userName: string;
  createdAt: string;
  // ... App format (camelCase)
};

function mapApiRowToModel(row: ApiRow): AppModel {
  return {
    id: row.id,
    userName: row.user_name?.trim() || 'Anonymous',
    createdAt: row.created_at || new Date().toISOString(),
  };
}

// Usage
async function fetchUsers(): Promise<AppModel[]> {
  const response = await api.get<ApiRow[]>('/users');
  return response.data.map(mapApiRowToModel);
}
```

**Zastosowanie:**
- ✅ API response transformations
- ✅ Database row mapping
- ✅ Form data normalization

**Korzyści:**
- 🎯 Consistent data shape w całej aplikacji
- 🎯 Type safety
- 🎯 Łatwe do testowania

---

### Pattern 3: Factory Pattern dla Complex Objects

**Problem:** Złożone obiekty z lifecycle management i cleanup

**Rozwiązanie:** Factory function zwracająca API object

```typescript
// ✅ GOOD - Factory Pattern
interface AudioClient {
  play: () => void;
  pause: () => void;
  destroy: () => void;
  nextTrack: () => void;
  getCurrentTrack: () => Track | null;
}

export function createAudioClient(
  element: HTMLAudioElement,
  options: AudioOptions = {}
): AudioClient {
  // Private state
  let playlist: Track[] = [];
  let currentIndex = 0;
  let destroyed = false;

  // Private methods
  const loadPlaylist = async () => {
    const response = await fetch(options.playlistUrl || '/playlist.json');
    playlist = await response.json();
  };

  const handleEnded = () => {
    if (!destroyed) {
      nextTrack();
    }
  };

  // Event listeners
  element.addEventListener('ended', handleEnded);

  // Initialize
  loadPlaylist();

  // Public API
  return {
    play: () => element.play(),
    pause: () => element.pause(),
    destroy: () => {
      destroyed = true;
      element.removeEventListener('ended', handleEnded);
      element.pause();
      element.src = '';
    },
    nextTrack: () => {
      currentIndex = (currentIndex + 1) % playlist.length;
      element.src = playlist[currentIndex].url;
      element.load();
    },
    getCurrentTrack: () => playlist[currentIndex] || null,
  };
}
```

**Zastosowanie:**
- ✅ Media players
- ✅ WebSocket clients
- ✅ Canvas/WebGL contexts
- ✅ Any object requiring cleanup

**Korzyści:**
- 🎯 Encapsulation
- 🎯 Memory leak prevention
- 🎯 Testable (dependency injection)

---

### Pattern 4: Custom Hook dla Reusable Logic

**Problem:** Logika powtarza się w wielu komponentach

**Rozwiązanie:** Extract do custom hook

```typescript
// ✅ GOOD - Custom Hook Pattern
function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const query = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updatePreference = () => {
      setPrefersReducedMotion(query.matches);
    };

    updatePreference();
    query.addEventListener('change', updatePreference);

    return () => {
      query.removeEventListener('change', updatePreference);
    };
  }, []);

  return prefersReducedMotion;
}

// Usage
function AnimatedComponent() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div>
      {!prefersReducedMotion && <Animation />}
    </div>
  );
}
```

**Inne przykłady:**
```typescript
// Media query hook
function useMediaQuery(query: string): boolean;

// Debounced value hook
function useDebounce<T>(value: T, delay: number): T;

// Local storage hook
function useLocalStorage<T>(key: string, initial: T): [T, (value: T) => void];

// Async data hook
function useAsync<T>(asyncFn: () => Promise<T>): {
  data: T | null;
  loading: boolean;
  error: Error | null;
};
```

**Korzyści:**
- 🎯 DRY principle
- 🎯 Testable w izolacji
- 🎯 Composable

---

## Architecture Patterns

### Pattern 5: Feature-Based Module Structure

**Problem:** Kod zorganizowany po typie pliku (components/, services/, etc.) robi się niezarządzalny

**Rozwiązanie:** Organizacja po feature/domain

```
src/
├── features/
│   ├── violence-loop/           # Feature module
│   │   ├── ViolenceLoopDiagram.tsx
│   │   ├── ViolenceLoopDiagram.test.tsx
│   │   ├── useViolenceLoop.ts
│   │   ├── violenceLoop.types.ts
│   │   ├── violenceLoop.utils.ts
│   │   └── README.md
│   │
│   ├── mythology/                # Feature module
│   │   ├── MythologyGrid.tsx
│   │   ├── MythSymbol.tsx
│   │   ├── mythology.data.ts
│   │   ├── mythology.schema.ts
│   │   ├── icons/
│   │   └── README.md
│   │
│   └── analysis-archive/         # Feature module
│       ├── AnalysisPage.tsx
│       ├── EpisodeList.tsx
│       ├── EpisodeFilters.tsx
│       ├── data.local.json
│       └── README.md
│
├── components/                   # Shared components only
│   ├── HeroPlayer.tsx
│   ├── Header.tsx
│   └── Navigation.tsx
│
├── lib/                         # Shared utilities
│   ├── supabaseClient.ts
│   └── localAudioClient.ts
│
└── state/                       # Global state only
    └── player.ts
```

**Rules:**
1. Feature folder zawiera wszystko związane z tym feature
2. Shared components = używane przez 3+ features
3. Każdy feature ma własny README
4. Cross-feature imports są explicitly allowed/denied

**Korzyści:**
- 🎯 Łatwo znaleźć kod
- 🎯 Łatwo usunąć feature (delete folder)
- 🎯 Team może pracować równolegle
- 🎯 Clear dependencies

---

### Pattern 6: Layered Architecture

**Problem:** Business logic mieszana z UI

**Rozwiązanie:** Clear separation of concerns

```
┌─────────────────────────────────────────┐
│         PRESENTATION LAYER              │
│  Components, Pages, UI Logic            │
│  - HeroPlayer.tsx                       │
│  - EpisodeList.tsx                      │
└─────────────────────────────────────────┘
              ↓ (używa)
┌─────────────────────────────────────────┐
│           STATE LAYER                   │
│  Zustand Stores, Context                │
│  - usePlayerStore()                     │
│  - useTheme()                           │
└─────────────────────────────────────────┘
              ↓ (używa)
┌─────────────────────────────────────────┐
│        BUSINESS LOGIC LAYER             │
│  Custom Hooks, Services                 │
│  - createAudioClient()                  │
│  - generatePlaylist()                   │
└─────────────────────────────────────────┘
              ↓ (używa)
┌─────────────────────────────────────────┐
│           DATA LAYER                    │
│  API Calls, Database Access             │
│  - getEpisodes()                        │
│  - subscribeNowPlaying()                │
└─────────────────────────────────────────┘
```

**Rules:**
- ⬇️ Lower layers nie znają upper layers
- ⬇️ Data flow: top → bottom
- ⬆️ Events/callbacks: bottom → top

---

## TypeScript Patterns

### Pattern 7: Discriminated Unions

**Problem:** Runtime type checking jest error-prone

**Rozwiązanie:** TypeScript discriminated unions

```typescript
// ✅ GOOD - Discriminated Union
type LoadingState = {
  status: 'loading';
};

type SuccessState<T> = {
  status: 'success';
  data: T;
};

type ErrorState = {
  status: 'error';
  error: string;
};

type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState;

// Usage with type narrowing
function renderData<T>(state: AsyncState<T>) {
  switch (state.status) {
    case 'loading':
      return <Spinner />;

    case 'success':
      // TypeScript knows state.data exists here
      return <DataView data={state.data} />;

    case 'error':
      // TypeScript knows state.error exists here
      return <ErrorMessage error={state.error} />;
  }
}
```

**Inne przykłady:**

```typescript
// Form validation result
type ValidationResult =
  | { valid: true; value: string }
  | { valid: false; errors: string[] };

// API response
type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; message: string };

// Player status
type PlayerStatus =
  | { type: 'idle' }
  | { type: 'buffering'; progress: number }
  | { type: 'playing'; currentTime: number }
  | { type: 'error'; message: string };
```

**Korzyści:**
- 🎯 Exhaustive checking
- 🎯 No runtime errors
- 🎯 Self-documenting

---

### Pattern 8: Type Guards

**Problem:** Unknown data shape z API/user input

**Rozwiązanie:** Type guard functions

```typescript
// ✅ GOOD - Type Guards
function isTrack(value: unknown): value is Track {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'title' in value &&
    'url' in value &&
    typeof (value as any).id === 'string' &&
    typeof (value as any).title === 'string' &&
    typeof (value as any).url === 'string'
  );
}

function isTrackArray(value: unknown): value is Track[] {
  return Array.isArray(value) && value.every(isTrack);
}

// Usage
async function loadPlaylist(url: string): Promise<Track[]> {
  const response = await fetch(url);
  const data: unknown = await response.json();

  if (!isTrackArray(data)) {
    throw new Error('Invalid playlist format');
  }

  // TypeScript knows data is Track[] here
  return data;
}
```

**Runtime validation library (Zod):**

```typescript
import { z } from 'zod';

const TrackSchema = z.object({
  id: z.string(),
  title: z.string(),
  artist: z.string(),
  url: z.string().url(),
  duration: z.number().optional(),
});

type Track = z.infer<typeof TrackSchema>;

// Validate & parse
const track = TrackSchema.parse(unknownData);
```

---

## React Patterns

### Pattern 9: Compound Components

**Problem:** Props drilling w nested components

**Rozwiązanie:** Compound component pattern z Context

```typescript
// ✅ GOOD - Compound Component Pattern
interface PlayerContextValue {
  playing: boolean;
  volume: number;
  play: () => void;
  pause: () => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

function Player({ children }: { children: React.ReactNode }) {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);

  const value: PlayerContextValue = {
    playing,
    volume,
    play: () => setPlaying(true),
    pause: () => setPlaying(false),
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}

function usePlayerContext() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayerContext must be used within Player');
  }
  return context;
}

// Sub-components
Player.PlayButton = function PlayButton() {
  const { playing, play, pause } = usePlayerContext();
  return (
    <button onClick={playing ? pause : play}>
      {playing ? 'Pause' : 'Play'}
    </button>
  );
};

Player.VolumeControl = function VolumeControl() {
  const { volume } = usePlayerContext();
  return <div>Volume: {volume * 100}%</div>;
};

// Usage
function App() {
  return (
    <Player>
      <Player.PlayButton />
      <Player.VolumeControl />
    </Player>
  );
}
```

**Korzyści:**
- 🎯 No props drilling
- 🎯 Flexible composition
- 🎯 Self-documenting API

---

### Pattern 10: Render Props for Logic Sharing

**Problem:** HOCs są zbyt magic, hooks nie zawsze wystarczają

**Rozwiązanie:** Render props pattern

```typescript
// ✅ GOOD - Render Props Pattern
interface AsyncRenderProps<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

function AsyncData<T>({
  fetchData,
  children,
}: {
  fetchData: () => Promise<T>;
  children: (props: AsyncRenderProps<T>) => React.ReactNode;
}) {
  const [state, setState] = useState<AsyncRenderProps<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    fetchData()
      .then(data => setState({ data, loading: false, error: null }))
      .catch(error => setState({ data: null, loading: false, error }));
  }, [fetchData]);

  return <>{children(state)}</>;
}

// Usage
function EpisodesList() {
  return (
    <AsyncData fetchData={getEpisodes}>
      {({ data, loading, error }) => {
        if (loading) return <Spinner />;
        if (error) return <Error message={error.message} />;
        if (!data) return <Empty />;
        return <List items={data} />;
      }}
    </AsyncData>
  );
}
```

---

## State Management

### Pattern 11: Zustand Slices

**Problem:** Jeden duży store jest trudny do zarządzania

**Rozwiązanie:** Podziel na slices

```typescript
// ✅ GOOD - Zustand Slices Pattern
// player.slice.ts
interface PlayerSlice {
  playing: boolean;
  volume: number;
  setPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
}

const createPlayerSlice: StateCreator<PlayerSlice> = (set) => ({
  playing: false,
  volume: 1,
  setPlaying: (playing) => set({ playing }),
  setVolume: (volume) => set({ volume }),
});

// theme.slice.ts
interface ThemeSlice {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const createThemeSlice: StateCreator<ThemeSlice> = (set) => ({
  theme: 'dark',
  setTheme: (theme) => set({ theme }),
});

// store.ts - Combine slices
type Store = PlayerSlice & ThemeSlice;

export const useStore = create<Store>()((...args) => ({
  ...createPlayerSlice(...args),
  ...createThemeSlice(...args),
}));

// Usage - selective subscription
function PlayerControls() {
  // Only re-renders when playing changes
  const playing = useStore(state => state.playing);
  const setPlaying = useStore(state => state.setPlaying);

  return <button onClick={() => setPlaying(!playing)}>Toggle</button>;
}
```

**Korzyści:**
- 🎯 Organized code
- 🎯 Selective re-renders
- 🎯 Easy to test slices independently

---

## Data Layer Patterns

### Pattern 12: Repository Pattern

**Problem:** Data access logic rozrzucona po komponentach

**Rozwiązanie:** Centralized repository

```typescript
// ✅ GOOD - Repository Pattern
interface EpisodesRepository {
  getAll(query?: EpisodeQuery): Promise<Episode[]>;
  getById(id: string): Promise<Episode | null>;
  search(term: string): Promise<Episode[]>;
  create(episode: CreateEpisodeDto): Promise<Episode>;
}

// Supabase implementation
class SupabaseEpisodesRepository implements EpisodesRepository {
  constructor(private client: SupabaseClient) {}

  async getAll(query?: EpisodeQuery): Promise<Episode[]> {
    let builder = this.client.from('episodes').select('*');

    if (query?.category) {
      builder = builder.eq('category', query.category);
    }

    const { data, error } = await builder;
    if (error) throw error;
    return data.map(mapEpisodeRow);
  }

  async getById(id: string): Promise<Episode | null> {
    const { data, error } = await this.client
      .from('episodes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return mapEpisodeRow(data);
  }

  // ... other methods
}

// Local implementation (fallback)
class LocalEpisodesRepository implements EpisodesRepository {
  private episodes: Episode[] = [];

  async getAll(query?: EpisodeQuery): Promise<Episode[]> {
    let results = this.episodes;

    if (query?.category) {
      results = results.filter(e => e.category === query.category);
    }

    return results;
  }

  // ... other methods
}

// Factory
export function createEpisodesRepository(): EpisodesRepository {
  const client = getSupabaseClient();

  if (client) {
    return new SupabaseEpisodesRepository(client);
  }

  return new LocalEpisodesRepository();
}
```

**Korzyści:**
- 🎯 Testable (mock repository)
- 🎯 Swappable implementations
- 🎯 Clean architecture

---

## Accessibility Patterns

### Pattern 13: Accessible Keyboard Navigation

**Problem:** Custom controls nie działają z klawiaturą

**Rozwiązanie:** Comprehensive keyboard support

```typescript
// ✅ GOOD - Keyboard Navigation Pattern
function useKeyboardControls(handlers: KeyboardHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent if typing in input
      if (e.target instanceof HTMLInputElement) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          handlers.onSpace?.();
          break;

        case 'ArrowUp':
          e.preventDefault();
          handlers.onArrowUp?.();
          break;

        case 'ArrowDown':
          e.preventDefault();
          handlers.onArrowDown?.();
          break;

        case 'Escape':
          handlers.onEscape?.();
          break;

        case 'm':
        case 'M':
          handlers.onM?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}

// Usage
function Player() {
  const { playing, setPlaying, volume, setVolume } = usePlayerStore();

  useKeyboardControls({
    onSpace: () => setPlaying(!playing),
    onArrowUp: () => setVolume(Math.min(1, volume + 0.1)),
    onArrowDown: () => setVolume(Math.max(0, volume - 0.1)),
    onM: () => setMuted(!muted),
  });

  return <div>...</div>;
}
```

**Best practices:**
- ✅ Space = toggle primary action
- ✅ Escape = close/cancel
- ✅ Arrow keys = navigation/adjustment
- ✅ Enter = confirm/activate
- ✅ Tab = focus management

---

### Pattern 14: ARIA Live Regions

**Problem:** Screen readers nie wiedzą o dynamic content

**Rozwiązanie:** ARIA live regions

```typescript
// ✅ GOOD - ARIA Live Regions
function LiveAnnouncer() {
  return (
    <>
      {/* Polite announcements - non-interrupting */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="polite-announcer"
      />

      {/* Assertive announcements - interrupting */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        id="assertive-announcer"
      />
    </>
  );
}

// Hook to announce
function useAnnounce() {
  return {
    announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      const id = priority === 'polite' ? 'polite-announcer' : 'assertive-announcer';
      const element = document.getElementById(id);
      if (element) {
        element.textContent = message;
        // Clear after announced
        setTimeout(() => {
          element.textContent = '';
        }, 1000);
      }
    },
  };
}

// Usage
function Player() {
  const { announce } = useAnnounce();
  const { playing, currentTrack } = usePlayerStore();

  useEffect(() => {
    if (playing && currentTrack) {
      announce(`Now playing: ${currentTrack.title} by ${currentTrack.artist}`);
    }
  }, [playing, currentTrack]);

  return <div>...</div>;
}
```

**Levels:**
- `aria-live="polite"` - announce when user is idle
- `aria-live="assertive"` - interrupt and announce immediately

---

## Testing Patterns

### Pattern 15: Test Utilities

**Problem:** Powtarzający się setup w testach

**Rozwiązanie:** Custom test utilities

```typescript
// ✅ GOOD - Test Utilities
// test/utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

interface CustomRenderOptions extends RenderOptions {
  initialRoute?: string;
  playerState?: Partial<PlayerState>;
}

export function renderWithProviders(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) {
  const { initialRoute = '/', playerState, ...renderOptions } = options;

  // Setup player store with initial state
  if (playerState) {
    usePlayerStore.setState(playerState);
  }

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <BrowserRouter initialEntries={[initialRoute]}>
        {children}
      </BrowserRouter>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Mock data factories
export const createMockTrack = (overrides?: Partial<Track>): Track => ({
  id: 'track-1',
  title: 'Test Track',
  artist: 'Test Artist',
  url: '/test.mp3',
  ...overrides,
});

export const createMockEpisode = (overrides?: Partial<Episode>): Episode => ({
  id: 'episode-1',
  title: 'Test Episode',
  category: 'test',
  tags: [],
  durationSec: 100,
  ...overrides,
});
```

**Usage:**

```typescript
// episode.test.tsx
import { renderWithProviders, createMockEpisode } from '@/test/utils';

describe('EpisodeCard', () => {
  it('renders episode details', () => {
    const episode = createMockEpisode({
      title: 'My Episode',
      category: 'mythology',
    });

    const { getByText } = renderWithProviders(
      <EpisodeCard episode={episode} />
    );

    expect(getByText('My Episode')).toBeInTheDocument();
  });
});
```

---

### Pattern 16: Integration Tests

**Problem:** Unit tests nie catch integration issues

**Rozwiązanie:** Integration tests dla user flows

```typescript
// ✅ GOOD - Integration Test
import { renderWithProviders, waitFor, userEvent } from '@/test/utils';

describe('Player Integration', () => {
  it('loads playlist and plays first track', async () => {
    // Mock fetch
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: '1', title: 'Track 1', url: '/track1.mp3' },
        { id: '2', title: 'Track 2', url: '/track2.mp3' },
      ],
    });

    const { getByLabelText, getByText } = renderWithProviders(<App />);

    // Wait for playlist to load
    await waitFor(() => {
      expect(getByText('Track 1')).toBeInTheDocument();
    });

    // Click play button
    const playButton = getByLabelText(/play/i);
    await userEvent.click(playButton);

    // Verify player state
    await waitFor(() => {
      expect(getByLabelText(/pause/i)).toBeInTheDocument();
    });
  });

  it('handles network errors gracefully', async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

    const { getByText } = renderWithProviders(<App />);

    await waitFor(() => {
      expect(getByText(/network error/i)).toBeInTheDocument();
    });
  });
});
```

---

## Build & Performance

### Pattern 17: Code Splitting Strategy

**Problem:** Jeden duży bundle spowalnia initial load

**Rozwiązanie:** Strategic code splitting

```typescript
// ✅ GOOD - Code Splitting Strategy
// 1. Route-based splitting
const Home = lazy(() => import('./pages/Home'));
const Studio = lazy(() => import('./pages/Studio'));
const Lab = lazy(() => import('./pages/Lab'));

// 2. Component-based splitting (heavy components)
const AudioViz = lazy(() => import('./components/AudioViz'));

function Player() {
  const [showViz, setShowViz] = useState(false);

  return (
    <div>
      <button onClick={() => setShowViz(!showViz)}>Toggle Viz</button>
      {showViz && (
        <Suspense fallback={<div>Loading...</div>}>
          <AudioViz />
        </Suspense>
      )}
    </div>
  );
}

// 3. Vendor splitting (vite.config.ts)
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core framework
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],

          // Heavy libraries
          'i18n-vendor': ['i18next', 'react-i18next'],

          // UI libraries
          'ui-vendor': ['clsx'],

          // Data layer
          'data-vendor': ['@supabase/supabase-js', 'zustand'],
        },
      },
    },
  },
});
```

**Strategy:**
1. **Routes** - każda strona osobny chunk
2. **Heavy components** - lazy load
3. **Vendors** - stable chunks (better caching)

---

### Pattern 18: Performance Monitoring

**Problem:** Nie wiemy które komponenty są powolne

**Rozwiązanie:** React Profiler API

```typescript
// ✅ GOOD - Performance Monitoring
function onRenderCallback(
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number
) {
  if (import.meta.env.DEV) {
    console.log(`${id} (${phase}):`, {
      actualDuration,
      baseDuration,
    });

    // Warn about slow renders
    if (actualDuration > 16) {
      console.warn(`Slow render detected in ${id}: ${actualDuration}ms`);
    }
  }

  // Send to analytics in production
  if (import.meta.env.PROD) {
    analytics.track('component-render', {
      id,
      phase,
      duration: actualDuration,
    });
  }
}

// Wrap performance-critical components
function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <Router />
    </Profiler>
  );
}

function ExpensiveFeature() {
  return (
    <Profiler id="ExpensiveFeature" onRender={onRenderCallback}>
      {/* ... */}
    </Profiler>
  );
}
```

---

## Documentation Patterns

### Pattern 19: Self-Documenting Code

**Problem:** Dokumentacja się rozjeżdża z kodem

**Rozwiązanie:** Code jest dokumentacją

```typescript
// ✅ GOOD - Self-Documenting Code
// Descriptive names
function calculateMonthlyPaymentWithInterest(
  principal: number,
  annualInterestRate: number,
  loanTermInMonths: number
): number {
  const monthlyRate = annualInterestRate / 12 / 100;
  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, loanTermInMonths)) /
    (Math.pow(1 + monthlyRate, loanTermInMonths) - 1);
  return payment;
}

// Type documentation
/**
 * Represents a track in the playlist
 */
interface Track {
  /** Unique identifier */
  id: string;

  /** Track title (max 200 characters) */
  title: string;

  /** Artist name */
  artist: string;

  /** Absolute or relative URL to audio file */
  url: string;

  /** Optional cover art URL */
  coverUrl?: string;

  /** Duration in seconds (0 = auto-detect) */
  duration?: number;
}

// Function documentation
/**
 * Loads and parses a playlist from a JSON file.
 *
 * @param url - URL to playlist JSON file
 * @returns Promise resolving to array of tracks
 * @throws {Error} If playlist format is invalid
 *
 * @example
 * ```typescript
 * const tracks = await loadPlaylist('/music/playlist.json');
 * console.log(`Loaded ${tracks.length} tracks`);
 * ```
 */
async function loadPlaylist(url: string): Promise<Track[]> {
  // Implementation
}
```

---

### Pattern 20: Feature README Files

**Problem:** Trudno zrozumieć co robi feature module

**Rozwiązanie:** README w każdym feature folder

```markdown
<!-- src/features/violence-loop/README.md -->

# Violence Loop Feature

## Overview
Animated infinity diagram showing the cycle of abuse with 4 phases.

## Components

### ViolenceLoopDiagram
Main component rendering the loop visualization.

**Props:**
- `autoPlay?: boolean` - Auto-start animation (default: true)
- `onPhaseChange?: (phase: Phase) => void` - Callback when phase changes

**Usage:**
```tsx
<ViolenceLoopDiagram
  autoPlay={false}
  onPhaseChange={(phase) => console.log(phase)}
/>
```

## Data Structure

See `violenceLoop.types.ts` for complete types.

## Accessibility

- Respects `prefers-reduced-motion`
- Keyboard controls (Space, Arrow keys)
- ARIA live region for phase announcements
- High contrast mode support

## Testing

```bash
pnpm test violence-loop
```

## Related Features

- [Mythology](/src/features/mythology) - Narcissistic manipulation tactics
- [Guides](/src/features/guide-eight-sins) - Eight sins of narcissism
```

---

## Checklist dla nowych projektów

### Setup Phase

```markdown
- [ ] TypeScript strict mode enabled
- [ ] ESLint + Prettier configured
- [ ] Git hooks (Husky) for pre-commit linting
- [ ] Vitest configured for testing
- [ ] Feature-based folder structure
- [ ] README.md with setup instructions
```

### Development Phase

```markdown
- [ ] Graceful degradation for external services
- [ ] Type-safe data mapping (API → App models)
- [ ] Custom hooks for reusable logic
- [ ] Accessibility: ARIA, keyboard nav, reduced motion
- [ ] Error boundaries for each feature
- [ ] Loading states for async operations
```

### Build Phase

```markdown
- [ ] Code splitting (routes + vendors)
- [ ] Bundle size limits configured
- [ ] Lighthouse CI in pipeline
- [ ] Source maps for debugging
- [ ] Environment variables documented
```

### Testing Phase

```markdown
- [ ] Unit tests for utilities/hooks
- [ ] Integration tests for user flows
- [ ] Accessibility tests (axe-core)
- [ ] Visual regression tests (optional)
- [ ] Performance benchmarks
```

### Documentation Phase

```markdown
- [ ] README in each feature folder
- [ ] API documentation (JSDoc)
- [ ] Architecture diagram
- [ ] Deployment guide
- [ ] Contributing guidelines
```

---

## Podsumowanie

### Top 10 wzorców do zawsze używania

1. **Progressive Enhancement** - Fallback do local data
2. **Type Safety** - TypeScript strict mode + type guards
3. **Feature Modules** - Organizacja po domain
4. **Custom Hooks** - Reusable logic extraction
5. **Factory Pattern** - Complex objects z cleanup
6. **Repository Pattern** - Centralized data access
7. **Code Splitting** - Routes + vendors
8. **Accessibility First** - ARIA + keyboard + reduced motion
9. **Error Boundaries** - Graceful error handling
10. **Self-Documenting Code** - Clear names + types

### Anti-patterns do unikania

1. ❌ Props drilling (use Context/Zustand)
2. ❌ God components (split do smaller)
3. ❌ Any type (use proper types)
4. ❌ Mixing concerns (separate presentation/logic/data)
5. ❌ No error handling (always handle errors)
6. ❌ Hard-coded strings (use i18n)
7. ❌ Missing accessibility (WCAG 2.1 minimum)
8. ❌ No tests (minimum: critical paths)
9. ❌ No documentation (README + comments)
10. ❌ Premature optimization (profile first)

---

**Koniec raportu - Gotowe do replikacji w nowych projektach!**
