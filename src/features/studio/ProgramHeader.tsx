import clsx from 'clsx';
import { useId, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { PROGRAM_ICON_MAP } from './icons';
import type { ProgramMeta } from './studio.schema';

function isProgramLive(program: ProgramMeta): boolean {
  if (!program.schedule || program.schedule.length === 0) {
    return false;
  }

  const now = new Date();
  const weekday = (now.getDay() + 7) % 7;
  const minutesNow = now.getHours() * 60 + now.getMinutes();

  return program.schedule.some((entry) => {
    if (entry.weekday !== weekday) {
      return false;
    }

    const [startHours, startMinutes] = entry.start.split(':').map((value) => Number.parseInt(value, 10));
    const [endHours, endMinutes] = entry.end.split(':').map((value) => Number.parseInt(value, 10));
    const startTotal = startHours * 60 + startMinutes;
    const endTotal = endHours * 60 + endMinutes;

    return minutesNow >= startTotal && minutesNow < endTotal;
  });
}

export type ProgramHeaderProps = {
  program: ProgramMeta;
};

export function ProgramHeader({ program }: ProgramHeaderProps) {
  const { t } = useTranslation();
  const Icon = PROGRAM_ICON_MAP[program.icon];
  const headingId = useId();

  const live = useMemo(() => isProgramLive(program), [program]);

  return (
    <header
      className="relative overflow-hidden rounded-3xl border border-base-800 bg-[radial-gradient(circle_at_top,_#1a1f3a,_#070914)] p-6 shadow-2xl shadow-black/40 sm:p-10"
      role="banner"
      aria-labelledby={headingId}
    >
      <div
        className={clsx(
          'absolute -top-16 right-[-60px] h-48 w-48 rounded-full blur-3xl',
          live ? 'bg-[#ff6b35]/50' : 'bg-base-700/30'
        )}
        aria-hidden="true"
      />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="flex h-28 w-28 flex-shrink-0 items-center justify-center rounded-2xl border border-base-700/80 bg-base-900/80 shadow-lg shadow-black/40">
          <Icon className="h-20 w-20" aria-hidden focusable="false" />
        </div>
        <div className="space-y-3 text-base-100">
          <div className="flex flex-wrap items-center gap-3">
            <h1 id={headingId} className="text-3xl font-semibold tracking-tight text-base-50 sm:text-4xl">
              {t(program.titleKey)}
            </h1>
            {live ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-[#ff6b35]/70 bg-[#ff6b35]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#ffb48a]">
                <span className="h-2 w-2 rounded-full bg-[#ff6b35] animate-pulse" aria-hidden="true" />
                {t('studio.badges.live')}
              </span>
            ) : null}
          </div>
          {program.subtitleKey ? (
            <p className="text-lg text-base-200">{t(program.subtitleKey)}</p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
