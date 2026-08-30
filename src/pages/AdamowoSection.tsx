import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export type AdamowoSectionId =
  | 'analiza'
  | 'debaty'
  | 'argumenty'
  | 'materialy'
  | 'orzeczenia'
  | 'wykladnie'
  | 'opinie';

interface SectionLink {
  to: string;
  title: string;
  description: string;
}

interface SectionCopy {
  letter: string;
  title: string;
  lead: string;
  links: SectionLink[];
}

type Language = 'pl' | 'en' | 'nl';

const COPY: Record<Language, Record<AdamowoSectionId, SectionCopy>> = {
  pl: {
    analiza: {
      letter: 'A',
      title: 'Analiza',
      lead: 'Konkretne sprawy, dokumenty i zdarzenia rozłożone na fakty, chronologię, twierdzenia oraz sprzeczności.',
      links: [
        {
          to: '/analizy',
          title: 'Analizy tematyczne',
          description: 'Opracowania mechanizmów manipulacji i przemocy psychicznej.',
        },
        {
          to: '/analysis',
          title: 'Archiwum analiz',
          description: 'Rozbudowana biblioteka materiałów analitycznych i audycji.',
        },
        {
          to: '/anatomy',
          title: 'Anatomia sprawy',
          description: 'Struktura zdarzeń, sygnałów ostrzegawczych i zależności.',
        },
        {
          to: '/taksonomia',
          title: 'Taksonomia manipulacji',
          description: 'Nazwanie i klasyfikacja technik widocznych w materiale.',
        },
      ],
    },
    debaty: {
      letter: 'D',
      title: 'Debaty',
      lead: 'Rozmowy i audycje zestawiające odmienne interpretacje tego samego problemu bez udawania, że spór nie istnieje.',
      links: [
        { to: '/programy', title: 'Programy', description: 'Cykle audycji i formaty edukacyjne.' },
        {
          to: '/studio',
          title: 'Studio',
          description: 'Programy, prowadzący, harmonogram i ostatnie odcinki.',
        },
        {
          to: '/shows',
          title: 'Audycje',
          description: 'Materiały przeznaczone do słuchania i dalszej dyskusji.',
        },
        {
          to: '/community',
          title: 'Społeczność',
          description: 'Miejsce na reakcje, komentarze i wymianę stanowisk.',
        },
      ],
    },
    argumenty: {
      letter: 'A',
      title: 'Argumenty',
      lead: 'Biblioteka argumentów, kontrargumentów, błędów rozumowania i technik retorycznych używanych do zniekształcania sporu.',
      links: [
        {
          to: '/taksonomia',
          title: 'Techniki manipulacji',
          description: 'Rozpoznawanie mechanizmów retorycznych i psychologicznych.',
        },
        {
          to: '/guides',
          title: 'Poradniki',
          description: 'Uporządkowane sposoby dokumentowania i uzasadniania stanowiska.',
        },
        {
          to: '/lab',
          title: 'Laboratorium',
          description: 'Interaktywne narzędzia do sprawdzania schematów i reakcji.',
        },
        {
          to: '/violence-loop',
          title: 'Pętla przemocy',
          description: 'Model zależności między działaniem, uzasadnieniem i skutkiem.',
        },
      ],
    },
    materialy: {
      letter: 'M',
      title: 'Materiały',
      lead: 'Dokumenty źródłowe, nagrania, grafiki, transkrypcje i opracowania wykorzystywane w pozostałych działach.',
      links: [
        {
          to: '/media',
          title: 'Multimedia',
          description: 'Nagrania audio, wideo i materiały do pobrania.',
        },
        {
          to: '/analysis',
          title: 'Archiwum',
          description: 'Zebrane audycje i opracowania analityczne.',
        },
        {
          to: '/shows',
          title: 'Nagrania audycji',
          description: 'Treści radiowe uporządkowane według programów.',
        },
      ],
    },
    orzeczenia: {
      letter: 'O',
      title: 'Orzeczenia',
      lead: 'Wyroki i postanowienia czytane przez pryzmat ustaleń, podstaw prawnych, toku rozumowania i praktycznych konsekwencji.',
      links: [
        {
          to: '/analizy',
          title: 'Analizy orzeczeń',
          description: 'Miejsce na szczegółowe omówienia rozstrzygnięć i ich uzasadnień.',
        },
        {
          to: '/methodology',
          title: 'Metoda analizy',
          description: 'Zasady oddzielania treści orzeczenia od komentarza i oceny.',
        },
      ],
    },
    wykladnie: {
      letter: 'W',
      title: 'Wykładnie',
      lead: 'Przepisy i pojęcia wyjaśnione normalnym językiem, z rozróżnieniem brzmienia przepisu, praktyki oraz interpretacji.',
      links: [
        {
          to: '/methodology',
          title: 'Metodologia',
          description: 'Jak powstają wnioski i na jakich źródłach się opierają.',
        },
        {
          to: '/guides',
          title: 'Objaśnienia praktyczne',
          description: 'Pojęcia i procedury przedstawione w uporządkowany sposób.',
        },
        {
          to: '/anatomy',
          title: 'Znaczenie w praktyce',
          description: 'Jak definicje i interpretacje wpływają na ocenę zdarzeń.',
        },
      ],
    },
    opinie: {
      letter: 'O',
      title: 'Opinie',
      lead: 'Felietony, komentarze i autorskie wnioski wyraźnie oddzielone od dokumentów, ustaleń faktycznych i treści orzeczeń.',
      links: [
        {
          to: '/community',
          title: 'Komentarze społeczności',
          description: 'Stanowiska i reakcje przedstawiane jako głos uczestników.',
        },
        {
          to: '/programy',
          title: 'Komentarze radiowe',
          description: 'Audycje zawierające interpretacje i autorskie oceny.',
        },
        {
          to: '/shows',
          title: 'Felietony i audycje',
          description: 'Formaty, w których ocena jest świadomą częścią przekazu.',
        },
      ],
    },
  },
  en: {} as Record<AdamowoSectionId, SectionCopy>,
  nl: {} as Record<AdamowoSectionId, SectionCopy>,
};

// The seven Polish names form the ADAMOWO information architecture in every language.
COPY.en = COPY.pl;
COPY.nl = COPY.pl;

export default function AdamowoSection({ section }: { section: AdamowoSectionId }): JSX.Element {
  const { i18n } = useTranslation();
  const language = (
    ['pl', 'en', 'nl'].includes(i18n.language.slice(0, 2)) ? i18n.language.slice(0, 2) : 'pl'
  ) as Language;
  const copy = COPY[language][section];

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
              Dział ADAMOWO
            </p>
            <h1 className="text-3xl font-bold text-base-50 sm:text-5xl">{copy.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-base-200 sm:text-lg">
              {copy.lead}
            </p>
          </div>
        </div>
      </header>

      <section aria-label={`Zawartość działu ${copy.title}`} className="grid gap-5 sm:grid-cols-2">
        {copy.links.map((item, index) => (
          <Link
            key={`${item.to}-${item.title}`}
            to={item.to}
            className="group rounded-2xl border border-base-800 bg-base-900/60 p-6 transition hover:-translate-y-0.5 hover:border-accent-500/50 hover:bg-base-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
          >
            <div className="flex items-start gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-500/10 font-display text-sm font-bold text-accent-300">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h2 className="text-lg font-semibold text-base-50 transition group-hover:text-accent-200">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-base-300">{item.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </article>
  );
}
