import { useMemo, useState, type JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { useRedFlagsStore } from './redflags.store';
import type { RedFlagCategory, RedFlagEntry } from './redflags.schema';

const categories: Array<RedFlagCategory | 'all'> = [
  'all',
  'gaslighting',
  'financial_abuse',
  'stalking',
  'legal_weaponization',
  'emotional_blackmail',
  'devaluation',
  'discard',
  'hoovering'
];

const formatDate = (value: string, locale: string) => {
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(value));
  } catch (error) {
    console.warn('Failed to format red flag date', error);
    return value;
  }
};

const shouldInclude = (
  entry: RedFlagEntry,
  filters: {
    category: RedFlagCategory | 'all';
    intensity: number | 'all';
    from: string;
    to: string;
  }
) => {
  const date = entry.date;
  if (filters.from && date < filters.from) {
    return false;
  }
  if (filters.to && date > filters.to) {
    return false;
  }
  if (filters.category !== 'all' && entry.category !== filters.category) {
    return false;
  }
  if (filters.intensity !== 'all' && entry.intensity !== filters.intensity) {
    return false;
  }
  return true;
};

export function RedFlagList(): JSX.Element {
  const { t, i18n } = useTranslation();
  const entries = useRedFlagsStore((state) => state.entries);
  const [filters, setFilters] = useState<{
    from: string;
    to: string;
    category: RedFlagCategory | 'all';
    intensity: number | 'all';
  }>({ from: '', to: '', category: 'all', intensity: 'all' });

  const filteredEntries = useMemo(
    () => entries.filter((entry) => shouldInclude(entry, filters)),
    [entries, filters]
  );

  const handleExport = () => {
    try {
      const data = JSON.stringify(entries, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `red-flags-${new Date().toISOString()}.json`;
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.warn('Failed to export red flag log', error);
    }
  };

  const updateFilter = <Key extends keyof typeof filters>(key: Key, value: (typeof filters)[Key]) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <section
      aria-labelledby="redflag-list-title"
      className="space-y-4 rounded-xl border border-base-800 bg-base-900/70 p-6"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h3 id="redflag-list-title" className="text-lg font-semibold text-base-50">
          {t('rf.list.title')}
        </h3>
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center justify-center rounded-md bg-accent-500 px-4 py-2 text-sm font-semibold text-base-950 transition-colors hover:bg-accent-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300 focus-visible:ring-offset-2 focus-visible:ring-offset-base-950"
        >
          {t('rf.export')}
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <label htmlFor="filter-from" className="block text-xs font-medium text-base-200">
            {t('rf.filter.from')}
          </label>
          <input
            id="filter-from"
            type="date"
            value={filters.from}
            onChange={(event) => updateFilter('from', event.target.value)}
            className="w-full rounded-md border border-base-700 bg-base-900 px-3 py-2 text-sm text-base-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-base-950"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="filter-to" className="block text-xs font-medium text-base-200">
            {t('rf.filter.to')}
          </label>
          <input
            id="filter-to"
            type="date"
            value={filters.to}
            onChange={(event) => updateFilter('to', event.target.value)}
            className="w-full rounded-md border border-base-700 bg-base-900 px-3 py-2 text-sm text-base-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-base-950"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="filter-category" className="block text-xs font-medium text-base-200">
            {t('rf.filter.category')}
          </label>
          <select
            id="filter-category"
            value={filters.category}
            onChange={(event) => updateFilter('category', event.target.value as RedFlagCategory | 'all')}
            className="w-full rounded-md border border-base-700 bg-base-900 px-3 py-2 text-sm text-base-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-base-950"
          >
            {categories.map((option) => (
              <option key={option} value={option}>
                {option === 'all' ? t('rf.filter.all') : t(`rf.categories.${option}`)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="filter-intensity" className="block text-xs font-medium text-base-200">
            {t('rf.filter.intensity')}
          </label>
          <select
            id="filter-intensity"
            value={filters.intensity}
            onChange={(event) => {
              const value = event.target.value;
              updateFilter('intensity', value === 'all' ? 'all' : Number(value));
            }}
            className="w-full rounded-md border border-base-700 bg-base-900 px-3 py-2 text-sm text-base-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-base-950"
          >
            <option value="all">{t('rf.filter.all')}</option>
            {[1, 2, 3, 4, 5].map((level) => (
              <option key={level} value={level}>
                {t('rf.filter.intensityValue', { value: level })}
              </option>
            ))}
          </select>
        </div>
      </div>
      {filteredEntries.length === 0 ? (
        <p className="rounded-lg border border-dashed border-base-800 p-6 text-sm text-base-300">
          {t('rf.none')}
        </p>
      ) : (
        <ul className="space-y-4" aria-live="polite">
          {filteredEntries
            .slice()
            .sort((a, b) => (a.date < b.date ? 1 : -1))
            .map((entry) => (
              <li key={entry.id} className="rounded-lg border border-base-800 bg-base-900/60 p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-sm font-semibold text-base-100">
                    {formatDate(entry.date, i18n.language)}
                  </p>
                  <span className="rounded-full bg-accent-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-300">
                    {t(`rf.categories.${entry.category}`)}
                  </span>
                  <span className="text-xs text-base-300">
                    {t('rf.filter.intensityValue', { value: entry.intensity })}
                  </span>
                </div>
                {entry.note ? (
                  <p className="mt-3 whitespace-pre-line text-sm text-base-200">{entry.note}</p>
                ) : null}
              </li>
            ))}
        </ul>
      )}
    </section>
  );
}
