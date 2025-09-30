import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';

import type { LibraryEntry } from './library.schema';

type LibraryCardProps = {
  entry: LibraryEntry;
  isActive: boolean;
  onSelect: (entry: LibraryEntry) => void;
};

export function LibraryCard({ entry, isActive, onSelect }: LibraryCardProps): JSX.Element {
  const { t } = useTranslation();
  const descriptionId = useId();

  return (
    <article
      className={clsx(
        'group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-base-800 bg-base-925/80 p-6 transition-colors',
        'shadow-[0_0_32px_rgba(10,14,39,0.45)] backdrop-blur-sm focus-within:border-accent-400',
        isActive ? 'border-accent-400/80 bg-base-900/80' : 'hover:border-accent-500/40'
      )}
      aria-labelledby={`${entry.id}-title`}
      aria-describedby={descriptionId}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h3 id={`${entry.id}-title`} className="font-display text-xl font-semibold text-base-50">
            {t(entry.titleKey)}
          </h3>
          <motion.span
            aria-hidden="true"
            className="h-2 w-2 rounded-full"
            layout
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            style={{ background: isActive ? '#ff6b35' : 'rgba(255, 107, 53, 0.35)' }}
          />
        </div>
        <p id={descriptionId} className="text-sm leading-relaxed text-base-200">
          {t(entry.summaryKey)}
        </p>
        {entry.tags?.length ? (
          <ul className="flex flex-wrap gap-2" aria-label={t('library.tags.label')}>
            {entry.tags.map((tag) => (
              <li key={tag}>
                <span className="inline-flex items-center rounded-full border border-accent-500/30 bg-accent-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-accent-200">
                  {t(tag)}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className="mt-6 flex items-center justify-end">
        <button
          type="button"
          onClick={() => onSelect(entry)}
          className={clsx(
            'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition',
            'focus-visible:shadow-focus focus-visible:outline-none motion-safe:hover:translate-x-0.5',
            isActive
              ? 'border-accent-400 bg-accent-500 text-base-950'
              : 'border-accent-500/60 bg-transparent text-accent-200 hover:border-accent-400 hover:text-accent-100'
          )}
          aria-pressed={isActive}
          aria-label={`${t('library.view')} — ${t(entry.titleKey)}`}
        >
          <span>{t('library.view')}</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </article>
  );
}
