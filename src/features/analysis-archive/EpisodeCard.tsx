import { useTranslation } from 'react-i18next';

import type { Episode } from './data.schema';

type EpisodeCardProps = {
  episode: Episode;
  isActive: boolean;
  onSelect: (episode: Episode) => void;
};

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');

  return `${minutes}:${remainder}`;
}

export function EpisodeCard({ episode, isActive, onSelect }: EpisodeCardProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <article
      className="group relative overflow-hidden rounded-2xl border border-base-800 bg-base-950/60 p-6 shadow-lg shadow-black/30 transition hover:border-accent-400 hover:shadow-accent-500/30"
      aria-labelledby={`episode-${episode.id}`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 id={`episode-${episode.id}`} className="text-lg font-semibold text-base-50 group-hover:text-accent-200">
              {episode.title}
            </h3>
            <p className="mt-1 text-xs uppercase tracking-wide text-accent-300">
              {t(`analysis.categories.${episode.category}`)}
            </p>
          </div>
          <span className="rounded-full border border-base-700 px-2 py-1 text-xs text-base-200">
            {formatDuration(episode.durationSec)}
          </span>
        </div>

        <p className="text-sm text-base-300">{episode.description}</p>

        <div className="flex flex-wrap gap-2 text-xs text-base-400">
          {episode.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-base-800 px-2 py-1 text-[11px] uppercase tracking-wide"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => onSelect(episode)}
            className="rounded-full border border-accent-400 px-4 py-2 text-sm font-semibold text-accent-200 transition hover:bg-accent-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
            aria-pressed={isActive}
            aria-label={t('analysis.actions.listenEpisode', { title: episode.title })}
          >
            {t('analysis.actions.listen')}
          </button>

          {isActive ? (
            <span className="text-xs text-accent-200" aria-live="polite">
              {t('analysis.actions.currentlyPlaying')}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
