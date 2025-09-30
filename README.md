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
- Warstwa danych korzysta z modułu `src/data/episodes.ts`, który obsługuje Supabase oraz lokalny fallback (`data.local.json`).
- Typy domenowe dostępne są w `src/data/types.ts` oraz rozszerzeniach w `data.schema.ts`.
- Zapytania obsługują filtrowanie po tytule/opisie, kategoriach, tagach i sortowaniu oraz paginację na poziomie Supabase.
