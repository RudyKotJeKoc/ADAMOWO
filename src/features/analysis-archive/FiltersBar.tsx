import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

import type { EpisodeCategory, EpisodeFiltersMetadata, EpisodeSort } from './data.schema';

type FiltersBarProps = {
  total: number;
  search: string;
  categories: EpisodeCategory[];
  tags: string[];
  sort: EpisodeSort;
  metadata: EpisodeFiltersMetadata;
  onSearchChange: (value: string) => void;
  onToggleCategory: (value: EpisodeCategory) => void;
  onToggleTag: (value: string) => void;
  onSortChange: (value: EpisodeSort) => void;
};

function formatCategoryId(category: EpisodeCategory): string {
  return `analysis-category-${category}`;
}

function formatTagId(tag: string): string {
  return `analysis-tag-${tag}`;
}

export function FiltersBar({
  total,
  search,
  categories,
  tags,
  sort,
  metadata,
  onSearchChange,
  onToggleCategory,
  onToggleTag,
  onSortChange
}: FiltersBarProps): JSX.Element {
  const { t } = useTranslation();
  const resultId = 'analysis-results-count';

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const handleSort = (event: ChangeEvent<HTMLSelectElement>) => {
    onSortChange(event.target.value as EpisodeSort);
  };

  return (
    <section
      className="sticky top-4 z-10 space-y-6 rounded-2xl border border-base-800 bg-[linear-gradient(160deg,_#10142c,_#050713)] p-6 shadow-lg shadow-black/40"
      role="region"
      aria-labelledby="analysis-filters-title"
    >
      <div className="flex items-center justify-between gap-4">
        <h2 id="analysis-filters-title" className="text-lg font-semibold text-accent-300">
          {t('analysis.filters.title')}
        </h2>
        <p id={resultId} className="text-sm text-base-300">
          {t('analysis.filters.results', { count: total })}
        </p>
      </div>

      <div className="space-y-4" aria-describedby={resultId}>
        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-base-200">
            {t('analysis.filters.searchLabel')}
          </span>
          <input
            type="search"
            value={search}
            onChange={handleSearch}
            placeholder={t('analysis.filters.searchPlaceholder') ?? ''}
            className="rounded-xl border border-base-800 bg-base-900/40 px-4 py-2 text-sm text-base-100 placeholder:text-base-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
          />
        </label>

        <fieldset className="space-y-2" aria-describedby={resultId}>
          <legend className="text-xs font-semibold uppercase tracking-wide text-base-200">
            {t('analysis.filters.categoriesLabel')}
          </legend>
          <div className="flex flex-wrap gap-2">
            {metadata.categories.map((category) => {
              const id = formatCategoryId(category.value);
              const checked = categories.includes(category.value);
              return (
                <label
                  key={category.value}
                  htmlFor={id}
                  className="flex cursor-pointer items-center gap-2 rounded-full border border-base-700 px-3 py-1 text-xs text-base-200 transition hover:border-accent-400 hover:text-accent-200"
                >
                  <input
                    id={id}
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleCategory(category.value)}
                    className="h-3 w-3 accent-accent-400"
                  />
                  <span>{t(`analysis.categories.${category.value}`)}</span>
                  <span className="text-[10px] text-base-500">{category.count}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="space-y-2" aria-describedby={resultId}>
          <legend className="text-xs font-semibold uppercase tracking-wide text-base-200">
            {t('analysis.filters.tagsLabel')}
          </legend>
          <div className="flex flex-wrap gap-2">
            {metadata.tags.map((tag) => {
              const id = formatTagId(tag.value);
              const checked = tags.includes(tag.value);
              return (
                <label
                  key={tag.value}
                  htmlFor={id}
                  className="flex cursor-pointer items-center gap-2 rounded-full border border-base-700 px-3 py-1 text-xs text-base-200 transition hover:border-accent-400 hover:text-accent-200"
                >
                  <input
                    id={id}
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleTag(tag.value)}
                    className="h-3 w-3 accent-accent-400"
                  />
                  <span>#{tag.value}</span>
                  <span className="text-[10px] text-base-500">{tag.count}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-base-200">
            {t('analysis.filters.sortLabel')}
          </span>
          <select
            value={sort}
            onChange={handleSort}
            className="rounded-xl border border-base-800 bg-base-900/40 px-3 py-2 text-sm text-base-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
          >
            <option value="newest">{t('analysis.filters.sortNewest')}</option>
            <option value="oldest">{t('analysis.filters.sortOldest')}</option>
            <option value="durationAsc">{t('analysis.filters.sortDurationAsc')}</option>
            <option value="durationDesc">{t('analysis.filters.sortDurationDesc')}</option>
          </select>
        </label>
      </div>
    </section>
  );
}
