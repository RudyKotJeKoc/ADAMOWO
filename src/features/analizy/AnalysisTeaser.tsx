import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/outline';

import { getFeaturedAnalyses } from './analizy.data';

/**
 * Analysis teaser component for the home page.
 *
 * Implements the "teaser + link" pattern from UX documentation (Directive 2.3).
 * Replaces the full "Curse of Eight" section with a concise preview that
 * creates "scent of information" to guide user decisions.
 *
 * Features:
 * - Intriguing header
 * - Brief summary (1-2 sentences)
 * - Visual cue (icon)
 * - Clear "Read more" CTA
 * - Shows featured analyses
 */
export function AnalysisTeaser(): ReactElement {
  const { t } = useTranslation();
  const featuredAnalyses = getFeaturedAnalyses().slice(0, 2); // Show max 2 featured

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SparklesIcon className="h-8 w-8 text-accent-400" />
          <h2 className="text-3xl font-bold text-base-50">
            {t('pages.home.analizyTeaser.title', 'Dogłębne Analizy')}
          </h2>
        </div>
        <Link
          to="/analizy"
          className="inline-flex items-center gap-2 rounded-full bg-accent-500/10 px-4 py-2 text-sm font-semibold text-accent-300 transition hover:bg-accent-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
        >
          <span>{t('pages.home.analizyTeaser.viewAll', 'Zobacz wszystkie')}</span>
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>

      <p className="max-w-3xl text-base-200">
        {t(
          'pages.home.analizyTeaser.description',
          'Odkryj naszą bibliotekę kompleksowych analiz – od symboliki numerycznej w sprawie Adamowo, przez mechanizmy pętli przemocy, po głębokie studium przypadków manipulacji psychicznej.'
        )}
      </p>

      {featuredAnalyses.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {featuredAnalyses.map((analysis) => (
            <Link
              key={analysis.id}
              to={analysis.contentPath}
              className="group flex flex-col rounded-lg border border-accent-500/30 bg-gradient-to-br from-accent-950/20 to-base-900/40 p-5 transition-all hover:border-accent-500/50 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
            >
              <div className="mb-3 flex items-center gap-2">
                {analysis.icon && (
                  <span className="text-2xl" role="img" aria-hidden="true">
                    {analysis.icon}
                  </span>
                )}
                <h3 className="font-display text-lg font-bold text-accent-200 group-hover:text-accent-100">
                  {analysis.title}
                </h3>
              </div>

              <p className="mb-4 flex-1 text-sm leading-relaxed text-base-300">
                {analysis.teaser.slice(0, 120)}
                {analysis.teaser.length > 120 ? '...' : ''}
              </p>

              <div className="flex items-center gap-2 text-sm font-semibold text-accent-300 group-hover:text-accent-200">
                <span>{t('analizy.readMore', 'Czytaj pełną analizę')}</span>
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
