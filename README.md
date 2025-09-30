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

## Audycje Analityczne
- Kontener funkcjonalności znajduje się w `src/features/analysis-archive`.
- Dane lokalne i schemat typów są w plikach `data.local.json` oraz `data.schema.ts`.
- Domyślnie aplikacja korzysta z mocka JSON; aby włączyć Supabase ustaw zmienne środowiskowe:

```bash
VITE_SUPABASE_URL="https://<projekt>.supabase.co"
VITE_SUPABASE_ANON="<anon-key>"
```

- API pobiera dane z tabeli `episodes` i wspiera filtrowanie po tytule/opisie, kategoriach, tagach i sortowaniu.
