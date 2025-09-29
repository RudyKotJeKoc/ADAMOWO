import { useTranslation } from 'react-i18next';

import { useTheme } from '../state/theme';

export function ThemeSwitch(): JSX.Element {
  const { theme, toggle } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-full border border-base-700 bg-base-900 px-4 py-2 text-sm font-medium text-base-50 transition hover:border-accent-400 hover:text-accent-300 focus-visible:shadow-focus"
      aria-pressed={isDark}
      aria-label={isDark ? t('controls.theme.dark') : t('controls.theme.light')}
    >
      <span aria-hidden="true" className="text-lg" role="img">
        {isDark ? '🌙' : '🌞'}
      </span>
      <span className="sr-only sm:not-sr-only">
        {isDark ? t('controls.theme.dark') : t('controls.theme.light')}
      </span>
    </button>
  );
}
