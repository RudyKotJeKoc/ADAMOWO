import clsx from 'clsx';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { LangSwitch } from './LangSwitch';
import { LogoGlasses } from './LogoGlasses';
import { Search } from './Search';
import { ThemeSwitch } from './ThemeSwitch';

/**
 * Navigation items configuration organized into thematic groups.
 *
 * Items are grouped by category to improve desktop navigation layout and reduce overflow.
 * The mobile navigation displays all items in a flat list.
 *
 * @constant
 */
const NAV_GROUPS = {
  education: [
    { to: '/analizy', labelKey: 'navigation.analizy' },
    { to: '/taksonomia', labelKey: 'navigation.taxonomy' },
    { to: '/case-study', labelKey: 'navigation.caseStudy' },
    { to: '/anatomy', labelKey: 'navigation.anatomy' },
  ],
  tools: [
    { to: '/guides', labelKey: 'navigation.guide' },
    { to: '/lab', labelKey: 'navigation.lab' },
    { to: '/polana-klamstw', labelKey: 'navigation.polanaKlamstw' },
  ],
  content: [
    { to: '/programy', labelKey: 'navigation.programy' },
    { to: '/teatr-absurdu', labelKey: 'navigation.teatr' },
    { to: '/media', labelKey: 'navigation.media' },
  ],
  info: [
    { to: '/community', labelKey: 'navigation.community' },
    { to: '/pomoc', labelKey: 'navigation.help' },
    { to: '/mapa-strony', labelKey: 'navigation.sitemap' },
  ],
};

/**
 * Flat list of all navigation items for mobile menu.
 */
const NAV_ITEMS = Object.values(NAV_GROUPS).flat();

/**
 * Main navigation header component with responsive menu and accessibility features.
 *
 * Provides a sticky navigation header with logo, desktop navigation menu, mobile hamburger
 * menu, search functionality, language switcher, and theme switcher. Implements advanced
 * accessibility features including focus trapping, keyboard navigation, and route prefetching
 * for improved performance.
 *
 * @component
 * @returns {JSX.Element} A responsive navigation header with mobile menu support
 *
 * @example
 * ```tsx
 * <Header />
 * ```
 *
 * Features:
 * - Sticky positioning with backdrop blur
 * - Responsive design with separate desktop and mobile menus
 * - Mobile hamburger menu with animated icon
 * - Focus trap within mobile menu when open
 * - Keyboard navigation (Tab, Shift+Tab, Escape)
 * - Route prefetching on hover/focus for better performance
 * - Active route highlighting
 * - Search, language switcher, and theme switcher integration
 * - Smooth animations with reduced motion support
 * - Full ARIA support for screen readers
 * - Touch-optimized button targets for mobile devices
 */
export function Header(): JSX.Element {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const reduceMotion = useReducedMotion();
  const prefetchedRef = useRef(new Set<string>());

  const prefetchers = useMemo(
    () => ({
      '/analizy': () => import('../pages/Analyses'),
      '/taksonomia': () => import('../pages/ManipulationTaxonomy'),
      '/taxonomy': () => import('../pages/ManipulationTaxonomy'),
      '/case-study': () => import('../pages/CaseStudyReport'),
      '/casestudy': () => import('../pages/CaseStudyReport'),
      '/studium-przypadku': () => import('../pages/CaseStudyReport'),
      '/programy': () => import('../pages/Programs'),
      '/studio': () => import('../pages/Studio'),
      '/shows': () => import('../pages/Shows'),
      '/guides': () => import('../pages/Guides'),
      '/anatomy': () => import('../pages/AnatomyPage'),
      '/lab': () => import('../pages/Lab'),
      '/community': () => import('../pages/Community'),
      '/media': () => import('../pages/MediaHub'),
      '/mapa-strony': () => import('../pages/Sitemap'),
      '/pomoc': () => import('../pages/Help'),
      '/help': () => import('../pages/Help'),
      '/analysis': () => import('../features/analysis-archive/AnalysisPage'),
      '/teatr-absurdu': () => import('../pages/TeatrAbsurdu'),
      '/teatr-absurdu/spektakl': () => import('../features/teatr-absurdu/SpektaklPage'),
      '/teatr-absurdu/analiza': () => import('../features/teatr-absurdu/AnalizaPage'),
    }),
    []
  );

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }
    const panel = panelRef.current;
    if (!panel) {
      return;
    }
    const focusable = panel.querySelectorAll<HTMLElement>(
      "a[href],button:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex='-1'])"
    );
    const first = focusable[0] ?? null;
    const last = focusable[focusable.length - 1] ?? null;
    first?.focus();
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
        return;
      }
      if (event.key === 'Tab' && focusable.length > 0) {
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          (last ?? first)?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeMenu, menuOpen]);

  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);

  /**
   * Renders a single navigation link with prefetching.
   */
  const renderNavLink = (item: { to: string; labelKey: string }, variant: 'desktop' | 'mobile') => (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        clsx(
          'relative inline-flex touch-target items-center justify-center rounded-full px-3 py-2 text-sm font-medium transition-colors',
          variant === 'desktop'
            ? 'text-base-200 hover:text-base-50'
            : 'text-base-50 hover:text-accent-300',
          isActive && (variant === 'desktop' ? 'text-accent-300' : 'text-accent-200')
        )
      }
      onClick={variant === 'mobile' ? closeMenu : undefined}
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
      <span>{t(item.labelKey)}</span>
    </NavLink>
  );

  /**
   * Renders grouped desktop navigation with two rows to prevent overflow.
   */
  const renderDesktopNav = () => (
    <div className="flex w-full max-w-5xl flex-col gap-2">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        {NAV_GROUPS.education.map((item) => (
          <div key={item.to}>{renderNavLink(item, 'desktop')}</div>
        ))}
        {NAV_GROUPS.tools.map((item) => (
          <div key={item.to}>{renderNavLink(item, 'desktop')}</div>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        {NAV_GROUPS.content.map((item) => (
          <div key={item.to}>{renderNavLink(item, 'desktop')}</div>
        ))}
        {NAV_GROUPS.info.map((item) => (
          <div key={item.to}>{renderNavLink(item, 'desktop')}</div>
        ))}
      </div>
    </div>
  );

  /**
   * Renders mobile navigation as a flat vertical list.
   */
  const renderMobileNav = () => (
    <ul className="flex flex-col gap-4">
      {NAV_ITEMS.map((item) => (
        <li key={item.to}>{renderNavLink(item, 'mobile')}</li>
      ))}
    </ul>
  );

  const mobileMenuLabel = menuOpen ? t('header.closeMenu') : t('header.openMenu');

  return (
    <header
      role="navigation"
      aria-label={t('header.navigation')}
      className="sticky top-0 z-40 border-b border-base-800/70 bg-base-950/80 text-base-50 shadow-[0_1px_0_rgba(12,17,37,0.8)] backdrop-blur supports-[backdrop-filter]:bg-base-950/60"
    >
      <div className="container-responsive flex items-center justify-between gap-4 py-4">
        <NavLink to="/" className="group flex items-center gap-3" aria-label={t('header.home')}>
          <span className="rounded bg-base-900/70 p-2 transition-colors duration-150 group-hover:bg-base-850 group-focus-visible:bg-base-850">
            <LogoGlasses className="h-9 w-auto" />
          </span>
          <span className="font-display text-base font-semibold uppercase tracking-wide text-base-100">
            Radio Adamowo
          </span>
        </NavLink>

        <nav
          id={menuId}
          aria-label={t('header.navigation')}
          className="hidden flex-1 items-center justify-center md:flex"
        >
          {renderDesktopNav()}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
          <Search />
          <LangSwitch />
          <ThemeSwitch />
          <button
            type="button"
            className="touch-target inline-flex h-11 w-11 items-center justify-center rounded-full border border-base-700 bg-base-900/80 text-base-100 transition hover:border-accent-500 hover:text-accent-200 md:hidden"
            aria-controls={menuId}
            aria-expanded={menuOpen}
            onClick={toggleMenu}
            aria-label={mobileMenuLabel}
          >
            <span className="sr-only">{mobileMenuLabel}</span>
            <motion.span
              className="flex flex-col items-center justify-center gap-1.5"
              animate={reduceMotion ? undefined : { rotate: menuOpen ? 90 : 0 }}
              transition={
                reduceMotion ? undefined : { type: 'spring', stiffness: 260, damping: 28 }
              }
            >
              <span
                className={clsx(
                  'block h-0.5 w-6 rounded-full bg-current transition-transform',
                  menuOpen ? 'translate-y-1 rotate-45' : ''
                )}
              />
              <span
                className={clsx(
                  'block h-0.5 w-6 rounded-full bg-current transition-opacity',
                  menuOpen ? 'opacity-0' : 'opacity-100'
                )}
              />
              <span
                className={clsx(
                  'block h-0.5 w-6 rounded-full bg-current transition-transform',
                  menuOpen ? '-translate-y-1 -rotate-45' : ''
                )}
              />
            </motion.span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.18 }}
          >
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={t('header.navigation')}
              className="space-y-6 border-t border-base-800 bg-base-900/95 px-4 pb-8 pt-6 text-base-100 shadow-lg backdrop-blur-sm"
              initial={reduceMotion ? { opacity: 1 } : { y: -12, opacity: 0 }}
              animate={reduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { y: -12, opacity: 0 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.2 }}
            >
              {renderMobileNav()}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
