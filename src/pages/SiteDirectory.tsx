import {
  BookOpenIcon,
  MapIcon,
  MusicalNoteIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const SECTIONS = [
  {
    title: 'Baza wiedzy ADAMOWO',
    description: 'Siedem głównych działów prowadzących od analizy do możliwych form ochrony.',
    icon: BookOpenIcon,
    links: [
      { label: 'Analizy', to: '/analiza' },
      { label: 'Definicje', to: '/definicje' },
      { label: 'Argumenty', to: '/argumenty' },
      { label: 'Mechanizmy', to: '/mechanizmy' },
      { label: 'Orzecznictwo', to: '/orzecznictwo' },
      { label: 'Wykładnie', to: '/wykladnie' },
      { label: 'Ochrona', to: '/ochrona' },
    ],
  },
  {
    title: 'Audycje i multimedia',
    description: 'Nagrane materiały audio, programy i pozostałe zasoby multimedialne.',
    icon: MusicalNoteIcon,
    links: [
      { label: 'Audycje', to: '/shows' },
      { label: 'Programy', to: '/programy' },
      { label: 'Multimedia', to: '/media' },
      { label: 'Archiwum analiz', to: '/analysis' },
    ],
  },
  {
    title: 'Narzędzia i pomoc',
    description: 'Interaktywne narzędzia, poradniki i bezpieczne punkty rozpoczęcia działania.',
    icon: ShieldCheckIcon,
    links: [
      { label: 'Poradniki', to: '/guides' },
      { label: 'Laboratorium', to: '/lab' },
      { label: 'Pętla przemocy', to: '/violence-loop' },
      { label: 'Pomoc', to: '/pomoc' },
      { label: 'Społeczność', to: '/community' },
    ],
  },
] as const;

export default function SiteDirectory(): JSX.Element {
  return (
    <section className="space-y-10">
      <header className="space-y-3">
        <p className="inline-flex items-center gap-2 rounded-full bg-accent-500/10 px-3 py-1 text-sm font-semibold text-accent-200">
          <MapIcon className="h-4 w-4" aria-hidden="true" />
          Mapa strony
        </p>
        <h1 className="text-3xl font-bold text-base-50 sm:text-4xl">Znajdź właściwy dział</h1>
        <p className="max-w-3xl text-lg leading-relaxed text-base-200">
          Bezpośredni dostęp do bazy wiedzy, nagranych audycji, analiz, narzędzi i pomocy.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <article
              key={section.title}
              className="rounded-2xl border border-base-800 bg-base-900/70 p-6"
            >
              <Icon className="h-7 w-7 text-accent-300" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-semibold text-base-50">{section.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-base-300">{section.description}</p>
              <ul className="mt-5 space-y-2">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="flex min-h-11 items-center rounded-xl border border-base-800 bg-base-950/50 px-4 py-2 text-sm font-semibold text-base-100 transition hover:border-accent-500/50 hover:text-accent-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}
