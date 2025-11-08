import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export interface ExploreMoreLink {
  to: string;
  labelKey: string;
  descriptionKey?: string;
  badge?: string;
}

interface ExploreMoreProps {
  title?: string;
  links: ExploreMoreLink[];
  compact?: boolean;
}

/**
 * ExploreMore Component
 *
 * Displays related content links to encourage deeper exploration
 * of the site. Can be used at the end of sections or articles.
 */
export function ExploreMore({ title, links, compact = false }: ExploreMoreProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <nav
      className={`rounded-2xl border border-base-700 bg-[radial-gradient(circle_at_top,_#1a1f3a,_#080b1e)] shadow-lg shadow-indigo-950/40 ${
        compact ? 'p-6' : 'p-8'
      }`}
      aria-label={title || t('exploreMore.label', 'Odkryj więcej')}
    >
      <div className="space-y-4">
        {title && (
          <h3 className={`font-semibold text-base-50 ${compact ? 'text-lg' : 'text-xl'}`}>
            {title}
          </h3>
        )}

        <div className={`grid gap-4 ${compact ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="group relative overflow-hidden rounded-lg border border-base-700/50 bg-base-900/40 p-4 transition hover:border-accent-500/50 hover:bg-base-800/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-base-100 group-hover:text-accent-200">
                    {t(link.labelKey)}
                  </p>
                  {link.descriptionKey && (
                    <p className="mt-1 text-xs text-base-400 line-clamp-2">
                      {t(link.descriptionKey)}
                    </p>
                  )}
                </div>
                {link.badge && (
                  <span className="shrink-0 rounded-full border border-accent-500/30 bg-accent-500/10 px-2 py-0.5 text-xs font-semibold text-accent-300">
                    {link.badge}
                  </span>
                )}
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-base-600 transition group-hover:text-accent-400 group-hover:translate-x-1">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
