import type { ComponentType, ReactElement, SVGProps } from 'react';
import {
  ArrowRightIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  FolderOpenIcon,
  MicrophoneIcon,
  ScaleIcon,
  ShieldCheckIcon,
  SparklesIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

import localEpisodes from '../features/analysis-archive/data.local.json';
import { KNOWLEDGE_REVIEW_DATE, knowledgeEntries } from '../features/knowledge-base/knowledge.data';

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

interface SituationLink {
  title: string;
  description: string;
  to: string;
  icon: Icon;
}

interface FeaturedLink {
  eyebrow: string;
  title: string;
  description: string;
  meta: string;
  to: string;
  icon: Icon;
}

const situations: SituationLink[] = [
  {
    title: 'Jestem w sporze lub postępowaniu',
    description: 'Sprawdź procedury, terminy i sposoby ochrony swoich praw.',
    to: '/ochrona',
    icon: ScaleIcon,
  },
  {
    title: 'Czuję presję albo manipulację',
    description: 'Nazwij mechanizm i zobacz, po czym można go rozpoznać.',
    to: '/mechanizmy',
    icon: ShieldCheckIcon,
  },
  {
    title: 'Chcę uporządkować dowody',
    description: 'Zbuduj chronologię i oddziel fakty od interpretacji.',
    to: '/anatomy',
    icon: FolderOpenIcon,
  },
];

const beginnerPath = [
  {
    title: 'Nazwij sytuację',
    description: 'Znajdź pojęcia, które rzeczywiście pasują do zdarzeń.',
    to: '/definicje',
  },
  {
    title: 'Oddziel fakty od ocen',
    description: 'Zapisz to, co można wykazać, bez dopowiadania intencji.',
    to: '/analiza',
  },
  {
    title: 'Zbuduj chronologię',
    description: 'Połącz daty, dokumenty, wiadomości i decyzje.',
    to: '/anatomy',
  },
  {
    title: 'Sprawdź argumentację',
    description: 'Powiąż tezę z dowodem i możliwym kontrargumentem.',
    to: '/argumenty',
  },
  {
    title: 'Wybierz dalsze działanie',
    description: 'Sprawdź terminy, procedury i dostępne zabezpieczenia.',
    to: '/ochrona',
  },
];

function formatDuration(seconds: number): string {
  return `${Math.max(1, Math.round(seconds / 60))} min`;
}

export default function Home(): ReactElement {
  const latestEpisode = [...localEpisodes].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )[0];

  const featured: FeaturedLink[] = [
    {
      eyebrow: 'Audycja',
      title: latestEpisode?.title ?? 'Archiwum audycji i analiz',
      description:
        latestEpisode?.description ??
        'Posłuchaj analiz uzupełnionych opisami, rozdziałami i materiałami powiązanymi.',
      meta: latestEpisode ? formatDuration(latestEpisode.durationSec) : 'Biblioteka audio',
      to: '/analysis',
      icon: MicrophoneIcon,
    },
    {
      eyebrow: 'Wyjaśnienie',
      title: 'Odwołanie darowizny i rażąca niewdzięczność',
      description:
        'Co naprawdę wynika z art. 898 k.c., jakie znaczenie mają dowody i gdzie najczęściej pojawia się uproszczenie.',
      meta: '7 min czytania',
      to: '/definicje/art-898-kc-razaca-niewdziecznosc',
      icon: BookOpenIcon,
    },
    {
      eyebrow: 'Narzędzie',
      title: '8 grzechów toksycznej argumentacji',
      description:
        'Krótka, interaktywna analiza błędów, które osłabiają ocenę sytuacji i własne stanowisko.',
      meta: 'Wynik zapisywany lokalnie',
      to: '/guides#eight-sins',
      icon: WrenchScrewdriverIcon,
    },
  ];

  return (
    <div className="space-y-20 pb-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-base-800 bg-gradient-to-br from-base-900 via-base-950 to-base-950 px-5 py-10 shadow-2xl sm:px-10 sm:py-14 lg:px-14 lg:py-16">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent-500/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-cyan-500/5 blur-3xl"
        />

        <div className="relative max-w-4xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-200">
            <SparklesIcon className="h-4 w-4" aria-hidden="true" />
            Prawo, psychologia i dowody po ludzku
          </p>
          <h1 className="mt-7 text-4xl font-black leading-[1.08] tracking-tight text-base-50 sm:text-5xl lg:text-6xl">
            Rozumiesz, co się dzieje.
            <span className="mt-2 block text-accent-300">Wiesz, co zrobić dalej.</span>
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-base-200 sm:text-xl">
            Adamowo porządkuje prawo, mechanizmy manipulacji i materiał dowodowy. Bez urzędowego
            bełkotu, bez mieszania faktów z ocenami i bez obietnic prostych odpowiedzi na trudne
            sprawy.
          </p>
        </div>

        <div
          className="relative mt-10 grid gap-4 lg:grid-cols-3"
          aria-label="Wybierz swoją sytuację"
        >
          {situations.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                to={item.to}
                className="group flex min-h-40 flex-col rounded-2xl border border-base-700/80 bg-base-900/80 p-5 transition hover:-translate-y-1 hover:border-accent-400/70 hover:bg-base-850 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
              >
                <Icon className="h-7 w-7 text-accent-300" aria-hidden="true" />
                <h2 className="mt-4 text-lg font-bold leading-snug text-base-50 group-hover:text-accent-200">
                  {item.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-base-300">
                  {item.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent-200">
                  Zacznij tutaj
                  <ArrowRightIcon
                    className="h-4 w-4 transition group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            );
          })}
        </div>

        <dl className="relative mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-base-800 bg-base-800 sm:grid-cols-4">
          {[
            [`${knowledgeEntries.length}`, 'opracowanych pojęć'],
            ['7', 'działów wiedzy'],
            [`${localEpisodes.length}`, 'audycji w archiwum'],
            [KNOWLEDGE_REVIEW_DATE, 'ostatnia weryfikacja'],
          ].map(([value, label]) => (
            <div key={label} className="bg-base-950/90 px-4 py-4 text-center">
              <dt className="text-xs uppercase tracking-wide text-base-400">{label}</dt>
              <dd className="mt-1 text-lg font-bold text-base-100">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="featured-title" className="space-y-7">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-300">
            Wybrane na początek
          </p>
          <h2 id="featured-title" className="mt-2 text-3xl font-bold text-base-50 sm:text-4xl">
            Trzy konkretne punkty wejścia
          </h2>
          <p className="mt-3 text-base leading-relaxed text-base-300">
            Jedna audycja, jedno wyjaśnienie i jedno narzędzie. Bez przekopywania całego serwisu.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {featured.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                to={item.to}
                className={`group flex min-h-72 flex-col overflow-hidden rounded-3xl border p-6 transition hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 ${
                  index === 0
                    ? 'border-accent-500/50 bg-gradient-to-br from-accent-500/15 to-base-900'
                    : 'border-base-800 bg-base-900/60 hover:border-accent-500/50'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-300">
                    {item.eyebrow}
                  </span>
                  <Icon className="h-7 w-7 text-accent-300" aria-hidden="true" />
                </div>
                <h3 className="mt-8 text-2xl font-bold leading-tight text-base-50 group-hover:text-accent-200">
                  {item.title}
                </h3>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-base-300">
                  {item.description}
                </p>
                <div className="mt-6 flex items-center justify-between gap-3 border-t border-base-700/70 pt-4">
                  <span className="inline-flex items-center gap-2 text-xs text-base-400">
                    <ClockIcon className="h-4 w-4" aria-hidden="true" />
                    {item.meta}
                  </span>
                  <ArrowRightIcon
                    className="h-5 w-5 text-accent-300 transition group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section
        aria-labelledby="beginner-title"
        className="overflow-hidden rounded-3xl border border-base-800 bg-base-900/40"
      >
        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
          <div className="border-b border-base-800 bg-gradient-to-br from-base-900 to-base-950 p-7 sm:p-10 lg:border-b-0 lg:border-r">
            <DocumentTextIcon className="h-10 w-10 text-accent-300" aria-hidden="true" />
            <p className="mt-7 text-xs font-semibold uppercase tracking-[0.24em] text-accent-300">
              Ścieżka dla nowicjusza
            </p>
            <h2 id="beginner-title" className="mt-2 text-3xl font-bold text-base-50">
              Zacznij od porządku, nie od przepisu
            </h2>
            <p className="mt-4 leading-relaxed text-base-300">
              Pięć materiałów prowadzi od nazwania problemu do wyboru dalszego działania. Możesz
              przejść całość albo wejść od razu w potrzebny etap.
            </p>
          </div>

          <ol className="divide-y divide-base-800">
            {beginnerPath.map((item, index) => (
              <li key={item.title}>
                <Link
                  to={item.to}
                  className="group grid grid-cols-[2.75rem_minmax(0,1fr)_1.5rem] items-start gap-4 p-5 transition hover:bg-base-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-400 sm:p-6"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-accent-500/40 bg-accent-500/10 font-display text-lg font-bold text-accent-200">
                    {index + 1}
                  </span>
                  <span>
                    <strong className="block text-base font-bold text-base-50 group-hover:text-accent-200">
                      {item.title}
                    </strong>
                    <span className="mt-1 block text-sm leading-relaxed text-base-400">
                      {item.description}
                    </span>
                  </span>
                  <ArrowRightIcon
                    className="mt-3 h-5 w-5 text-base-500 transition group-hover:translate-x-1 group-hover:text-accent-300"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2" aria-label="Standardy projektu">
        <div className="rounded-2xl border border-base-800 bg-base-900/50 p-6">
          <CheckCircleIcon className="h-7 w-7 text-emerald-300" aria-hidden="true" />
          <h2 className="mt-4 text-xl font-bold text-base-50">Fakty, wnioski i opinie osobno</h2>
          <p className="mt-3 text-sm leading-relaxed text-base-300">
            Materiały pokazują podstawę twierdzenia, ograniczenia interpretacji i datę ostatniej
            weryfikacji.
          </p>
          <Link
            to="/methodology"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent-200 hover:text-accent-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
          >
            Zobacz metodologię <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="rounded-2xl border border-base-800 bg-base-900/50 p-6">
          <ShieldCheckIcon className="h-7 w-7 text-cyan-300" aria-hidden="true" />
          <h2 className="mt-4 text-xl font-bold text-base-50">Edukacja, nie indywidualna porada</h2>
          <p className="mt-3 text-sm leading-relaxed text-base-300">
            Adamowo pomaga rozumieć sytuację i przygotować pytania. Nie zastępuje adwokata,
            psychologa ani pomocy w nagłym zagrożeniu.
          </p>
          <Link
            to="/pomoc"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent-200 hover:text-accent-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
          >
            Pomoc i bezpieczeństwo <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
