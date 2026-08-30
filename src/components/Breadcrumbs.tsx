import { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid';

import { knowledgeBySlug } from '../features/knowledge-base/knowledge.data';

interface BreadcrumbItem {
  label: string;
  path: string;
}

// Map routes to their display names
const routeLabels: Record<string, string> = {
  'violence-loop': 'navigation.violenceLoop',
  studio: 'navigation.studio',
  shows: 'navigation.shows',
  guides: 'navigation.guide',
  anatomy: 'navigation.anatomy',
  lab: 'navigation.lab',
  community: 'navigation.community',
  analysis: 'breadcrumbs.analysis',
  privacy: 'breadcrumbs.privacy',
  methodology: 'breadcrumbs.methodology',
  'ai-policy': 'breadcrumbs.aiPolicy',
};

const knowledgeRouteLabels: Record<string, string> = {
  analiza: 'Analizy',
  definicje: 'Definicje',
  argumenty: 'Argumenty',
  mechanizmy: 'Mechanizmy',
  orzecznictwo: 'Orzecznictwo',
  wykladnie: 'Wykładnie',
  ochrona: 'Ochrona',
};

export function Breadcrumbs(): JSX.Element | null {
  const location = useLocation();
  const { t } = useTranslation();

  // Don't show breadcrumbs on home page
  if (location.pathname === '/') {
    return null;
  }

  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Build breadcrumb trail
  const breadcrumbs: BreadcrumbItem[] = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    const knowledgeEntry = knowledgeBySlug.get(segment);
    const labelKey = routeLabels[segment] || segment;

    return {
      label:
        knowledgeEntry?.shortTitle ??
        knowledgeRouteLabels[segment] ??
        t(labelKey, { defaultValue: segment.charAt(0).toUpperCase() + segment.slice(1) }),
      path,
    };
  });

  return (
    <nav aria-label={t('breadcrumbs.label')} className="container-responsive py-4">
      <ol className="flex items-center gap-2 text-sm">
        <li>
          <Link
            to="/"
            className="group inline-flex items-center gap-1 text-base-400 transition hover:text-accent-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:rounded"
            aria-label={t('breadcrumbs.home')}
          >
            <HomeIcon className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">{t('breadcrumbs.home')}</span>
          </Link>
        </li>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <Fragment key={crumb.path}>
              <li aria-hidden="true">
                <ChevronRightIcon className="h-4 w-4 text-base-600" />
              </li>
              <li>
                {isLast ? (
                  <span className="font-medium text-base-100" aria-current="page">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.path}
                    className="text-base-400 transition hover:text-accent-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:rounded"
                  >
                    {crumb.label}
                  </Link>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
