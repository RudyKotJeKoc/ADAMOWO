import clsx from 'clsx';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
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
  { to: '/analiza', letter: 'A', labelKey: 'navigation.analiza' },
  { to: '/debaty', letter: 'D', labelKey: 'navigation.debaty' },
  { to: '/argumenty', letter: 'A', labelKey: 'navigation.argumenty' },
  { to: '/materialy', letter: 'M', labelKey: 'navigation.materialy' },
  { to: '/orzeczenia', letter: 'O', labelKey: 'navigation.orzeczenia' },
  { to: '/wykladnie', letter: 'W', labelKey: 'navigation.wykladnie' },
  { to: '/opinie', letter: 'O', labelKey: 'navigation.opinie' },
] as const;

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
      '/analiza': () => import('../pages/AdamowoSection'),
      '/debaty': () => import('../pages/AdamowoSection'),
      '/argumenty': () => import('../pages/AdamowoSection'),
      '/materialy': () => import('../pages/AdamowoSection'),
      '/orzeczenia': () => import('../pages/AdamowoSection'),
      '/wykladnie': () => import('../pages/AdamowoSection'),
      '/opinie': () => import('../pages/AdamowoSection'),
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
  const renderNavLink = (item: (typeof NAV_ITEMS)[number], variant: 'desktop' | 'mobile') => {
    const label = t(item.labelKey);
    const suffix = label.startsWith(item.letter) ? label.slice(1) : label;

    return (
      <NavLink
        to={item.to}
        aria-label={label}
        className={({ isActive }) =>
          clsx(
            'group/link relative inline-flex touch-target items-center rounded-xl font-medium transition-all',
            variant === 'desktop'
              ? 'justify-center px-3 py-2 text-base-200 hover:bg-base-900/70 hover:text-base-50'
              : 'w-full gap-3 px-3 py-2 text-base-50 hover:bg-base-800 hover:text-accent-200',
            isActive && 'bg-base-900 text-accent-200 ring-1 ring-accent-500/30'
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
        <span
          aria-hidden="true"
          className={clsx(
            'font-display font-bold text-accent-400 transition-transform group-hover/link:scale-110',
            variant === 'desktop' ? 'text-xl' : 'w-8 text-center text-2xl'
          )}
        >
          {item.letter}
        </span>
        <span
          className={clsx(
            'transition-opacity',
            variant === 'desktop' &&
              'text-sm group-hover/adamowo-nav:opacity-35 group-hover/link:!opacity-100'
          )}
        >
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
        <div key={item.to}>{renderNavLink(item, 'desktop')}</div>
      ))}
    </div>
  );

  /**
   * Renders mobile navigation as a flat vertical list.
   */
  const renderMobileNav = () => (
    <ul className="grid gap-2 sm:grid-cols-2">
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

        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
          <Search />
          <LangSwitch />
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

      <nav
        id={menuId}
        aria-label={t('header.navigation')}
        className="container-responsive hidden border-t border-base-800/60 py-1.5 md:flex"
      >
        {renderDesktopNav()}
      </nav>

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
