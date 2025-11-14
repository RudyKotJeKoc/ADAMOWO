# Przewodnik dla Kontrybutorów – Radio Adamowo

Dziękujemy za zainteresowanie wsparciem projektu Radio Adamowo! Ten dokument zawiera wszystkie informacje potrzebne do rozpoczęcia pracy z kodem projektu i zgłaszania zmian.

## Spis treści

- [Wymagania wstępne](#wymagania-wstępne)
- [Konfiguracja środowiska](#konfiguracja-środowiska)
- [Uruchamianie projektu lokalnie](#uruchamianie-projektu-lokalnie)
- [Struktura projektu](#struktura-projektu)
- [Standardy kodu](#standardy-kodu)
- [Testowanie](#testowanie)
- [Git Workflow](#git-workflow)
- [Proces zgłaszania zmian](#proces-zgłaszania-zmian)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Dodawanie nowych funkcjonalności](#dodawanie-nowych-funkcjonalności)
- [Wsparcie i komunikacja](#wsparcie-i-komunikacja)

---

## Wymagania wstępne

Przed rozpoczęciem pracy upewnij się, że masz zainstalowane:

- **Node.js** 20 lub nowszy ([Pobierz](https://nodejs.org/))
- **pnpm** 9 lub nowszy (instalacja: `npm install -g pnpm@9`)
- **Git** ([Pobierz](https://git-scm.com/))
- Edytor kodu (zalecany: [VS Code](https://code.visualstudio.com/))

### Zalecane rozszerzenia VS Code

- **ESLint** – automatyczne sprawdzanie stylu kodu
- **Prettier** – formatowanie kodu
- **TypeScript and JavaScript Language Features** – wsparcie TypeScript
- **Tailwind CSS IntelliSense** – autouzupełnianie klas Tailwind

---

## Konfiguracja środowiska

### 1. Fork i clone repozytorium

```bash
# Zforkuj repozytorium przez GitHub UI, następnie:
git clone https://github.com/TWOJ_USERNAME/ADAMOWO.git
cd ADAMOWO
```

### 2. Zainstaluj zależności

```bash
pnpm install
```

### 3. Konfiguracja zmiennych środowiskowych (opcjonalnie)

Projekt działa w trybie offline z lokalnymi mockami bez konfiguracji Supabase. Jeśli chcesz pracować z live danymi:

```bash
# Skopiuj przykładowy plik konfiguracji
cp .env.example .env.local

# Edytuj .env.local i uzupełnij wartości:
# VITE_SUPABASE_URL=https://twoj-projekt.supabase.co
# VITE_SUPABASE_ANON=twoj-klucz-anon
```

**Uwaga:** Pliki `.env.local` są ignorowane przez Git i nie powinny być commitowane.

### 4. Sprawdź poprawność instalacji

```bash
# Sprawdź testy
pnpm test

# Sprawdź linting
pnpm lint

# Uruchom dev server
pnpm dev
```

Aplikacja powinna być dostępna pod adresem `http://localhost:5173`.

---

## Uruchamianie projektu lokalnie

### Tryb deweloperski

```bash
pnpm dev
```

- Uruchamia Vite dev server z hot module replacement (HMR)
- Dostępny na `http://localhost:5173`
- Automatyczne odświeżanie przy zmianach w kodzie

### Build produkcyjny

```bash
pnpm build
```

- Kompiluje TypeScript (`tsc -b`)
- Tworzy zoptymalizowany bundle produkcyjny
- Wynik w katalogu `dist/`

### Podgląd buildu produkcyjnego

```bash
pnpm preview
```

- Uruchamia serwer preview dla buildu produkcyjnego
- Dostępny na `http://localhost:4173`
- Użyj tego przed testami Lighthouse i performance

---

## Struktura projektu

```
ADAMOWO/
├── src/
│   ├── components/       # Komponenty współdzielone
│   │   ├── AdamowoHeader.tsx
│   │   ├── AppShell.tsx
│   │   ├── Header.tsx
│   │   └── ...
│   ├── features/         # Moduły funkcjonalne (domain-driven)
│   │   ├── analysis-archive/
│   │   ├── community/
│   │   ├── library/
│   │   ├── media/
│   │   ├── studio/
│   │   └── ...
│   ├── pages/            # Widoki routingowe
│   │   ├── Home.tsx
│   │   ├── Guides.tsx
│   │   └── ...
│   ├── data/             # Serwisy danych (Supabase/local)
│   │   ├── episodes.ts
│   │   ├── playlist.ts
│   │   ├── nowPlaying.ts
│   │   └── types.ts
│   ├── state/            # Zarządzanie stanem (Zustand, Context)
│   │   ├── media.ts
│   │   ├── player.ts
│   │   └── theme.tsx
│   ├── lib/              # Biblioteki i utility
│   │   ├── supabaseClient.ts
│   │   ├── analytics.ts
│   │   └── localAudioClient.ts
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Funkcje pomocnicze
│   ├── i18n/             # Tłumaczenia (pl, nl, en)
│   ├── assets/           # Zasoby statyczne
│   ├── App.tsx           # Komponent główny
│   ├── main.tsx          # Entry point
│   └── router.tsx        # Konfiguracja routingu
├── public/               # Pliki statyczne
│   ├── assets/
│   ├── music/
│   ├── video/
│   └── sw.js             # Service Worker
├── tests/                # Testy
├── .env.example          # Przykładowa konfiguracja
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── eslint.config.js
├── prettier.config.js
└── README.md
```

### Zasady organizacji kodu

- **`/components`** – Komponenty używane w wielu miejscach (shared)
- **`/features`** – Funkcjonalności opakowane w moduły (self-contained)
- **`/pages`** – Komponenty odpowiadające pojedynczym routom
- **`/data`** – Logika pobierania i mapowania danych
- **`/state`** – Globalne store'y i konteksty
- **`/lib`** – Biblioteki niskiego poziomu, klienty API
- **`/hooks`** – Custom hooks wielokrotnego użytku
- **`/utils`** – Funkcje pomocnicze bez side effects

---

## Standardy kodu

### TypeScript

- **Zawsze typuj**: Unikaj `any`, używaj `unknown` lub precyzyjnych typów
- **Strict mode**: Projekt używa `strict: true` w `tsconfig.json`
- **Typy domenowe**: Definiuj w plikach `*.schema.ts` lub `types.ts`
- **JSDoc**: Dodawaj dokumentację dla wszystkich eksportowanych funkcji, klas i interfejsów

**Przykład:**

```typescript
/**
 * Fetches the music playlist from Supabase or falls back to local mock data.
 * Results are sorted by position in ascending order.
 * @returns {Promise<PlaylistItem[]>} Array of playlist items sorted by position
 * @throws {Error} If Supabase query fails (when Supabase is available)
 */
export async function getPlaylist(): Promise<PlaylistItem[]> {
  // Implementation
}
```

### React

- **Functional components**: Używaj function components z hooks
- **Props interfaces**: Definiuj typy props jako interfejsy
- **Destructuring**: Destrukturyzuj props w parametrach funkcji
- **Accessibility**: Zawsze dodawaj odpowiednie atrybuty ARIA
- **Semantic HTML**: Używaj semantycznych tagów HTML5

**Przykład:**

```tsx
interface SearchProps {
  placeholder?: string;
  onResultClick?: (path: string) => void;
}

export function Search({ placeholder, onResultClick }: SearchProps) {
  return (
    <div role="search" aria-label="Global search">
      {/* Implementation */}
    </div>
  );
}
```

### CSS i Tailwind

- **Tailwind first**: Preferuj utility classes Tailwind CSS
- **Custom CSS**: Tylko gdy Tailwind nie wystarcza (animacje, złożone selektory)
- **Responsive design**: Zawsze testuj na różnych rozdzielczościach
- **Dark mode**: Używaj `dark:` prefix dla dark mode variants

### Formatowanie

Projekt używa **Prettier** i **ESLint** z automatycznym formatowaniem:

```bash
# Formatowanie wszystkich plików
pnpm format

# Sprawdzanie błędów ESLint
pnpm lint

# Automatyczna naprawa błędów ESLint
pnpm lint:fix
```

**Pre-commit hooks** (Husky + lint-staged) automatycznie:
- Formatują kod Prettier
- Sprawdzają i naprawiają błędy ESLint
- Uruchamiają testy dla zmienionych plików

---

## Testowanie

### Uruchamianie testów

```bash
# Uruchom wszystkie testy (jednokrotnie)
pnpm test

# Tryb watch (automatyczne ponowne uruchamianie)
pnpm test:watch

# UI dla testów (przeglądarkowo)
pnpm test:ui

# Coverage report
pnpm test:coverage
```

### Pisanie testów

- Testy jednostkowe umieszczaj obok testowanych plików: `ComponentName.test.tsx`
- Używaj **Vitest** i **Testing Library**
- Testuj przypadki brzegowe i error states
- Mock'uj zewnętrzne zależności (Supabase, fetch)

**Przykład:**

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Search } from './Search';

describe('Search', () => {
  it('renders search input', () => {
    render(<Search />);
    expect(screen.getByRole('search')).toBeInTheDocument();
  });

  it('filters results based on query', async () => {
    // Test implementation
  });
});
```

### Quality gates

Przed mergem Pull Request upewnij się, że:
- ✅ Wszystkie testy przechodzą (`pnpm test`)
- ✅ Brak błędów lintingu (`pnpm lint`)
- ✅ Build kończy się sukcesem (`pnpm build`)
- ✅ Coverage nie spadł (jeśli dotyczy)

---

## Git Workflow

### Branch naming

```
feature/nazwa-funkcjonalnosci   # Nowe funkcjonalności
fix/opis-bledu                  # Naprawy błędów
docs/opis-dokumentacji          # Zmiany w dokumentacji
refactor/opis-refaktoryzacji    # Refactoring bez zmian funkcjonalnych
test/opis-testow                # Dodawanie/poprawianie testów
chore/opis-zadania              # Maintenance, dependencies, tooling
```

**Przykłady:**
- `feature/add-search-functionality`
- `fix/header-navigation-mobile`
- `docs/update-contributing-guide`

### Commit messages

Projekt preferuje **konwencjonalne commit messages**:

```
type(scope): krótki opis (max 72 znaki)

Dłuższy opis jeśli potrzebny, wyjaśniający kontekst,
powód zmiany i ewentualnie skutki uboczne.

Refs: #123
```

**Typy commitów:**
- `feat:` – nowa funkcjonalność
- `fix:` – naprawa błędu
- `docs:` – dokumentacja
- `style:` – formatowanie, brak zmian w kodzie
- `refactor:` – refactoring bez zmian funkcjonalnych
- `test:` – dodawanie/poprawianie testów
- `chore:` – maintenance, dependencies, tooling
- `perf:` – optymalizacje wydajności

**Przykłady:**
```
feat(search): add global search with keyboard shortcuts

Implemented fuzzy search across pages, guides, and episodes.
Added Cmd/Ctrl+K shortcut to open search modal.

Refs: #45
```

```
fix(header): correct mobile menu focus trap

Fixed issue where focus would escape mobile menu when
navigating with keyboard.

Fixes: #78
```

---

## Proces zgłaszania zmian

### 1. Stwórz issue (opcjonalnie, ale zalecane)

Przed rozpoczęciem pracy nad większą zmianą, utwórz issue opisujące:
- Co chcesz zmienić/dodać
- Dlaczego ta zmiana jest potrzebna
- Jak planujesz to zaimplementować

### 2. Stwórz branch

```bash
git checkout -b feature/nazwa-funkcjonalnosci
```

### 3. Wprowadź zmiany

- Podziel pracę na małe, logiczne commity
- Testuj lokalnie po każdej zmianie
- Dodaj testy dla nowej funkcjonalności

### 4. Uruchom quality checks

```bash
# Testy
pnpm test

# Linting
pnpm lint

# Build
pnpm build

# Preview produkcyjny (opcjonalnie)
pnpm preview
```

### 5. Push do swojego forka

```bash
git push origin feature/nazwa-funkcjonalnosci
```

### 6. Otwórz Pull Request

- Wypełnij szablon PR (jeśli istnieje)
- Opisz zmiany i ich kontekst
- Dodaj screenshoty dla zmian UI
- Linkuj powiązane issues

---

## Pull Request Guidelines

### Checklist przed otwarciem PR

- [ ] Kod jest czysty i dobrze sformatowany
- [ ] Dodano testy dla nowej funkcjonalności
- [ ] Wszystkie testy przechodzą
- [ ] Brak błędów ESLint
- [ ] Build produkcyjny działa
- [ ] Dodano/zaktualizowano dokumentację (JSDoc, README)
- [ ] Przetestowano na różnych rozdzielczościach (jeśli UI)
- [ ] Sprawdzono dostępność (accessibility)
- [ ] Dodano tłumaczenia dla wszystkich języków (pl, nl, en)

### Opis Pull Request

Powinien zawierać:

1. **Co**: Krótki opis zmian
2. **Dlaczego**: Kontekst i powód wprowadzenia zmian
3. **Jak**: Sposób implementacji (jeśli złożony)
4. **Screenshots**: Dla zmian UI (before/after)
5. **Breaking changes**: Jeśli wprowadzasz backward-incompatible changes
6. **Testing**: Jak przetestować te zmiany

**Przykład:**

```markdown
## Opis
Dodano globalną funkcję wyszukiwania z fuzzy matching i skrótem klawiszowym.

## Motywacja
Użytkownicy potrzebują szybkiego sposobu na nawigację po treściach bez konieczności przeszukiwania menu.

## Zmiany
- Dodano komponent `Search.tsx` z modalem dialogowym
- Zaimplementowano fuzzy search używając algorytmu Levenshtein
- Dodano skrót klawiszowy Cmd/Ctrl+K
- Zaktualizowano tłumaczenia (pl, nl, en)
- Dodano testy jednostkowe i integracyjne

## Screenshots
[Załącz screenshoty]

## Testy
1. Otwórz aplikację
2. Naciśnij Cmd/Ctrl+K
3. Wpisz "przem" – powinien pokazać wyniki dla "przemoc"
4. Kliknij wynik – powinien przekierować do odpowiedniej strony

Refs: #45
```

### Code Review

- Bądź otwarty na feedback
- Odpowiadaj na komentarze
- Wprowadzaj poprawki w ramach tego samego PR (nie twórz nowych)
- Mergowanie następuje po zatwierdzeniu przez maintainers

---

## Dodawanie nowych funkcjonalności

### Biblioteka Przypadków

**Lokalizacja:** `src/features/library/`

1. Dodaj typ w `library.schema.ts`:
```typescript
export type LibraryEntryId = 'existing-case' | 'new-case';
```

2. Dodaj wpis w `library.data.ts`:
```typescript
{
  id: 'new-case',
  titleKey: 'library.entries.newCase.title',
  summaryKey: 'library.entries.newCase.summary',
  tags: ['manipulation', 'gaslighting'],
  // ...
}
```

3. Dodaj tłumaczenia w `src/i18n/pl.json`, `nl.json`, `en.json`:
```json
{
  "library": {
    "entries": {
      "newCase": {
        "title": "Nowy Przypadek",
        "summary": "Krótki opis...",
        // ...
      }
    }
  }
}
```

### Studio Radio (Nowe audycje)

**Lokalizacja:** `src/features/studio/`

1. Rozszerz `ProgramId` w `studio.schema.ts`
2. Dodaj wpis w `studio.data.ts`
3. Dodaj ikonę w `src/features/studio/icons/`
4. Zaktualizuj tłumaczenia w `src/i18n/*.json`

### Nowe strony (Pages)

1. Utwórz komponent w `src/pages/NewPage.tsx`:
```tsx
/**
 * Description of the page.
 * @component
 * @returns {JSX.Element} Page content
 */
export default function NewPage() {
  return <div>Content</div>;
}
```

2. Dodaj route w `src/router.tsx`:
```tsx
{
  path: '/new-page',
  lazy: async () => {
    const { default: NewPage } = await import('./pages/NewPage');
    return { Component: NewPage };
  }
}
```

3. Dodaj link nawigacyjny w `src/components/Header.tsx`
4. Dodaj tłumaczenia

---

## Wsparcie i komunikacja

### Zgłaszanie błędów

Otwórz issue z etykietą `bug` zawierający:
- Opis problemu
- Kroki do reprodukcji
- Oczekiwane zachowanie
- Aktualne zachowanie
- Środowisko (przeglądarka, OS, wersja Node.js)
- Screenshoty/logi (jeśli dotyczy)

### Propozycje funkcjonalności

Otwórz issue z etykietą `enhancement` zawierający:
- Opis funkcjonalności
- Uzasadnienie (dlaczego jest potrzebna)
- Przykłady użycia
- Alternatywne rozwiązania (jeśli rozważałeś inne)

### Pytania

- Sprawdź dokumentację (README.md, CONTRIBUTING.md)
- Przeszukaj istniejące issues
- Jeśli nie znajdziesz odpowiedzi, otwórz issue z etykietą `question`

### Code of Conduct

- Bądź uprzejmy i szanuj innych
- Konstruktywna krytyka, nie osobiste ataki
- Witamy kontrybutorów o każdym poziomie doświadczenia
- Zgłaszaj nieodpowiednie zachowania do maintainers

---

## Dodatkowe zasoby

### Przydatne linki

- [React Dokumentacja](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vitest Docs](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Supabase Docs](https://supabase.com/docs)
- [Zustand Guide](https://zustand-demo.pmnd.rs/)

### Narzędzia deweloperskie

- **React DevTools** – debugowanie React components
- **Redux DevTools** – podgląd Zustand stores
- **Lighthouse** – audyty wydajności i dostępności

### Performance i dostępność

**Lighthouse targets (po `pnpm build && pnpm preview`):**
- Performance ≥ 85
- Accessibility ≥ 90
- Best Practices ≥ 90
- SEO ≥ 90

**Accessibility checklist:**
- ✅ Wszystkie obrazy mają `alt` text
- ✅ Interaktywne elementy dostępne z klawiatury
- ✅ Odpowiednie role ARIA
- ✅ Skip-to-content link
- ✅ Focus indicators widoczne
- ✅ Brak focus traps
- ✅ Respektowanie `prefers-reduced-motion`

---

## Podsumowanie

1. **Fork** repozytorium
2. **Zainstaluj** zależności (`pnpm install`)
3. **Stwórz branch** (`git checkout -b feature/nazwa`)
4. **Wprowadź zmiany** z testami i dokumentacją
5. **Sprawdź jakość** (`pnpm test`, `pnpm lint`, `pnpm build`)
6. **Push** do swojego forka
7. **Otwórz Pull Request** z opisem zmian

Dziękujemy za wsparcie projektu Radio Adamowo! Każdy wkład jest ceniony. 🎉

---

**Masz pytania?** Otwórz issue lub skontaktuj się z maintainers.
