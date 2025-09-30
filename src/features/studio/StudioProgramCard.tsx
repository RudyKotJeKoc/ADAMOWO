import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { PROGRAM_ICON_MAP } from './icons';
import type { ProgramMeta } from './studio.schema';
import { useRecentEpisodes } from './useRecentEpisodes';

function formatDuration(minutes: number) {
  const mins = Math.floor(minutes);
  const secs = Math.floor((minutes - mins) * 60);
  return secs > 0 ? `${mins}′${secs.toString().padStart(2, '0')}″` : `${mins}′`;
}

type StudioProgramCardProps = {
  program: ProgramMeta;
};

export function StudioProgramCard({ program }: StudioProgramCardProps) {
  const { t } = useTranslation();
  const { episodes, isLoading } = useRecentEpisodes(program.id, { limit: 1 });
  const lastEpisode = episodes[0] ?? null;
  const Icon = PROGRAM_ICON_MAP[program.icon];

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-base-800 bg-base-925/80 p-6 text-base-100 shadow-xl shadow-black/40 transition focus-within:border-accent-400 focus-within:shadow-accent-500/30 hover:border-accent-400 hover:shadow-accent-500/20"
      role="region"
      aria-labelledby={`program-${program.id}`}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border border-base-700/70 bg-base-900/80">
          <Icon className="h-12 w-12" aria-hidden focusable="false" />
        </div>
        <div className="space-y-1">
          <h3 id={`program-${program.id}`} className="text-xl font-semibold text-base-50">
            {t(program.titleKey)}
          </h3>
          {program.subtitleKey ? <p className="text-sm text-base-300">{t(program.subtitleKey)}</p> : null}
        </div>
      </div>

      <p className="mt-4 flex-1 text-sm text-base-300">{t(program.descriptionKeys[0])}</p>

      <div className="mt-6 space-y-4 text-sm text-base-300">
        <div className="rounded-2xl border border-base-800 bg-base-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-base-500">{t('studio.cards.latest')}</p>
          <p className="mt-1 font-medium text-base-100" aria-live="polite">
            {isLoading
              ? t('studio.cards.loading')
              : lastEpisode
              ? t('studio.cards.latestEpisode', {
                  title: lastEpisode.title,
                  duration: formatDuration((lastEpisode.durationSec ?? 0) / 60)
                })
              : t('studio.cards.noEpisodes')}
          </p>
        </div>
        <Link
          to={`/studio/${program.id}`}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-accent-400 px-5 py-2 text-sm font-semibold text-accent-200 transition hover:bg-accent-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
          aria-label={t('studio.cards.viewProgram', { title: t(program.titleKey) })}
        >
          {t('studio.cards.cta')}
        </Link>
      </div>
    </article>
  );
}
