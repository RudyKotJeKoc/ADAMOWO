# Radio Adamowo

Radio Adamowo to progresywna aplikacja webowa prezentująca treści edukacyjne na temat manipulacji i toksycznych relacji poprzez formułę wirtualnej stacji radiowej. Projekt łączy rozbudowany interfejs frontendowy, interaktywne wizualizacje oraz API PHP udostępniające moduł komentarzy.

## Spis treści
- [Wymagania](#wymagania)
- [Instalacja](#instalacja)
- [Uruchomienie](#uruchomienie)
- [Dostępne skrypty](#dostępne-skrypty)
- [Struktura projektu](#struktura-projektu)
- [Najważniejsze funkcje](#najważniejsze-funkcje)

## Wymagania
- Node.js w wersji **18 lub nowszej** (projekt testowany na Node 18 LTS).
- pnpm 8+ lub npm 8+ do zarządzania zależnościami frontendowymi.
- Serwer PHP 8.2+ (opcjonalnie) – tylko jeśli chcesz uruchomić backendowe API znajdujące się w katalogu `api/`.

## Instalacja
```bash
# Instalacja zależności frontendowych
pnpm install
# lub
npm install
```

## Uruchomienie
```bash
# Start środowiska deweloperskiego z Vite
pnpm run dev
# lub
npm run dev

# Budowa produkcyjna
pnpm run build
# lub
npm run build

# Podgląd zbudowanej aplikacji
pnpm run preview
# lub
npm run preview
```

## Dostępne skrypty
| Komenda            | Opis                                                                 |
| ------------------ | -------------------------------------------------------------------- |
| `pnpm run dev`     | Uruchamia serwer deweloperski Vite na porcie 3000.                   |
| `pnpm run build`   | Buduje zminifikowaną wersję produkcyjną aplikacji.                   |
| `pnpm run preview` | Prezentuje lokalnie zbudowany projekt (domyślnie port 4000).         |
| `pnpm run lint`    | Uruchamia ESLint dla katalogu `src/`.                                |
| `pnpm run test`    | Uruchamia testy jednostkowe (Vitest).                                |
| `pnpm run format`  | Formatuje kod w `src/` przy pomocy Prettiera.                        |

## Struktura projektu
```
.
├── api/                     # Publiczne API w PHP (komentarze, powiadomienia, stream)
├── public/
│   ├── data/                # Statyczne zasoby (np. playlista audio)
│   ├── images/              # Ikony oraz grafiki dla PWA i interfejsu
│   ├── video/               # Materiały wideo prezentowane w aplikacji
│   ├── manifest.json        # Manifest PWA
│   └── sw.js                # Prosty Service Worker z cache-first dla zasobów statycznych
├── src/
│   ├── data/                # Dane statyczne używane przez moduły frontendu
│   ├── modules/             # Pogrupowane moduły logiki interfejsu
│   ├── utils/               # Funkcje pomocnicze (formatowanie tekstu, storage)
│   └── main.js              # Główny punkt wejścia aplikacji Vite
├── index.html               # Główny dokument HTML aplikacji
├── style.css                # Warstwa stylów Tailwind + niestandardowe reguły
└── README.md                # Niniejsza dokumentacja
```

## Najważniejsze funkcje
- **Odtwarzacz radia i podcastów** – dynamicznie ładuje playlistę, pozwala na sterowanie kolejką i integruje wizualizacje audio.
- **Interaktywny kalendarz czerwonych flag** – użytkownicy mogą tworzyć notatki, które zapisują się lokalnie w `localStorage`.
- **Sekcja edukacyjna** – moduły poradnikowe z możliwością oznaczania przeczytanych treści oraz krótkimi quizami.
- **Symulowany czat** – umożliwia analizę technik manipulacji wykorzystywanych przez wirtualnego rozmówcę.
- **Tryb PWA** – projekt posiada manifest, ikonografię oraz prosty Service Worker wspierający cache zasobów statycznych.

Aby uruchomić backendowe API, skorzystaj z katalogu `api/v1/` oraz pliku `DEPLOYMENT.md`, który opisuje dodatkowe kroki konfiguracyjne (baza danych, zmienne środowiskowe itp.).
