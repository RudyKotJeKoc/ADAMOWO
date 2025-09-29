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

## Testy
Testy jednostkowe znajdują się w katalogu obok komponentów lub w `src/test`.
