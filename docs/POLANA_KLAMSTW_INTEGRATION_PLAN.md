# Plan Integracji: "Polana Kłamstw"

## Data: 2025-11-15
## Wersja: 1.0

---

## 1. PODSUMOWANIE WYKONAWCZE

**Cel:** Integracja nowej sekcji literackiej "Polana Kłamstw" - baśni podzielonej na prolog, 13 rozdziałów i epilog.

**Architektura:** Zgodna z obecną modułową strukturą projektu (React + TypeScript + feature-based architecture).

**Szacowany czas implementacji:** 4-6 godzin

**Poziom złożoności:** Średni

---

## 2. ANALIZA OBECNEJ STRUKTURY

### 2.1 Architektura Projektu

Projekt ADAMOWO używa modułowej architektury opartej na "features":

```
src/
├── features/              # Moduły funkcjonalne (23 aktywne)
│   ├── anatomy/          # Anatomia manipulacji
│   ├── guide-eight-sins/ # Przewodnik 8 grzechów
│   ├── mythology/        # Mitologia manipulacji
│   └── ...
├── pages/                # Strony routingu (13 aktywnych)
│   ├── Home.tsx
│   ├── Guides.tsx
│   └── ...
├── components/           # Współdzielone komponenty UI
└── router.tsx           # Konfiguracja React Router
```

### 2.2 Wzorce Podobnych Sekcji

Najlepsze przykłady do naśladowania:

1. **`/src/features/guide-eight-sins/`** (11 plików)
   - Struktura rozdziałowa
   - Nawigacja między rozdziałami
   - Stylowanie CSS

2. **`/src/features/mythology/`** (10 plików)
   - Treści narracyjne
   - Komponenty tekstowe
   - Responsive design

---

## 3. PROPONOWANA STRUKTURA

### 3.1 Lokalizacja Plików

```
src/
├── features/
│   └── polana-klamstw/                    # NOWY KATALOG
│       ├── PolanaKlamstwReader.tsx        # Główny komponent czytnika
│       ├── ChapterNavigation.tsx          # Nawigacja między rozdziałami
│       ├── ChapterContent.tsx             # Komponent pojedynczego rozdziału
│       ├── TableOfContents.tsx            # Spis treści
│       ├── BookmarkProgress.tsx           # Zapamiętywanie postępu czytania
│       ├── polana.data.ts                 # Dane rozdziałów (tytuły, treści)
│       ├── polana.types.ts                # Typy TypeScript
│       ├── polana.css                     # Style dedykowane
│       └── __tests__/                     # Testy jednostkowe
│           └── PolanaKlamstwReader.test.tsx
│
├── pages/
│   └── PolanaKlamstw.tsx                  # NOWA STRONA
│
└── router.tsx                             # MODYFIKACJA: dodanie trasy
```

### 3.2 Routing

**Nowa trasa:** `/polana-klamstw/:chapter?`

Parametr `chapter` opcjonalny:
- `/polana-klamstw` → Spis treści
- `/polana-klamstw/prolog` → Prolog
- `/polana-klamstw/1` → Rozdział 1
- `/polana-klamstw/13` → Rozdział 13
- `/polana-klamstw/epilog` → Epilog

---

## 4. INTEGRACJA Z NAWIGACJĄ

### 4.1 Modyfikacja Header.tsx

Dodanie nowego linku do nawigacji głównej:

```typescript
// src/components/Header.tsx (linia 20-30)

const NAV_ITEMS: Array<{ to: string; labelKey: string }> = [
  { to: '/live', labelKey: 'navigation.live' },
  { to: '/violence-loop', labelKey: 'navigation.violenceLoop' },
  { to: '/studio', labelKey: 'navigation.studio' },
  { to: '/shows', labelKey: 'navigation.shows' },
  { to: '/polana-klamstw', labelKey: 'navigation.polanaKlamstw' }, // ← NOWY
  { to: '/guides', labelKey: 'navigation.guide' },
  { to: '/anatomy', labelKey: 'navigation.anatomy' },
  { to: '/lab', labelKey: 'navigation.lab' },
  { to: '/community', labelKey: 'navigation.community' },
  { to: '/help', labelKey: 'navigation.help' },
];
```

### 4.2 Modyfikacja Tłumaczeń (i18n)

**src/i18n/pl.json:**
```json
{
  "navigation": {
    "polanaKlamstw": "Polana Kłamstw"
  },
  "polanaKlamstw": {
    "title": "Polana Kłamstw",
    "subtitle": "Baśń o prawdzie, kłamstwie i konsekwencjach",
    "tableOfContents": "Spis Treści",
    "prolog": "Prolog",
    "chapter": "Rozdział",
    "epilog": "Epilog",
    "previousChapter": "Poprzedni rozdział",
    "nextChapter": "Następny rozdział",
    "backToContents": "Powrót do spisu treści",
    "readingProgress": "Postęp czytania",
    "bookmarkSaved": "Zakładka zapisana",
    "estimatedTime": "Szacowany czas czytania"
  }
}
```

**src/i18n/en.json:**
```json
{
  "navigation": {
    "polanaKlamstw": "Glade of Lies"
  },
  "polanaKlamstw": {
    "title": "Glade of Lies",
    "subtitle": "A Tale of Truth, Lies and Consequences",
    // ... tłumaczenia
  }
}
```

---

## 5. STRUKTURA DANYCH

### 5.1 Format Danych Rozdziałów

**src/features/polana-klamstw/polana.types.ts:**
```typescript
export interface Chapter {
  id: string;                    // 'prolog' | '1' | '2' | ... | '13' | 'epilog'
  title: string;                 // Tytuł rozdziału
  content: string;               // Treść (markdown lub HTML)
  estimatedReadingTime: number;  // Szacowany czas w minutach
  publishDate?: string;          // Data publikacji (ISO 8601)
}

export interface PolanaData {
  metadata: {
    title: string;
    author: string;
    description: string;
    coverImage?: string;
  };
  chapters: Chapter[];
}
```

**src/features/polana-klamstw/polana.data.ts:**
```typescript
import type { PolanaData } from './polana.types';

export const polanaData: PolanaData = {
  metadata: {
    title: 'Polana Kłamstw',
    author: 'Adamowo',
    description: 'Baśń o prawdzie, kłamstwie i konsekwencjach manipulacji',
  },
  chapters: [
    {
      id: 'prolog',
      title: 'Prolog: Echem w Lesie',
      content: `
# Prolog: Echem w Lesie

Dawno, dawno temu, w sercu gęstego lasu, istniała polana znana jako
Polana Kłamstw. Nie było to miejsce zwyczajne – każde słowo wypowiedziane
na tej polanie miało moc zmieniania rzeczywistości...

[PEŁNA TREŚĆ PROLOGU]
      `,
      estimatedReadingTime: 5,
    },
    {
      id: '1',
      title: 'Rozdział 1: Pierwsze Kłamstwo',
      content: `
# Rozdział 1: Pierwsze Kłamstwo

[TREŚĆ ROZDZIAŁU 1]
      `,
      estimatedReadingTime: 8,
    },
    // ... rozdziały 2-13
    {
      id: 'epilog',
      title: 'Epilog: Powrót do Prawdy',
      content: `
# Epilog: Powrót do Prawdy

[TREŚĆ EPILOGU]
      `,
      estimatedReadingTime: 6,
    },
  ],
};
```

---

## 6. KOMPONENTY REACT

### 6.1 Strona Główna

**src/pages/PolanaKlamstw.tsx:**
```typescript
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { PolanaKlamstwReader } from '../features/polana-klamstw/PolanaKlamstwReader';
import { ContentWarning } from '../components/ContentWarning';

export default function PolanaKlamstw() {
  const { t } = useTranslation();

  return (
    <div className="polana-klamstw-page">
      {/* Opcjonalne ostrzeżenie o treści */}
      <ContentWarning
        topics={['Trudne tematy rodzinne', 'Manipulacja psychologiczna']}
        severity="moderate"
        storageKey="polana-klamstw-warning"
      />

      {/* Nagłówek sekcji */}
      <header className="mb-8 text-center">
        <h1 className="font-display text-4xl font-bold text-base-50 md:text-5xl">
          {t('polanaKlamstw.title')}
        </h1>
        <p className="mt-3 text-lg text-base-300">
          {t('polanaKlamstw.subtitle')}
        </p>
      </header>

      {/* Czytnik baśni */}
      <Suspense fallback={<div>Ładowanie...</div>}>
        <PolanaKlamstwReader />
      </Suspense>
    </div>
  );
}
```

### 6.2 Główny Czytnik

**src/features/polana-klamstw/PolanaKlamstwReader.tsx:**
```typescript
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { polanaData } from './polana.data';
import { ChapterContent } from './ChapterContent';
import { ChapterNavigation } from './ChapterNavigation';
import { TableOfContents } from './TableOfContents';
import { BookmarkProgress } from './BookmarkProgress';
import './polana.css';

export function PolanaKlamstwReader() {
  const { chapter } = useParams<{ chapter?: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Jeśli brak chapter parametru, pokaż spis treści
  const showTOC = !chapter;

  // Znajdź bieżący rozdział
  const currentChapter = polanaData.chapters.find((ch) => ch.id === chapter);
  const currentIndex = polanaData.chapters.findIndex((ch) => ch.id === chapter);

  // Nawigacja
  const previousChapter = currentIndex > 0 ? polanaData.chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < polanaData.chapters.length - 1
    ? polanaData.chapters[currentIndex + 1]
    : null;

  // Zapamiętaj ostatnio czytany rozdział
  useEffect(() => {
    if (chapter) {
      localStorage.setItem('polana-klamstw-last-chapter', chapter);
    }
  }, [chapter]);

  // Przywróć ostatni rozdział przy pierwszym załadowaniu
  useEffect(() => {
    if (showTOC) {
      const lastChapter = localStorage.getItem('polana-klamstw-last-chapter');
      if (lastChapter && lastChapter !== 'undefined') {
        // Opcjonalnie: zapytaj użytkownika czy chce kontynuować
        const shouldContinue = window.confirm(
          t('polanaKlamstw.continueReading',
            `Kontynuować czytanie od rozdziału ${lastChapter}?`)
        );
        if (shouldContinue) {
          navigate(`/polana-klamstw/${lastChapter}`);
        }
      }
    }
  }, []);

  if (showTOC) {
    return (
      <div className="polana-klamstw-toc">
        <TableOfContents chapters={polanaData.chapters} />
        <BookmarkProgress chapters={polanaData.chapters} />
      </div>
    );
  }

  if (!currentChapter) {
    return (
      <div className="polana-klamstw-error">
        <h2>{t('error.chapterNotFound', 'Rozdział nie został znaleziony')}</h2>
        <button onClick={() => navigate('/polana-klamstw')}>
          {t('polanaKlamstw.backToContents')}
        </button>
      </div>
    );
  }

  return (
    <div className="polana-klamstw-reader">
      <ChapterContent chapter={currentChapter} />
      <ChapterNavigation
        previous={previousChapter}
        next={nextChapter}
        onNavigate={(chapterId) => navigate(`/polana-klamstw/${chapterId}`)}
      />
    </div>
  );
}
```

### 6.3 Nawigacja Między Rozdziałami

**src/features/polana-klamstw/ChapterNavigation.tsx:**
```typescript
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { Chapter } from './polana.types';

interface ChapterNavigationProps {
  previous: Chapter | null;
  next: Chapter | null;
  onNavigate: (chapterId: string) => void;
}

export function ChapterNavigation({
  previous,
  next,
  onNavigate
}: ChapterNavigationProps) {
  const { t } = useTranslation();

  return (
    <nav className="chapter-navigation" aria-label="Nawigacja rozdziałów">
      <div className="chapter-nav-container">
        {/* Powrót do spisu treści */}
        <Link
          to="/polana-klamstw"
          className="chapter-nav-toc"
        >
          ← {t('polanaKlamstw.backToContents')}
        </Link>

        {/* Nawigacja poprzedni/następny */}
        <div className="chapter-nav-buttons">
          {previous ? (
            <button
              onClick={() => onNavigate(previous.id)}
              className="chapter-nav-btn chapter-nav-prev"
              aria-label={t('polanaKlamstw.previousChapter')}
            >
              <span className="chapter-nav-icon">←</span>
              <span className="chapter-nav-label">
                {previous.title}
              </span>
            </button>
          ) : (
            <div /> {/* Spacer */}
          )}

          {next ? (
            <button
              onClick={() => onNavigate(next.id)}
              className="chapter-nav-btn chapter-nav-next"
              aria-label={t('polanaKlamstw.nextChapter')}
            >
              <span className="chapter-nav-label">
                {next.title}
              </span>
              <span className="chapter-nav-icon">→</span>
            </button>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
```

### 6.4 Spis Treści

**src/features/polana-klamstw/TableOfContents.tsx:**
```typescript
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Chapter } from './polana.types';

interface TableOfContentsProps {
  chapters: Chapter[];
}

export function TableOfContents({ chapters }: TableOfContentsProps) {
  const { t } = useTranslation();

  return (
    <div className="table-of-contents">
      <h2 className="toc-title">
        {t('polanaKlamstw.tableOfContents')}
      </h2>

      <ol className="toc-list">
        {chapters.map((chapter, index) => (
          <li key={chapter.id} className="toc-item">
            <Link
              to={`/polana-klamstw/${chapter.id}`}
              className="toc-link group"
            >
              <span className="toc-number">
                {chapter.id === 'prolog'
                  ? t('polanaKlamstw.prolog')
                  : chapter.id === 'epilog'
                  ? t('polanaKlamstw.epilog')
                  : `${t('polanaKlamstw.chapter')} ${chapter.id}`
                }
              </span>
              <span className="toc-title-text">
                {chapter.title}
              </span>
              <span className="toc-time">
                {chapter.estimatedReadingTime} min
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
```

---

## 7. STYLOWANIE

### 7.1 CSS Dedykowane

**src/features/polana-klamstw/polana.css:**
```css
/* Główny kontener czytnika */
.polana-klamstw-reader {
  max-width: 42rem; /* ~672px, optymalne dla czytania */
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* Treść rozdziału */
.chapter-content {
  font-family: 'Georgia', serif;
  font-size: 1.125rem; /* 18px */
  line-height: 1.75; /* Zwiększona czytelność */
  color: var(--color-base-100);
}

.chapter-content h1 {
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--color-base-50);
}

.chapter-content p {
  margin-bottom: 1.5rem;
  text-align: justify;
}

/* Nawigacja rozdziałów */
.chapter-navigation {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-base-800);
}

.chapter-nav-buttons {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.5rem;
}

.chapter-nav-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--color-base-900);
  border: 1px solid var(--color-base-700);
  border-radius: 0.5rem;
  color: var(--color-base-200);
  font-size: 0.875rem;
  transition: all 0.2s;
  cursor: pointer;
}

.chapter-nav-btn:hover {
  background: var(--color-base-850);
  border-color: var(--color-accent-500);
  color: var(--color-accent-300);
}

/* Spis treści */
.table-of-contents {
  max-width: 48rem;
  margin: 0 auto;
}

.toc-list {
  list-style: none;
  padding: 0;
  counter-reset: toc-counter;
}

.toc-item {
  margin-bottom: 0.5rem;
}

.toc-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--color-base-900);
  border: 1px solid var(--color-base-800);
  border-radius: 0.5rem;
  transition: all 0.2s;
  text-decoration: none;
}

.toc-link:hover {
  background: var(--color-base-850);
  border-color: var(--color-accent-500);
  transform: translateX(4px);
}

/* Responsywność */
@media (max-width: 640px) {
  .chapter-content {
    font-size: 1rem;
  }

  .chapter-nav-buttons {
    flex-direction: column;
  }

  .chapter-nav-btn {
    width: 100%;
    justify-content: center;
  }
}

/* Tryb ciemny / jasny */
@media (prefers-color-scheme: light) {
  .chapter-content {
    color: var(--color-base-900);
  }
}
```

---

## 8. MODYFIKACJE ISTNIEJĄCYCH PLIKÓW

### 8.1 src/router.tsx

```typescript
// Dodaj import
const PolanaKlamstw = lazy(() => import('./pages/PolanaKlamstw'));

// Dodaj w tablicy routes (linia ~38)
{ path: 'polana-klamstw/:chapter?', element: <PolanaKlamstw /> },
```

### 8.2 src/components/Header.tsx

```typescript
// Dodaj w prefetchers (linia ~80)
'/polana-klamstw': () => import('../pages/PolanaKlamstw'),

// Dodaj w NAV_ITEMS (linia ~25)
{ to: '/polana-klamstw', labelKey: 'navigation.polanaKlamstw' },
```

### 8.3 src/components/Breadcrumbs.tsx

```typescript
// Dodaj w routeLabels
'polana-klamstw': 'breadcrumbs.polanaKlamstw',
```

---

## 9. FUNKCJE DODATKOWE (OPCJONALNE)

### 9.1 Zapamiętywanie Postępu

**src/features/polana-klamstw/BookmarkProgress.tsx:**
```typescript
export function BookmarkProgress({ chapters }: { chapters: Chapter[] }) {
  const { t } = useTranslation();
  const [readChapters, setReadChapters] = useState<Set<string>>(
    () => new Set(JSON.parse(localStorage.getItem('polana-read-chapters') || '[]'))
  );

  const progress = (readChapters.size / chapters.length) * 100;

  return (
    <div className="bookmark-progress">
      <h3>{t('polanaKlamstw.readingProgress')}</h3>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p>{readChapters.size} / {chapters.length} rozdziałów przeczytanych</p>
    </div>
  );
}
```

### 9.2 Safe Reading Mode (Bezpieczny Tryb)

- Integracja z istniejącym `SafeReadingToggle`
- Ukrycie potencjalnie trudnych fragmentów
- Opcja wyświetlenia ostrzeżeń przed wrażliwymi tematami

### 9.3 Eksport do PDF

- Przycisk "Pobierz jako PDF"
- Generowanie PDF z całą baśnią
- Opcja drukowania

---

## 10. TIMELINE IMPLEMENTACJI

### Faza 1: Przygotowanie (1-2h)
- [ ] Utworzenie struktury katalogów
- [ ] Dodanie typów TypeScript
- [ ] Przygotowanie danych (polana.data.ts)
- [ ] Dodanie tłumaczeń (i18n)

### Faza 2: Komponenty (2-3h)
- [ ] Implementacja PolanaKlamstwReader
- [ ] Implementacja TableOfContents
- [ ] Implementacja ChapterNavigation
- [ ] Implementacja ChapterContent

### Faza 3: Integracja (1h)
- [ ] Modyfikacja router.tsx
- [ ] Modyfikacja Header.tsx
- [ ] Dodanie stylów CSS
- [ ] Testowanie nawigacji

### Faza 4: Dopracowanie (1h)
- [ ] Testy jednostkowe
- [ ] Responsive design
- [ ] Accessibility (ARIA, keyboard navigation)
- [ ] Optymalizacja wydajności

---

## 11. CHECKLIST PRZED WDROŻENIEM

- [ ] Wszystkie rozdziały (prolog + 13 + epilog) mają treść
- [ ] Tłumaczenia w pl.json, en.json, nl.json
- [ ] Testy jednostkowe napisane i przechodzą
- [ ] Build projektu działa (`pnpm build`)
- [ ] Testy E2E przechodzą
- [ ] Accessibility audit (Lighthouse) >= 90
- [ ] Responsive design sprawdzony (mobile, tablet, desktop)
- [ ] Safe Reading Mode zintegrowany (jeśli potrzebne)
- [ ] Dokumentacja użytkownika zaktualizowana

---

## 12. POTENCJALNE ROZSZERZENIA

### Przyszłość:
1. **Ilustracje:** Dodanie obrazków do rozdziałów
2. **Audio:** Narracja audio (text-to-speech lub nagrania)
3. **Animacje:** Delikatne animacje przy przewijaniu
4. **Komentarze:** Możliwość dodawania komentarzy przez użytkowników
5. **Udostępnianie:** Share buttons (Twitter, Facebook)
6. **Statystyki:** Tracking czasu czytania, najpopularniejsze rozdziały

---

## 13. KONTAKT I WSPARCIE

**Pytania techniczne:** Sprawdź dokumentację w `/docs/developer/`

**Propozycje zmian:** Otwórz issue w repozytorium GitHub

---

**Koniec dokumentu**
