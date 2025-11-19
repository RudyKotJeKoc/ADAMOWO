import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRightIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

import { PROGRAM_LIST } from '../studio/studio.data';

/**
 * Programs teaser component for the home page.
 *
 * Implements the "teaser + link" pattern from UX documentation (Directive 3.4).
 * Shows a horizontal carousel or grid of program cards linking to the full
 * /programy page.
 *
 * Features:
 * - Compact program cards
 * - Clear CTA to main programs page
 * - Visual color coding
 * - Responsive grid layout
 */
export function ProgramsTeaser(): ReactElement {
  const { t } = useTranslation();

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AcademicCapIcon className="h-8 w-8 text-accent-400" />
          <h2 className="text-3xl font-bold text-base-50">
            {t('pages.home.programyTeaser.title', 'Programy Edukacyjne')}
          </h2>
        </div>
        <Link
          to="/programy"
          className="inline-flex items-center gap-2 rounded-full bg-accent-500/10 px-4 py-2 text-sm font-semibold text-accent-300 transition hover:bg-accent-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
        >
          <span>{t('pages.home.programyTeaser.viewAll', 'Zobacz wszystkie programy')}</span>
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>

      <p className="max-w-3xl text-base-200">
        {t(
          'pages.home.programyTeaser.description',
          'Cztery główne programy edukacyjne prowadzone przez ekspertów – strukturalne kursy o manipulacji psychicznej, toksycznych relacjach i ścieżkach wyjścia z przemocy.'
        )}
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PROGRAM_LIST.map((program) => (
          <Link
            key={program.id}
            to={`/studio/${program.id}`}
            className="group flex flex-col rounded-lg border border-base-800/70 bg-base-900/60 p-4 transition-all hover:border-base-700 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
            style={
              {
                '--program-color': program.color,
              } as React.CSSProperties
            }
          >
            <div
              className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg text-2xl"
              style={{
                backgroundColor: `${program.color}30`,
                color: program.color,
              }}
            >
              {program.icon === 'team' && '👥'}
              {program.icon === 'heart' && '❤️'}
              {program.icon === 'psych' && '🧠'}
              {program.icon === 'welcome' && '✨'}
            </div>

            <h3
              className="mb-2 font-display text-lg font-bold group-hover:opacity-90"
              style={{ color: program.color }}
            >
              {t(program.titleKey)}
            </h3>

            <p className="mb-3 flex-1 text-sm text-base-300">{t(program.subtitleKey)}</p>

            <div
              className="flex items-center gap-1 text-sm font-semibold transition-colors"
              style={{ color: program.color }}
            >
              <span>{t('pages.home.programyTeaser.learnMore', 'Dowiedz się więcej')}</span>
              <ArrowRightIcon className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
