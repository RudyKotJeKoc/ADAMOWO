import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

export interface ContentSummaryProps {
  /**
   * Summary points as array of strings
   */
  points: string[];
  /**
   * Optional title for the summary box
   */
  title?: string;
  /**
   * Optional description/subtitle
   */
  description?: string;
  /**
   * Variant style
   */
  variant?: 'default' | 'highlight' | 'compact';
  /**
   * Whether summary is collapsible
   */
  collapsible?: boolean;
  /**
   * Initial collapsed state (only if collapsible)
   */
  defaultCollapsed?: boolean;
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * ContentSummary component for displaying key takeaways and summaries (TL;DR)
 * Helps users quickly understand long content
 */
export function ContentSummary({
  points,
  title,
  description,
  variant = 'default',
  collapsible = false,
  defaultCollapsed = false,
  className = '',
}: ContentSummaryProps): JSX.Element {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const defaultTitle = t('content.summary.title', 'Podsumowanie');

  const variantStyles = {
    default: {
      container: 'border-accent-700/50 bg-gradient-to-br from-accent-950/30 to-accent-900/20',
      icon: 'text-accent-300',
      title: 'text-accent-200',
      description: 'text-accent-100',
      bullet: 'text-accent-400',
      text: 'text-accent-50',
    },
    highlight: {
      container: 'border-amber-700/50 bg-gradient-to-br from-amber-950/30 to-amber-900/20',
      icon: 'text-amber-300',
      title: 'text-amber-200',
      description: 'text-amber-100',
      bullet: 'text-amber-400',
      text: 'text-amber-50',
    },
    compact: {
      container: 'border-base-700/50 bg-base-900/30',
      icon: 'text-base-300',
      title: 'text-base-200',
      description: 'text-base-300',
      bullet: 'text-accent-400',
      text: 'text-base-100',
    },
  };

  const styles = variantStyles[variant];
  const isCompact = variant === 'compact';

  const SummaryContent = () => (
    <>
      <div className="mb-4 flex items-start gap-3">
        <div
          className={clsx(
            'flex flex-shrink-0 items-center justify-center rounded-full',
            isCompact ? 'h-8 w-8 bg-accent-500/20' : 'h-10 w-10 bg-accent-500/20',
            styles.icon
          )}
          aria-hidden="true"
        >
          <svg
            className={isCompact ? 'h-4 w-4' : 'h-6 w-6'}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className={clsx(isCompact ? 'text-base' : 'text-lg', 'font-bold', styles.title)}>
            {title || defaultTitle}
          </h3>
          {description && (
            <p className={clsx('mt-1', isCompact ? 'text-xs' : 'text-sm', styles.description)}>
              {description}
            </p>
          )}
        </div>
      </div>

      <ul className={clsx('space-y-2', isCompact ? 'text-xs' : 'text-sm', styles.text)}>
        {points.map((point, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className={clsx('flex-shrink-0', styles.bullet)} aria-hidden="true">
              ▸
            </span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </>
  );

  if (collapsible) {
    return (
      <div
        className={clsx(
          'rounded-xl border shadow-lg',
          styles.container,
          isCompact ? 'p-4' : 'p-6',
          className
        )}
      >
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="mb-3 flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-300"
          aria-expanded={!isCollapsed}
        >
          <span
            className={clsx('font-semibold', isCompact ? 'text-sm' : 'text-base', styles.title)}
          >
            {title || defaultTitle}
          </span>
          <svg
            className={clsx(
              'h-5 w-5 transition-transform',
              styles.icon,
              isCollapsed ? 'rotate-0' : 'rotate-90'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        {!isCollapsed && <SummaryContent />}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'rounded-xl border shadow-lg',
        styles.container,
        isCompact ? 'p-4' : 'p-6',
        className
      )}
      role="complementary"
      aria-label={title || defaultTitle}
    >
      <SummaryContent />
    </div>
  );
}
