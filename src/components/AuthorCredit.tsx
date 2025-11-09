import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

export interface Author {
  id: string;
  nameKey: string;
  roleKey: string;
  bioKey?: string;
  credentials?: string[]; // Translation keys for credentials
  avatar?: string; // Optional avatar URL
}

interface AuthorCreditProps {
  authors: Author[];
  publishedDate?: string; // ISO date string
  updatedDate?: string; // ISO date string
  compact?: boolean;
  className?: string;
}

/**
 * AuthorCredit Component
 *
 * Displays author/expert information, credentials, and publication dates.
 * Provides transparency about content creators to build trust in educational materials.
 *
 * Addresses the recommendation: "Każdy materiał edukacyjny opatrzyć krótkim bio autora/eksperta
 * i datą publikacji/aktualizacji"
 */
export function AuthorCredit({
  authors,
  publishedDate,
  updatedDate,
  compact = false,
  className,
}: AuthorCreditProps): JSX.Element {
  const { t, i18n } = useTranslation();

  const formatDate = (dateString: string): string => {
    const formatter = new Intl.DateTimeFormat(i18n.language, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    return formatter.format(new Date(dateString));
  };

  return (
    <aside
      className={clsx(
        'rounded-xl border border-base-700 bg-base-900/60 backdrop-blur-sm',
        compact ? 'p-4' : 'p-6',
        className
      )}
      aria-label={t('author.credit.label', 'Informacje o autorach')}
    >
      <div className="space-y-4">
        {/* Authors */}
        <div className="space-y-3">
          {authors.map((author) => (
            <div key={author.id} className="flex gap-3">
              {!compact && author.avatar && (
                <div className="shrink-0">
                  <img
                    src={author.avatar}
                    alt=""
                    className="h-12 w-12 rounded-full border-2 border-base-700"
                  />
                </div>
              )}
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-base-50">{t(author.nameKey)}</p>
                  <span className="text-xs text-base-400">•</span>
                  <p className="text-sm text-base-300">{t(author.roleKey)}</p>
                </div>
                {!compact && author.bioKey && (
                  <p className="text-sm leading-relaxed text-base-400">{t(author.bioKey)}</p>
                )}
                {author.credentials && author.credentials.length > 0 && (
                  <ul className="flex flex-wrap gap-2" aria-label={t('author.credentials.label')}>
                    {author.credentials.map((credentialKey) => (
                      <li key={credentialKey}>
                        <span className="inline-flex items-center rounded-md border border-base-600/50 bg-base-800/50 px-2 py-0.5 text-xs text-base-300">
                          {t(credentialKey)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Dates */}
        {(publishedDate || updatedDate) && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-base-700/50 pt-3 text-xs text-base-400">
            {publishedDate && (
              <div className="flex items-center gap-1.5">
                <span aria-hidden="true">📅</span>
                <span>
                  {t('author.published', 'Opublikowano')}: {formatDate(publishedDate)}
                </span>
              </div>
            )}
            {updatedDate && (
              <div className="flex items-center gap-1.5">
                <span aria-hidden="true">🔄</span>
                <span>
                  {t('author.updated', 'Zaktualizowano')}: {formatDate(updatedDate)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
