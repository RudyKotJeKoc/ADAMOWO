import { useId } from 'react';
import { useTranslation } from 'react-i18next';

import { PROGRAM_ICON_MAP } from './icons';
import type { ProgramMeta } from './studio.schema';

export type ProgramHeaderProps = {
  program: ProgramMeta;
};

export function ProgramHeader({ program }: ProgramHeaderProps) {
  const { t } = useTranslation();
  const Icon = PROGRAM_ICON_MAP[program.icon];
  const headingId = useId();

  return (
    <header
      className="relative overflow-hidden rounded-3xl border border-base-800 bg-[radial-gradient(circle_at_top,_#1a1f3a,_#070914)] p-6 shadow-2xl shadow-black/40 sm:p-10"
      role="banner"
      aria-labelledby={headingId}
    >
      <div
        className="absolute -top-16 right-[-60px] h-48 w-48 rounded-full bg-base-700/30 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="flex h-28 w-28 flex-shrink-0 items-center justify-center rounded-2xl border border-base-700/80 bg-base-900/80 shadow-lg shadow-black/40">
          <Icon className="h-20 w-20" aria-hidden focusable="false" />
        </div>
        <div className="space-y-3 text-base-100">
          <h1
            id={headingId}
            className="text-3xl font-semibold tracking-tight text-base-50 sm:text-4xl"
          >
            {t(program.titleKey)}
          </h1>
          {program.subtitleKey ? (
            <p className="text-lg text-base-200">{t(program.subtitleKey)}</p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
