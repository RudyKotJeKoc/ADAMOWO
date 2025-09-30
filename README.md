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

## Testy
Testy jednostkowe znajdują się w katalogu obok komponentów lub w `src/test`.
