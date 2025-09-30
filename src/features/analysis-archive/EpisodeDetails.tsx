import { useEffect, useMemo, useRef, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';

import type { Episode } from './data.schema';

type EpisodeDetailsProps = {
  episode: Episode | null;
  onSelectChapter: (seconds: number) => void;
};

export function EpisodeDetails({ episode, onSelectChapter }: EpisodeDetailsProps): JSX.Element {
  const { t } = useTranslation();
  const buttonsRef = useRef<HTMLButtonElement[]>([]);

  useEffect(() => {
    buttonsRef.current = [];
  }, [episode?.id]);

  const publishedDate = useMemo(() => {
    if (!episode?.publishedAt) {
      return null;
    }

    const date = new Date(episode.publishedAt);
    return date.toLocaleDateString();
  }, [episode?.publishedAt]);

  if (!episode) {
    return (
      <aside
        role="region"
        aria-labelledby="analysis-details-heading"
        className="rounded-2xl border border-base-800 bg-base-900/40 p-6 text-base-200"
      >
        <h2 id="analysis-details-heading" className="text-lg font-semibold text-base-100">
          {t('analysis.details.emptyTitle')}
        </h2>
        <p className="mt-2 text-sm">{t('analysis.details.emptyHint')}</p>
      </aside>
    );
  }

  const handleKeyNavigation = (index: number, event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
      return;
    }

    event.preventDefault();
    const offset = event.key === 'ArrowRight' ? 1 : -1;
    const next = buttonsRef.current[index + offset];
    next?.focus();
  };

  return (
    <aside
      role="region"
      aria-labelledby="analysis-details-heading"
      className="flex h-full flex-col gap-4 rounded-2xl border border-base-800 bg-[linear-gradient(160deg,_#111831,_#090c1f)] p-6 text-base-100 shadow-lg shadow-black/30"
    >
      <div>
        <h2 id="analysis-details-heading" className="text-xl font-semibold text-accent-300">
          {episode.title}
        </h2>
        <p className="mt-1 text-sm text-base-300">
          {t('analysis.details.published', { date: publishedDate ?? t('analysis.details.unknownDate') })}
        </p>
      </div>

      <p className="text-sm leading-relaxed text-base-100/90">{episode.description}</p>

      {episode.chapters && episode.chapters.length > 0 ? (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-accent-200">
            {t('analysis.details.chapters')}
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {episode.chapters.map((chapter, index) => (
              <button
                key={chapter.title}
                type="button"
                ref={(element) => {
                  if (element) {
                    buttonsRef.current[index] = element;
                  }
                }}
                onClick={() => onSelectChapter(chapter.startSec)}
                onKeyDown={(event) => handleKeyNavigation(index, event)}
                className="rounded-full border border-accent-400 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-200 transition hover:bg-accent-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                aria-label={t('analysis.details.seekTo', { title: chapter.title })}
              >
                {chapter.title}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {episode.resources && episode.resources.length > 0 ? (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-accent-200">
            {t('analysis.details.resources')}
          </h3>
          <ul className="mt-2 space-y-2 text-sm text-accent-200">
            {episode.resources.map((resource) => (
              <li key={resource.url}>
                <a
                  className="underline decoration-accent-400/60 underline-offset-4 transition hover:text-accent-400"
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {resource.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </aside>
  );
}
