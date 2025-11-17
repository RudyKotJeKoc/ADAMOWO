import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  UsersIcon,
  HeartIcon,
  AcademicCapIcon,
  SparklesIcon,
  ClockIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

import { PROGRAM_LIST } from '../features/studio/studio.data';
import type { ProgramId } from '../features/studio/studio.schema';

/**
 * Icon mapping for program types.
 */
const PROGRAM_ICONS: Record<ProgramId, ReactElement> = {
  team: <UsersIcon className="h-8 w-8" />,
  heart: <HeartIcon className="h-8 w-8" />,
  psych: <AcademicCapIcon className="h-8 w-8" />,
  welcome: <SparklesIcon className="h-8 w-8" />,
};

/**
 * Programs catalog page (/programy).
 *
 * Presents the four main programs as an e-learning course catalog,
 * following best practices from e-learning platform design.
 * Implements Single Source of Truth (SSOT) principle - all program
 * descriptions come from studio.data.ts.
 *
 * Features:
 * - Card-based layout inspired by e-learning platforms
 * - Visual headers with icons and colors
 * - Clear "What you'll learn" messaging
 * - Prominent CTAs (Call to Action)
 * - Responsive grid layout
 */
export default function Programs(): ReactElement {
  const { t } = useTranslation();

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <header className="space-y-4">
        <h1 className="text-4xl font-bold text-base-50 sm:text-5xl">
          {t('programy.title', 'Programy Edukacyjne')}
        </h1>
        <p className="max-w-3xl text-lg leading-relaxed text-base-200">
          {t(
            'programy.description',
            'Nasze programy to nie zwykłe audycje radiowe – to strukturalne moduły edukacyjne prowadzone przez ekspertów. Każdy program oferuje unikalne perspektywy na manipulację psychiczną, toksyczne relacje i ścieżki wyjścia z przemocy.'
          )}
        </p>
      </header>

      {/* Programs Grid */}
      <div className="grid gap-8 md:grid-cols-2">
        {PROGRAM_LIST.map((program) => {
          const icon = PROGRAM_ICONS[program.id];

          return (
            <article
              key={program.id}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-base-800/70 bg-base-900/60 transition-all hover:border-base-700 hover:shadow-lg hover:-translate-y-0.5"
            >
              {/* Visual Header with Color */}
              <div
                className="flex items-center gap-4 p-6"
                style={{
                  background: `linear-gradient(135deg, ${program.color}20 0%, transparent 100%)`,
                  borderBottom: `2px solid ${program.color}40`,
                }}
              >
                <div
                  className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${program.color}30`, color: program.color }}
                >
                  {icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-base-50">{t(program.titleKey)}</h2>
                  <p className="mt-1 text-sm font-medium" style={{ color: program.color }}>
                    {t(program.subtitleKey)}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6">
                {/* "What you'll learn" section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-base-400">
                    {t('programy.whatYouLearn', 'Czego się nauczysz')}
                  </h3>
                  <div className="space-y-2">
                    {program.descriptionKeys.map((descKey, idx) => (
                      <p key={idx} className="flex items-start gap-2 text-base-200">
                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-400" />
                        <span className="flex-1">{t(descKey)}</span>
                      </p>
                    ))}
                  </div>
                </div>

                {/* Hosts */}
                {program.hosts.length > 0 && (
                  <div className="mt-6 space-y-2">
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-base-400">
                      {t('programy.hosts', 'Prowadzący')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {program.hosts.map((host, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center rounded-full bg-base-800/60 px-3 py-1 text-sm text-base-200"
                        >
                          {t(host.nameKey)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Schedule */}
                {program.schedule.length > 0 && (
                  <div className="mt-6 space-y-2">
                    <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-base-400">
                      <ClockIcon className="h-4 w-4" />
                      {t('programy.schedule', 'Harmonogram')}
                    </h4>
                    <div className="space-y-1">
                      {program.schedule.map((slot, idx) => {
                        const weekdayNames = [
                          'Niedziela',
                          'Poniedziałek',
                          'Wtorek',
                          'Środa',
                          'Czwartek',
                          'Piątek',
                          'Sobota',
                        ];
                        return (
                          <p key={idx} className="text-sm text-base-300">
                            {weekdayNames[slot.weekday]}, {slot.start} - {slot.end}
                            {slot.noteKey && (
                              <span className="ml-2 text-xs text-accent-300">
                                ({t(slot.noteKey)})
                              </span>
                            )}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="mt-8">
                  <Link
                    to={`/studio/${program.id}`}
                    className={clsx(
                      'inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3',
                      'font-semibold text-base-950 transition-all',
                      'hover:shadow-lg hover:-translate-y-0.5',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-base-900'
                    )}
                    style={
                      {
                        backgroundColor: program.color,
                        '--tw-ring-color': program.color,
                      } as React.CSSProperties
                    }
                  >
                    <span>{t('programy.goToProgram', 'Przejdź do programu')}</span>
                    <ArrowRightIcon className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="rounded-xl border border-accent-500/30 bg-accent-950/20 p-6">
        <h3 className="mb-3 text-lg font-bold text-accent-200">
          {t('programy.additionalInfo.title', 'Dlaczego "programy", a nie "audycje"?')}
        </h3>
        <p className="leading-relaxed text-accent-100/80">
          {t(
            'programy.additionalInfo.description',
            'Traktujemy nasze programy jako strukturalne moduły edukacyjne, nie jako zwykłą ramówkę radiową. Każdy program to przemyślany kurs prowadzony przez specjalistów, z jasnym celem edukacyjnym i progresją tematów. To podejście podnosi wartość treści i lepiej komunikuje edukacyjny charakter platformy.'
          )}
        </p>
      </div>
    </div>
  );
}
