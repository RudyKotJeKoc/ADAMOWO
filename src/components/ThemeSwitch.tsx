import clsx from 'clsx';
import { LayoutGroup, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../state/theme';
import type { Theme } from '../utils/theme';

/**
 * Order of theme options in the theme switcher.
 *
 * @internal
 */
const THEME_ORDER: Theme[] = ['system', 'light', 'dark'];

/**
 * Icon mapping for each theme option.
 *
 * @internal
 */
const THEME_ICONS: Record<Theme, string> = { system: '🖥️', light: '🌞', dark: '🌙' };

/**
 * Theme switcher toggle component.
 *
 * Renders a segmented control allowing users to switch between system,
 * light, and dark themes. Features:
 * - Three theme options: system (auto), light, and dark
 * - Animated indicator showing active selection
 * - Icons and labels for each theme
 * - Screen reader accessible with proper ARIA attributes
 * - Shows resolved theme for system option (e.g., "System (Dark)")
 * - Smooth transitions with Framer Motion layout animations
 *
 * The component uses LayoutGroup for shared layout animations between
 * theme options, creating a smooth sliding indicator effect.
 *
 * @returns A theme switcher control with three segmented buttons
 */
export function ThemeSwitch(): JSX.Element {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { t } = useTranslation();
  const resolvedLabel = resolvedTheme === 'dark' ? t('controls.theme.resolved_dark') : t('controls.theme.resolved_light');
  return (
    <div className="relative" role="group" aria-label={t('controls.theme.label')}>
      <LayoutGroup>
        <div className="relative flex items-center gap-1 rounded-full border border-base-700 bg-base-900/80 px-1 py-1 text-xs font-medium text-base-200 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-base-900/70">
          {THEME_ORDER.map((value) => {
            const isActive = theme === value;
            const label = t(`controls.theme.${value}`);
            const shortLabel = t(`controls.theme.${value}Short`);

            return (
              <button
                key={value}
                type="button"
                className={clsx(
                  'relative inline-flex min-w-[3.25rem] items-center justify-center gap-1 rounded-full px-3 py-1.5 transition focus-visible:shadow-focus',
                  isActive ? 'text-base-950' : 'text-base-200 hover:text-base-50'
                )}
                aria-pressed={isActive}
                onClick={() => setTheme(value)}
                title={label}
              >
                {isActive ? (
                  <motion.span
                    layoutId="theme-switch-indicator"
                    className="absolute inset-0 -z-10 rounded-full bg-accent-500 shadow-[0_8px_20px_-15px_rgba(255,107,53,0.8)]"
                    transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                  />
                ) : null}
                <span aria-hidden="true" className="text-sm">{THEME_ICONS[value]}</span>
                <span className="hidden text-[0.7rem] uppercase tracking-wide sm:inline">{shortLabel}</span>
                <span className="sr-only">{label}</span>
                {value === 'system' ? (
                  <span className="sr-only"> {t('controls.theme.current', { value: theme === 'system' ? resolvedLabel : label })}</span>
                ) : null}
              </button>
            );
          })}
        </div>
      </LayoutGroup>
    </div>
  );
}
