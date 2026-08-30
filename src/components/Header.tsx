import clsx from 'clsx';
import { useMemo, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { LangSwitch } from './LangSwitch';
import { Search } from './Search';

/**
 * Navigation items configuration organized into thematic groups.
 *
 * Items are grouped by category to improve desktop navigation layout and reduce overflow.
 * The mobile navigation displays all items in a flat list.
 *
 * @constant
 */
const NAV_ITEMS = [
  { to: '/analiza', letter: 'A', label: 'Analizy' },
  { to: '/definicje', letter: 'D', label: 'Definicje' },
  { to: '/argumenty', letter: 'A', label: 'Argumenty' },
  { to: '/mechanizmy', letter: 'M', label: 'Mechanizmy' },
  { to: '/orzecznictwo', letter: 'O', label: 'Orzecznictwo' },
  { to: '/wykladnie', letter: 'W', label: 'Wykładnie' },
  { to: '/ochrona', letter: 'O', label: 'Ochrona' },
] as const;

/**
 * Main navigation header component with responsive menu and accessibility features.
 *
 * Provides a sticky navigation header with desktop branding, full desktop navigation and a
 * permanently visible ADAMOWO letter navigation on mobile. Search and language controls remain
 * available on every screen size.
 *
 * @component
 * @returns {JSX.Element} A responsive navigation header
 *
 * @example
 * ```tsx
 * <Header />
 * ```
 *
 * Features:
 * - Sticky positioning with backdrop blur
 * - Responsive design with full desktop names and compact mobile letters
 * - Seven always-visible mobile links spelling ADAMOWO
 * - Route prefetching on hover/focus for better performance
 * - Active route highlighting
 * - Search, language switcher, and theme switcher integration
 * - Smooth animations with reduced motion support
 * - Full ARIA support for screen readers
 * - Touch-optimized button targets for mobile devices
 */
export function Header(): JSX.Element {
  const { t } = useTranslation();
  const prefetchedRef = useRef(new Set<string>());

  const prefetchers = useMemo(
    () => ({
      '/analizy': () => import('../pages/Analyses'),
      '/taksonomia': () => import('../pages/ManipulationTaxonomy'),
      '/taxonomy': () => import('../pages/ManipulationTaxonomy'),
      '/programy': () => import('../pages/Programs'),
      '/studio': () => import('../pages/Studio'),
      '/shows': () => import('../pages/Shows'),
      '/guides': () => import('../pages/Guides'),
      '/anatomy': () => import('../pages/AnatomyPage'),
      '/lab': () => import('../pages/Lab'),
      '/community': () => import('../pages/Community'),
      '/media': () => import('../pages/MediaHub'),
      '/mapa-strony': () => import('../pages/SiteDirectory'),
      '/pomoc': () => import('../pages/Help'),
      '/help': () => import('../pages/Help'),
      '/analysis': () => import('../features/analysis-archive/AnalysisPage'),
      '/analiza': () => import('../features/knowledge-base/KnowledgeBase'),
      '/definicje': () => import('../features/knowledge-base/KnowledgeBase'),
      '/argumenty': () => import('../features/knowledge-base/KnowledgeBase'),
      '/mechanizmy': () => import('../features/knowledge-base/KnowledgeBase'),
      '/orzecznictwo': () => import('../features/knowledge-base/KnowledgeBase'),
      '/wykladnie': () => import('../features/knowledge-base/KnowledgeBase'),
      '/ochrona': () => import('../features/knowledge-base/KnowledgeBase'),
    }),
    []
  );

  /**
   * Renders a single navigation link with prefetching.
   */
  const renderNavLink = (item: (typeof NAV_ITEMS)[number]) => {
    const label = item.label;
    const suffix = label.startsWith(item.letter) ? label.slice(1) : label;

    return (
      <NavLink
        to={item.to}
        aria-label={label}
        className={({ isActive }) =>
          clsx(
            'group/link relative inline-flex touch-target items-center rounded-xl font-medium transition-all',
            'justify-center px-3 py-2 text-base-200 hover:bg-base-900/70 hover:text-base-50',
            isActive && 'bg-base-900 text-accent-200 ring-1 ring-accent-500/30'
          )
        }
        onFocus={() => {
          if (!prefetchedRef.current.has(item.to)) {
            prefetchedRef.current.add(item.to);
            void prefetchers[item.to]?.();
          }
        }}
        onMouseEnter={() => {
          if (!prefetchedRef.current.has(item.to)) {
            prefetchedRef.current.add(item.to);
            void prefetchers[item.to]?.();
          }
        }}
      >
        <span
          aria-hidden="true"
          className={clsx(
            'font-display font-bold text-accent-400 transition-transform group-hover/link:scale-110',
            'text-xl'
          )}
        >
          {item.letter}
        </span>
        <span className="text-sm transition-opacity group-hover/adamowo-nav:opacity-35 group-hover/link:!opacity-100">
          <span className="sr-only">{item.letter}</span>
          {suffix}
        </span>
      </NavLink>
    );
  };

  /**
   * Renders grouped desktop navigation with two rows to prevent overflow.
   */
  const renderDesktopNav = () => (
    <div className="group/adamowo-nav flex w-full items-center justify-center gap-1 lg:gap-3">
      {NAV_ITEMS.map((item) => (
        <div key={item.to}>{renderNavLink(item)}</div>
      ))}
    </div>
  );

  /**
   * Renders all seven top-level sections as a compact mobile wordmark.
   */
  const renderMobileNav = () => (
    <nav aria-label="Działy ADAMOWO" className="w-full lg:hidden">
      <div className="grid grid-cols-7 overflow-hidden rounded-xl border border-base-700 bg-base-900/80 shadow-sm">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            aria-label={item.label}
            title={item.label}
            className={({ isActive }) =>
              clsx(
                'inline-flex min-h-[7.5rem] flex-col items-center justify-start gap-1 border-r border-base-700 px-0.5 py-2 font-display text-accent-400 transition last:border-r-0 hover:bg-base-800 hover:text-accent-200 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-400',
                isActive && 'bg-accent-500 text-base-950 hover:bg-accent-400 hover:text-base-950'
              )
            }
            onFocus={() => {
              if (!prefetchedRef.current.has(item.to)) {
                prefetchedRef.current.add(item.to);
                void prefetchers[item.to]?.();
              }
            }}
          >
            <span data-nav-letter className="text-xl font-bold leading-none" aria-hidden="true">
              {item.letter}
            </span>
            <span
              data-nav-suffix
              aria-hidden="true"
              className="flex flex-col items-center font-sans text-[0.55rem] font-semibold uppercase leading-[0.62rem] tracking-normal"
            >
              {item.label
                .slice(item.letter.length)
                .split('')
                .map((character, index) => (
                  <span key={`${item.to}-${character}-${index}`}>{character}</span>
                ))}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );

  return (
    <header
      role="navigation"
      aria-label={t('header.navigation')}
      className="sticky top-0 z-40 border-b border-base-800/70 bg-base-950/80 text-base-50 shadow-[0_1px_0_rgba(12,17,37,0.8)] backdrop-blur supports-[backdrop-filter]:bg-base-950/60"
    >
      <div className="container-responsive flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4 lg:py-4">
        <NavLink
          to="/"
          className="group hidden items-center gap-3 lg:flex"
          aria-label={t('header.home')}
        >
          <span className="rounded bg-base-900/70 p-2 transition-colors duration-150 group-hover:bg-base-850 group-focus-visible:bg-base-850">
            <img
              src="/assets/images/ui/logo-header.png"
              alt="Adamowo.com"
              className="h-10 w-10 shrink-0 rounded-full object-cover sm:h-11 sm:w-11"
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />
          </span>
        </NavLink>

        {renderMobileNav()}

        <div className="flex w-full items-center justify-end gap-1.5 sm:gap-2 md:gap-3 lg:w-auto">
          <Search />
          <LangSwitch />
        </div>
      </div>

      <nav
        aria-label={t('header.navigation')}
        className="container-responsive hidden border-t border-base-800/60 py-1.5 lg:flex"
      >
        {renderDesktopNav()}
      </nav>
    </header>
  );
}
