import { useTranslation } from 'react-i18next';

import type { Episode } from './data.schema';
import { EpisodeCard } from './EpisodeCard';

type EpisodeListProps = {
  episodes: Episode[];
  selectedEpisodeId: string | null;
  onSelect: (episode: Episode) => void;
  isLoading?: boolean;
};

export function EpisodeList({ episodes, selectedEpisodeId, onSelect, isLoading = false }: EpisodeListProps): JSX.Element {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-base-800 bg-base-900/40 text-base-300">
        {t('analysis.state.loading')}
      </div>
    );
  }

  if (episodes.length === 0) {
    return (
      <div
        role="status"
        className="flex h-full items-center justify-center rounded-2xl border border-base-800 bg-base-900/40 p-8 text-center text-base-200"
      >
        {t('analysis.state.empty')}
      </div>
    );
  }

  return (
    <ul className="grid gap-4" aria-label={t('analysis.list.ariaLabel')}>
      {episodes.map((episode) => (
        <li key={episode.id}>
          <EpisodeCard episode={episode} isActive={episode.id === selectedEpisodeId} onSelect={onSelect} />
        </li>
      ))}
    </ul>
  );
}
