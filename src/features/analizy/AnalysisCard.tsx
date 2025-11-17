import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ClockIcon, TagIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

import type { AnalysisMetadata } from './analizy.schema';
import { getCategoryInfo } from './analizy.data';

export interface AnalysisCardProps {
  analysis: AnalysisMetadata;
  variant?: 'default' | 'featured';
}

/**
 * Analysis card component displaying teaser information.
 *
 * Implements the "teaser + link" pattern recommended in UX documentation.
 * Creates "scent of information" to guide user decisions.
 *
 * Features:
 * - Intriguing but concise header
 * - 1-2 sentence summary
 * - Visual cue (icon/category color)
 * - Clear "Read more" CTA
 * - Reading time and metadata
 */
export function AnalysisCard({ analysis, variant = 'default' }: AnalysisCardProps): ReactElement {
  const { t } = useTranslation();
  const categoryInfo = getCategoryInfo(analysis.category);

  const isFeatured = variant === 'featured' || analysis.featured;

  return (
    <article
      className={clsx(
        'group relative flex flex-col rounded-xl border transition-all',
        'hover:shadow-lg hover:-translate-y-0.5',
        isFeatured
          ? 'border-accent-500/30 bg-gradient-to-br from-accent-950/20 to-base-900/40'
          : 'border-base-800/70 bg-base-900/60 hover:border-base-700'
      )}
    >
      {/* Badge */}
      {analysis.badge && (
        <div className="absolute right-4 top-4 z-10">
          <span className="inline-flex items-center rounded-full bg-accent-500/20 px-3 py-1 text-xs font-semibold text-accent-200 backdrop-blur-sm">
            {analysis.badge}
          </span>
        </div>
      )}

      <Link
        to={analysis.contentPath}
        className="flex flex-1 flex-col p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
      >
        {/* Icon and Category */}
        <div className="mb-3 flex items-center gap-3">
          {analysis.icon && (
            <span className="text-3xl" role="img" aria-hidden="true">
              {analysis.icon}
            </span>
          )}
          {categoryInfo && (
            <span
              className="rounded-full px-3 py-1 text-xs font-medium"
              style={{
                backgroundColor: `${categoryInfo.color}20`,
                color: categoryInfo.color,
              }}
            >
              {t(categoryInfo.nameKey)}
            </span>
          )}
        </div>

        {/* Title and Subtitle */}
        <h3
          className={clsx(
            'font-display font-bold leading-tight',
            isFeatured ? 'text-2xl text-accent-200' : 'text-xl text-base-50'
          )}
        >
          {analysis.title}
        </h3>

        {analysis.subtitle && (
          <p className="mt-2 text-sm font-medium text-base-300">{analysis.subtitle}</p>
        )}

        {/* Teaser Description */}
        <p className="mt-4 flex-1 leading-relaxed text-base-200">{analysis.teaser}</p>

        {/* Metadata */}
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-base-400">
          <div className="flex items-center gap-1.5">
            <ClockIcon className="h-4 w-4" />
            <span>
              {analysis.readingTime} {t('analizy.readingMinutes', 'min')}
            </span>
          </div>

          {analysis.tags.length > 0 && (
            <div className="flex items-center gap-1.5">
              <TagIcon className="h-4 w-4" />
              <span>{analysis.tags[0]}</span>
              {analysis.tags.length > 1 && (
                <span className="text-base-500">+{analysis.tags.length - 1}</span>
              )}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-6 flex items-center gap-2 font-semibold text-accent-300 transition-colors group-hover:text-accent-200">
          <span>{t('analizy.readMore', 'Czytaj pełną analizę')}</span>
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </Link>
    </article>
  );
}
