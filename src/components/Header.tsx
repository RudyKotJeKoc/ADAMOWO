import clsx from 'clsx';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { LangSwitch } from './LangSwitch';
import { LogoGlasses } from './LogoGlasses';
import { ThemeSwitch } from './ThemeSwitch';
const NAV_ITEMS: Array<{ to: string; labelKey: string }> = [
  { to: '/live', labelKey: 'navigation.live' },
  { to: '/violence-loop', labelKey: 'navigation.violenceLoop' },
  { to: '/shows', labelKey: 'navigation.shows' },
  { to: '/guides', labelKey: 'navigation.guide' },
  { to: '/lab', labelKey: 'navigation.lab' },
  { to: '/community', labelKey: 'navigation.community' }
];
export function Header(): JSX.Element {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const reduceMotion = useReducedMotion();
  const prefetchedRef = useRef(new Set<string>());

  const prefetchers = useMemo(
    () => ({
      '/live': () => import('../pages/Live'),
      '/violence-loop': () => import('../pages/ViolenceLoop'),
      '/shows': () => import('../pages/Shows'),
      '/guides': () => import('../pages/Guides'),
      '/lab': () => import('../pages/Lab'),
      '/community': () => import('../pages/Community'),
      '/analysis': () => import('../features/analysis-archive/AnalysisPage')
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

  const renderNavLinks = (variant: 'desktop' | 'mobile') => (
      <ul
        className={clsx('flex flex-col gap-4', {
          'md:flex-row md:items-center md:gap-6': variant === 'desktop'
        })}
      >
        {NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  'relative inline-flex touch-target items-center justify-center rounded-full px-3 py-2 text-base font-medium transition-colors',
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
          </li>
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
          <motion.span
            className="rounded-full bg-base-900/70 p-2 transition group-hover:bg-base-850 group-focus-visible:bg-base-850"
            whileHover={reduceMotion ? undefined : { scale: 1.02 }}
            whileFocus={reduceMotion ? undefined : { scale: 1.02 }}
          >
            <LogoGlasses className="h-9 w-auto" />
          </motion.span>
          <span className="font-display text-lg font-semibold tracking-wide text-base-100">
            Radio Adamowo
          </span>
        </NavLink>

        <nav id={menuId} aria-label={t('header.navigation')} className="hidden flex-1 items-center justify-center md:flex">
          <div className="flex items-center justify-center gap-6">
            {renderNavLinks('desktop')}
          </div>
        </nav>

        <div className="flex items-center gap-3">
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
              transition={reduceMotion ? undefined : { type: 'spring', stiffness: 260, damping: 28 }}
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
              className="space-y-6 border-t border-base-800 bg-base-900/95 px-4 pb-8 pt-6 text-base-100 shadow-lg"
              initial={reduceMotion ? { opacity: 1 } : { y: -12, opacity: 0 }}
              animate={reduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { y: -12, opacity: 0 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.2 }}
            >
              {renderNavLinks('mobile')}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
