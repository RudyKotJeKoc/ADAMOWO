import type { ReactElement } from 'react';
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

import { AnalysisCard } from '../features/analizy/AnalysisCard';
import {
  ANALYSES,
  ANALYSIS_CATEGORIES,
  getAnalysesByCategory,
  getFeaturedAnalyses,
  searchAnalyses,
} from '../features/analizy/analizy.data';
import type { AnalysisCategory } from '../features/analizy/analizy.schema';

/**
 * Main Analyses page (/analizy).
 *
 * Central library for deep-dive content, organized hierarchically with
 * categories and search functionality as specified in UX documentation.
 *
 * Features:
 * - Hierarchical category organization
 * - Strong search functionality
 * - Featured analyses section
 * - Teaser cards with "read more" links
 * - Responsive grid layout
 */
export default function Analyses(): ReactElement {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<AnalysisCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and search analyses
  const filteredAnalyses = useMemo(() => {
    let results = ANALYSES;

    // Apply category filter
    if (selectedCategory !== 'all') {
      results = getAnalysesByCategory(selectedCategory);
    }

    // Apply search
    if (searchQuery.trim()) {
      results = searchAnalyses(searchQuery);
    }

    return results;
  }, [selectedCategory, searchQuery]);

  const featuredAnalyses = getFeaturedAnalyses();

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <header className="space-y-4">
        <h1 className="text-4xl font-bold text-base-50 sm:text-5xl">
          {t('analizy.title', 'Analizy')}
        </h1>
        <p className="max-w-3xl text-lg leading-relaxed text-base-200">
          {t(
            'analizy.description',
            'Biblioteka treści głębokich – dogłębne analizy manipulacji psychicznej, dokumentacja przypadków i eksploracja wzorców. Każda analiza to kompleksowe studium zaprojektowane dla użytkowników poszukujących wiedzy eksperta.'
          )}
        </p>
      </header>

      {/* Search Bar */}
      <div className="relative">
        <label htmlFor="analysis-search" className="sr-only">
          {t('analizy.searchLabel', 'Szukaj analiz')}
        </label>
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-base-400" />
          <input
            id="analysis-search"
            type="search"
            placeholder={t(
              'analizy.searchPlaceholder',
              'Szukaj po tytule, tagach lub słowach kluczowych...'
            )}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-base-800 bg-base-900/80 py-3 pl-12 pr-4 text-base-100 placeholder-base-500 transition focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/50"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-base-400">
          {t('analizy.filterByCategory', 'Filtruj po kategorii')}
        </h2>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              selectedCategory === 'all'
                ? 'bg-accent-500 text-base-950'
                : 'bg-base-800/60 text-base-200 hover:bg-base-800'
            }`}
          >
            {t('analizy.allCategories', 'Wszystkie')}
          </button>

          {ANALYSIS_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedCategory === category.id
                  ? 'text-base-950'
                  : 'bg-base-800/60 text-base-200 hover:bg-base-800'
              }`}
              style={
                selectedCategory === category.id ? { backgroundColor: category.color } : undefined
              }
            >
              <span role="img" aria-hidden="true">
                {category.icon}
              </span>
              <span>{t(category.nameKey)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Analyses Section */}
      {selectedCategory === 'all' && !searchQuery && featuredAnalyses.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-base-50">
              {t('analizy.featured', 'Wyróżnione')}
            </h2>
            <span className="rounded-full bg-accent-500/20 px-3 py-1 text-xs font-semibold text-accent-200">
              {featuredAnalyses.length}
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {featuredAnalyses.map((analysis) => (
              <AnalysisCard key={analysis.id} analysis={analysis} variant="featured" />
            ))}
          </div>
        </section>
      )}

      {/* All Analyses Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-base-50">
            {searchQuery
              ? t('analizy.searchResults', 'Wyniki wyszukiwania')
              : selectedCategory !== 'all'
                ? t(ANALYSIS_CATEGORIES.find((c) => c.id === selectedCategory)?.nameKey || '')
                : t('analizy.allAnalyses', 'Wszystkie analizy')}
          </h2>
          <span className="text-sm text-base-400">
            {filteredAnalyses.length}{' '}
            {t('analizy.resultsCount', {
              count: filteredAnalyses.length,
              defaultValue: 'wyników',
            })}
          </span>
        </div>

        {filteredAnalyses.length === 0 ? (
          <div className="rounded-xl border border-base-800 bg-base-900/40 p-12 text-center">
            <p className="text-base-400">
              {t('analizy.noResults', 'Nie znaleziono analiz spełniających kryteria.')}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAnalyses
              .filter((analysis) => !analysis.featured || selectedCategory !== 'all')
              .map((analysis) => (
                <AnalysisCard key={analysis.id} analysis={analysis} />
              ))}
          </div>
        )}
      </section>
    </div>
  );
}
