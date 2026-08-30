import {
  AdjustmentsHorizontalIcon,
  ArrowRightIcon,
  BookOpenIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { useDeferredValue, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { knowledgeEntries, KNOWLEDGE_REVIEW_DATE } from './knowledge.data';
import {
  CATEGORY_LABELS,
  KIND_LABELS,
  type AdamowoSectionId,
  type KnowledgeCategory,
  type KnowledgeKind,
} from './knowledge.types';

interface SectionConfig {
  letter: string;
  title: string;
  lead: string;
  question: string;
  quickLinks: Array<{ to: string; title: string; description: string }>;
}

const SECTIONS: Record<AdamowoSectionId, SectionConfig> = {
  analiza: {
    letter: 'A',
    title: 'Analizy',
    lead: 'Metodyczne rozkładanie sprawy na chronologię, źródła, twierdzenia, dowody i możliwe wyjaśnienia.',
    question: 'Od czego zacząć analizę sprawy?',
    quickLinks: [
      {
        to: '/anatomy',
        title: 'Anatomia sprawy',
        description: 'Uporządkuj zdarzenia i zależności.',
      },
      {
        to: '/analysis',
        title: 'Archiwum analiz',
        description: 'Przeglądaj opracowania i audycje.',
      },
      {
        to: '/analizy',
        title: 'Analizy tematyczne',
        description: 'Poznaj rozpoznane wzorce zachowań.',
      },
      {
        to: '/taksonomia',
        title: 'Taksonomia',
        description: 'Klasyfikuj mechanizmy bez mieszania pojęć.',
      },
    ],
  },
  definicje: {
    letter: 'D',
    title: 'Definicje',
    lead: 'Wyszukiwalna baza pojęć prawnych, procedur, zasad etycznych i mechanizmów psychologicznych.',
    question: 'Jakiego pojęcia szukasz?',
    quickLinks: [
      {
        to: '/methodology',
        title: 'Jak opracowujemy treści',
        description: 'Zobacz zasady oddzielania faktów od ocen.',
      },
      {
        to: '/mapa-strony',
        title: 'Mapa całego serwisu',
        description: 'Przejdź do pozostałych materiałów i narzędzi.',
      },
    ],
  },
  argumenty: {
    letter: 'A',
    title: 'Argumenty',
    lead: 'Od tezy, przez właściwą podstawę prawną, po dowód i odpowiedź na możliwy kontrargument.',
    question: 'Jak zbudować sprawdzalny argument?',
    quickLinks: [
      { to: '/guides', title: 'Poradniki', description: 'Pracuj krok po kroku z dokumentami.' },
      { to: '/lab', title: 'Laboratorium', description: 'Sprawdzaj schematy i warianty reakcji.' },
      { to: '/methodology', title: 'Metodologia', description: 'Oddzielaj fakt, wniosek i ocenę.' },
    ],
  },
  mechanizmy: {
    letter: 'M',
    title: 'Mechanizmy',
    lead: 'Nazwane wzorce nacisku, manipulacji i budowania narracji — zawsze z informacją o statusie pojęcia.',
    question: 'Jaki wzorzec zachowania chcesz rozpoznać?',
    quickLinks: [
      {
        to: '/taksonomia',
        title: 'Taksonomia manipulacji',
        description: 'Porównaj mechanizmy i sygnały ostrzegawcze.',
      },
      {
        to: '/violence-loop',
        title: 'Pętla przemocy',
        description: 'Zobacz zależności między fazami przemocy.',
      },
      {
        to: '/anatomy',
        title: 'Anatomia sprawy',
        description: 'Umieść wzorzec w chronologii zdarzeń.',
      },
    ],
  },
  orzecznictwo: {
    letter: 'O',
    title: 'Orzecznictwo',
    lead: 'Jak czytać sentencję i uzasadnienie, co naprawdę wiąże oraz czego nie wolno dopowiadać za sąd.',
    question: 'Jakie znaczenie ma orzeczenie?',
    quickLinks: [
      {
        to: '/methodology',
        title: 'Metoda analizy',
        description: 'Oddziel treść orzeczenia od komentarza.',
      },
      {
        to: '/analizy',
        title: 'Opracowania',
        description: 'Przeglądaj analizy z wyraźnie opisanym źródłem.',
      },
    ],
  },
  wykladnie: {
    letter: 'W',
    title: 'Wykładnie',
    lead: 'Przepisy przetłumaczone na zwykły język, z warunkami zastosowania, ograniczeniami i powiązaniami.',
    question: 'Co przepis oznacza w praktyce?',
    quickLinks: [
      {
        to: '/methodology',
        title: 'Metodologia',
        description: 'Sprawdź hierarchię i jakość źródeł.',
      },
      {
        to: '/guides',
        title: 'Objaśnienia praktyczne',
        description: 'Przejdź od przepisu do działania.',
      },
    ],
  },
  ochrona: {
    letter: 'O',
    title: 'Ochrona',
    lead: 'Procedury, terminy, zabezpieczenia i standardy zawodowe, które pomagają chronić prawa i bezpieczeństwo.',
    question: 'Jakie działanie ochronne jest dostępne?',
    quickLinks: [
      {
        to: '/pomoc',
        title: 'Pomoc i bezpieczeństwo',
        description: 'Znajdź numery i instytucje wsparcia.',
      },
      { to: '/support', title: 'Wsparcie', description: 'Przejdź do dostępnych form pomocy.' },
      {
        to: '/community',
        title: 'Społeczność',
        description: 'Skorzystaj z istniejącej przestrzeni wymiany doświadczeń.',
      },
    ],
  },
};

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pl');
}

function statusClasses(kind: KnowledgeKind): string {
  if (kind === 'model-adamowo') return 'border-purple-400/30 bg-purple-500/10 text-purple-200';
  if (kind === 'psychologia') return 'border-blue-400/30 bg-blue-500/10 text-blue-200';
  if (kind === 'procedura') return 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200';
  return 'border-accent-400/30 bg-accent-500/10 text-accent-200';
}

export default function KnowledgeBase({ section }: { section: AdamowoSectionId }): JSX.Element {
  const copy = SECTIONS[section];
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | KnowledgeCategory>('all');
  const [kind, setKind] = useState<'all' | KnowledgeKind>('all');
  const deferredQuery = useDeferredValue(query);

  const availableEntries = useMemo(
    () =>
      section === 'definicje'
        ? knowledgeEntries
        : knowledgeEntries.filter((entry) => entry.areas.includes(section)),
    [section]
  );

  const visibleEntries = useMemo(() => {
    const needle = normalize(deferredQuery.trim());
    return availableEntries.filter((entry) => {
      if (category !== 'all' && entry.category !== category) return false;
      if (kind !== 'all' && entry.kind !== kind) return false;
      if (!needle) return true;

      return normalize(
        [
          entry.title,
          entry.shortTitle,
          entry.summary,
          entry.tags.join(' '),
          entry.legalBasis?.join(' ') ?? '',
        ].join(' ')
      ).includes(needle);
    });
  }, [availableEntries, category, deferredQuery, kind]);

  return (
    <article className="space-y-10">
      <header className="relative overflow-hidden rounded-3xl border border-base-800 bg-gradient-to-br from-base-900 via-base-950 to-base-950 p-6 sm:p-10">
        <div className="absolute -right-4 -top-10 select-none font-display text-[11rem] font-black leading-none text-accent-500/5 sm:text-[15rem]">
          {copy.letter}
        </div>
        <div className="relative flex items-start gap-4 sm:gap-6">
          <span
            className="font-display text-6xl font-black leading-none text-accent-400 sm:text-8xl"
            aria-hidden="true"
          >
            {copy.letter}
          </span>
          <div>
            <p className="mb-2 font-display text-xs font-semibold uppercase tracking-[0.3em] text-base-400">
              Baza wiedzy ADAMOWO
            </p>
            <h1 className="text-3xl font-bold text-base-50 sm:text-5xl">{copy.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-base-200 sm:text-lg">
              {copy.lead}
            </p>
          </div>
        </div>
      </header>

      <aside
        className="rounded-2xl border border-accent-500/25 bg-accent-500/5 p-5 text-sm leading-relaxed text-base-200"
        aria-label="Informacja o charakterze treści"
      >
        <strong className="text-accent-200">Ważne:</strong> baza ma charakter edukacyjny i nie
        zastępuje indywidualnej porady prawnej, psychologicznej ani pomocy w nagłym zagrożeniu.
        Treści prawne sprawdzono {KNOWLEDGE_REVIEW_DATE}; przed działaniem zweryfikuj aktualny tekst
        przepisu i terminy.
      </aside>

      {copy.quickLinks.length > 0 ? (
        <section aria-labelledby="section-tools-title" className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-300">
              Narzędzia działu
            </p>
            <h2 id="section-tools-title" className="mt-1 text-2xl font-bold text-base-50">
              {copy.question}
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {copy.quickLinks.map((item) => (
              <Link
                key={`${item.to}-${item.title}`}
                to={item.to}
                className="group rounded-2xl border border-base-800 bg-base-900/60 p-5 transition hover:-translate-y-0.5 hover:border-accent-500/50 hover:bg-base-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
              >
                <h3 className="flex items-center justify-between gap-3 font-semibold text-base-50 group-hover:text-accent-200">
                  {item.title}
                  <ArrowRightIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-base-300">{item.description}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section aria-labelledby="knowledge-list-title" className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-300">
              <BookOpenIcon className="h-4 w-4" aria-hidden="true" />
              Pojęcia i procedury
            </p>
            <h2 id="knowledge-list-title" className="mt-1 text-2xl font-bold text-base-50">
              {section === 'definicje'
                ? 'Pełny katalog wiedzy'
                : `Treści powiązane z działem ${copy.title}`}
            </h2>
          </div>
          <p className="text-sm text-base-400" aria-live="polite">
            Znaleziono: <strong className="text-base-100">{visibleEntries.length}</strong>
          </p>
        </div>

        <div
          className="grid gap-3 rounded-2xl border border-base-800 bg-base-900/50 p-4 lg:grid-cols-[minmax(0,1fr)_14rem_14rem]"
          role="search"
        >
          <label className="relative block">
            <span className="sr-only">Szukaj pojęcia, przepisu lub słowa kluczowego</span>
            <MagnifyingGlassIcon
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-base-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Np. darowizna, art. 207, pełnomocnictwo…"
              className="min-h-12 w-full rounded-xl border border-base-700 bg-base-950 py-3 pl-11 pr-4 text-base-100 placeholder:text-base-500 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
          </label>
          <label>
            <span className="sr-only">Kategoria</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as 'all' | KnowledgeCategory)}
              className="min-h-12 w-full rounded-xl border border-base-700 bg-base-950 px-3 text-base-100 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            >
              <option value="all">Wszystkie kategorie</option>
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Rodzaj treści</span>
            <select
              value={kind}
              onChange={(event) => setKind(event.target.value as 'all' | KnowledgeKind)}
              className="min-h-12 w-full rounded-xl border border-base-700 bg-base-950 px-3 text-base-100 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            >
              <option value="all">Każdy rodzaj treści</option>
              {Object.entries(KIND_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {visibleEntries.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visibleEntries.map((entry) => (
              <Link
                key={entry.slug}
                to={`/definicje/${entry.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-base-800 bg-base-900/60 p-5 transition hover:-translate-y-0.5 hover:border-accent-500/50 hover:bg-base-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wide ${statusClasses(entry.kind)}`}
                  >
                    {KIND_LABELS[entry.kind]}
                  </span>
                  <span className="text-xs text-base-400">{CATEGORY_LABELS[entry.category]}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold leading-snug text-base-50 transition group-hover:text-accent-200">
                  {entry.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-base-300">{entry.summary}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent-300">
                  Wyjaśnij pojęcie <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-base-700 bg-base-900/40 p-8 text-center">
            <AdjustmentsHorizontalIcon
              className="mx-auto h-8 w-8 text-base-500"
              aria-hidden="true"
            />
            <h3 className="mt-3 font-semibold text-base-100">Brak wyników dla tych kryteriów</h3>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setCategory('all');
                setKind('all');
              }}
              className="mt-3 rounded-lg px-3 py-2 text-sm font-semibold text-accent-300 hover:bg-base-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
            >
              Wyczyść filtry
            </button>
          </div>
        )}
      </section>
    </article>
  );
}
