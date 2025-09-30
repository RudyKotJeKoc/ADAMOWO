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
