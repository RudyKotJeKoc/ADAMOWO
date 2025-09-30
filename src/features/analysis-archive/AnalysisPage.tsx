import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AnalysisPlayer, type AnalysisPlayerHandle } from './AnalysisPlayer';
import { EpisodeDetails } from './EpisodeDetails';
import { EpisodeList } from './EpisodeList';
import { FiltersBar } from './FiltersBar';
import type { Episode, EpisodeCategory, EpisodeFiltersMetadata, EpisodeSort } from './data.schema';
import { getEpisodes } from './api';

const ALL_CATEGORIES: EpisodeCategory[] = [
  'AktDarowania',
  'SłużebnośćUwiązania',
  'SprawaAdamskich',
  'BronNarcyza',
  'Sledztwo'
];

type FiltersState = {
  search: string;
  categories: EpisodeCategory[];
  tags: string[];
  sort: EpisodeSort;
  page: number;
  pageSize: number;
};

const INITIAL_FILTERS: FiltersState = {
  search: '',
  categories: [],
  tags: [],
  sort: 'newest',
  page: 1,
  pageSize: 6
};

function mergeMetadata(metadata: EpisodeFiltersMetadata): EpisodeFiltersMetadata {
  const categoryMap = new Map(metadata.categories.map((item) => [item.value, item.count] as const));

  for (const category of ALL_CATEGORIES) {
    if (!categoryMap.has(category)) {
      categoryMap.set(category, 0);
    }
  }

  return {
    categories: Array.from(categoryMap.entries()).map(([value, count]) => ({ value, count })),
    tags: metadata.tags
  };
}

export default function AnalysisPage(): JSX.Element {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<FiltersState>(INITIAL_FILTERS);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [total, setTotal] = useState(0);
  const [metadata, setMetadata] = useState<EpisodeFiltersMetadata>({ categories: [], tags: [] });
  const [isLoading, setIsLoading] = useState(true);
  const playerRef = useRef<AnalysisPlayerHandle | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const selectedIdRef = useRef<string | null>(null);

  useEffect(() => {
    selectedIdRef.current = selectedEpisode?.id ?? null;
  }, [selectedEpisode]);

  useEffect(() => {
    let isActive = true;
    setIsLoading(true);

    const controller = new AbortController();

    const loadData = async () => {
      try {
        const result = await getEpisodes({
          q: filters.search,
          categories: filters.categories,
          tags: filters.tags,
          sort: filters.sort,
          page: filters.page,
          pageSize: filters.pageSize
        });

        if (!isActive) {
          return;
        }

        setEpisodes(result.episodes);
        setTotal(result.total);
        setMetadata(mergeMetadata(result.metadata));

        const currentSelectedId = selectedIdRef.current;
        const nextSelected =
          (currentSelectedId && result.episodes.find((episode) => episode.id === currentSelectedId)) ??
          result.episodes[0] ??
          null;
        setSelectedEpisode(nextSelected);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('[analysis-page] Failed to load episodes', error);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [filters]);

  const pageCount = useMemo(() => {
    if (filters.pageSize === 0) {
      return 1;
    }

    return Math.max(1, Math.ceil(total / filters.pageSize));
  }, [total, filters.pageSize]);

  const handleSelectEpisode = (episode: Episode) => {
    setSelectedEpisode(episode);
  };

  const handleSelectChapter = (seconds: number) => {
    playerRef.current?.seekTo(seconds);
  };

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handleToggleCategory = (value: EpisodeCategory) => {
    setFilters((prev) => {
      const nextCategories = prev.categories.includes(value)
        ? prev.categories.filter((category) => category !== value)
        : [...prev.categories, value];
      return { ...prev, categories: nextCategories, page: 1 };
    });
  };

  const handleToggleTag = (value: string) => {
    setFilters((prev) => {
      const nextTags = prev.tags.includes(value)
        ? prev.tags.filter((tag) => tag !== value)
        : [...prev.tags, value];
      return { ...prev, tags: nextTags, page: 1 };
    });
  };

  const handleSortChange = (value: EpisodeSort) => {
    setFilters((prev) => ({ ...prev, sort: value, page: 1 }));
  };

  const handlePageChange = (delta: number) => {
    setFilters((prev) => {
      const nextPage = Math.min(Math.max(prev.page + delta, 1), pageCount);
      return { ...prev, page: nextPage };
    });
  };

  return (
    <section className="space-y-6" aria-labelledby="analysis-archive-title" role="region">
      <header className="rounded-2xl border border-base-800 bg-[linear-gradient(160deg,_#0f132a,_#050714)] p-8 text-base-50 shadow-xl shadow-black/40">
        <h1 id="analysis-archive-title" className="text-3xl font-semibold text-accent-200">
          {t('analysis.page.title')}
        </h1>
        <p className="mt-2 max-w-2xl text-base-300">{t('analysis.page.lead')}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr_360px]">
        <FiltersBar
          total={total}
          search={filters.search}
          categories={filters.categories}
          tags={filters.tags}
          sort={filters.sort}
          metadata={metadata}
          onSearchChange={handleSearchChange}
          onToggleCategory={handleToggleCategory}
          onToggleTag={handleToggleTag}
          onSortChange={handleSortChange}
        />

        <div className="space-y-4">
          <EpisodeList
            episodes={episodes}
            selectedEpisodeId={selectedEpisode?.id ?? null}
            onSelect={handleSelectEpisode}
            isLoading={isLoading}
          />

          <div className="flex items-center justify-between rounded-full border border-base-800 bg-base-900/50 px-4 py-2 text-sm text-base-200">
            <span>{t('analysis.pagination.pageIndicator', { page: filters.page, pages: pageCount })}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(-1)}
                disabled={filters.page <= 1}
                className="rounded-full border border-base-700 px-3 py-1 text-xs uppercase tracking-wide transition hover:border-accent-400 hover:text-accent-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 disabled:cursor-not-allowed disabled:border-base-800 disabled:text-base-600"
              >
                {t('analysis.pagination.previous')}
              </button>
              <button
                type="button"
                onClick={() => handlePageChange(1)}
                disabled={filters.page >= pageCount}
                className="rounded-full border border-base-700 px-3 py-1 text-xs uppercase tracking-wide transition hover:border-accent-400 hover:text-accent-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 disabled:cursor-not-allowed disabled:border-base-800 disabled:text-base-600"
              >
                {t('analysis.pagination.next')}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <AnalysisPlayer ref={playerRef} episode={selectedEpisode} />
          <EpisodeDetails episode={selectedEpisode} onSelectChapter={handleSelectChapter} />
        </div>
      </div>
    </section>
  );
}
