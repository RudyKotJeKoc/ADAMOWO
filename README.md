# Radio Adamowo

Radio Adamowo to wielojęzyczna aplikacja edukacyjno-medialna zbudowana w React + TypeScript (Vite). Projekt łączy treści analityczne, moduły edukacyjne, archiwum audycji oraz funkcje odtwarzania mediów.

## Stack technologiczny

- **Frontend:** React 18, TypeScript, Vite, React Router
- **Styling:** Tailwind CSS + własne style
- **Stan i dane:** Zustand, Supabase (opcjonalnie) + lokalne fallbacki danych
- **i18n:** i18next (PL / EN / NL)
- **Testy i jakość:** Vitest + Testing Library, ESLint, Prettier, Husky + lint-staged

## Wymagania

- Node.js **20+**
- pnpm **9+**

## Szybki start

```bash
pnpm install
pnpm dev
```

Aplikacja uruchamia się domyślnie pod `http://localhost:5173`.

## Dostępne skrypty

- `pnpm dev` – uruchamia Vite w trybie developerskim (`--host`)
- `pnpm build` – type-check (`tsc -b`) + build produkcyjny
- `pnpm preview` – podgląd buildu produkcyjnego
- `pnpm lint` – lint całego repo (`--max-warnings=0`)
- `pnpm lint:fix` – automatyczne poprawki ESLint
- `pnpm test` – testy jednostkowe (Vitest)
- `pnpm test:coverage` – testy z raportem pokrycia

## Konfiguracja środowiska

1. Skopiuj `.env.example` do `.env.local`.
2. Uzupełnij (opcjonalnie) dane Supabase:

```bash
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON=<anon-key>
```

Jeśli zmienne Supabase nie są ustawione, aplikacja korzysta z lokalnych danych fallback (mock JSON), co umożliwia pracę offline podczas developmentu.

## Architektura projektu

Najważniejsze katalogi:

- `src/pages` – strony routingu aplikacji (Home, Live, Studio, MediaHub, Community, itd.)
- `src/features` – moduły domenowe (np. `analysis-archive`, `studio`, `violence-loop`, `mythology`, `media`, `teatr-absurdu`)
- `src/components` – komponenty współdzielone i layout
- `src/data` – modele i źródła danych frontendowych
- `src/state` – globalny stan aplikacji (Zustand)
- `src/i18n` – tłumaczenia i konfiguracja internacjonalizacji
- `api/v1` – pomocnicze endpointy backendowe (PHP), m.in. `ping`, `comments`, `ratings`, `stream`

## Routing (high-level)

Aplikacja używa `createBrowserRouter` i lazy-loadingu widoków. Główne ścieżki obejmują m.in.:

- `/` (Home)
- `/live`
- `/studio/:program?`
- `/analysis`, `/analizy`
- `/taxonomy`, `/taksonomia`
- `/programy`, `/guides`, `/lab`, `/community`
- `/polana-klamstw/:chapterId?`
- `/media`
- `/teatr-absurdu` (+ podstrony `spektakl`, `analiza`)

## Testy i jakość

Przed commitem uruchamiaj co najmniej:

```bash
pnpm lint
pnpm test
pnpm test:coverage
```

Projekt ma skonfigurowane hooki (`husky`, `lint-staged`) dla zmian w plikach TS/TSX/CSS/MD/JSON.

## Dokumentacja uzupełniająca

- `DEPLOYMENT.md` – wskazówki dot. wdrożenia
- `SECURITY.md` – zasady bezpieczeństwa
- `LIGHTHOUSE.md` – standardy jakości frontendu
- `README_COMPREHENSIVE.md` – rozszerzony opis projektu i modułów
- `api/v1/ratings/README.md` – szczegóły API ocen

## Licencja

Brak dedykowanego pliku licencji w repozytorium – przed użyciem komercyjnym ustal warunki z właścicielem projektu.
