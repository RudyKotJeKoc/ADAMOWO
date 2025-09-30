export type Theme = 'light' | 'dark' | 'system';

export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'radio-adamowo-theme';
const MEDIA_QUERY = '(prefers-color-scheme: dark)';

const getSystemPreference = (): ResolvedTheme => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia(MEDIA_QUERY).matches ? 'dark' : 'light';
  }

  return 'dark';
};

export const readStoredTheme = (): Theme | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
  } catch (error) {
    console.warn('Unable to read theme from storage', error);
  }

  return null;
};

export const persistTheme = (theme: Theme): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch (error) {
    console.warn('Unable to persist theme selection', error);
  }
};

export const resolveTheme = (theme: Theme): ResolvedTheme =>
  theme === 'system' ? getSystemPreference() : theme;

export const applyTheme = (theme: Theme): void => {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;
  const resolved = resolveTheme(theme);
  root.classList.toggle('dark', resolved === 'dark');
  root.dataset.theme = theme;
  root.dataset.themeResolved = resolved;
};

export const initTheme = (): Theme => {
  const stored = readStoredTheme();
  const theme = stored ?? 'system';
  applyTheme(theme);
  return theme;
};

export const toggleTheme = (current: Theme): Theme => {
  switch (current) {
    case 'system':
      return 'light';
    case 'light':
      return 'dark';
    default:
      return 'system';
  }
};

export const THEME_STORAGE_KEY = STORAGE_KEY;

type ThemeChangeHandler = (theme: ResolvedTheme) => void;

export const subscribeToSystemTheme = (handler: ThemeChangeHandler): (() => void) => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => {};
  }

  const media = window.matchMedia(MEDIA_QUERY);
  const listener = (event: MediaQueryListEvent): void => {
    handler(event.matches ? 'dark' : 'light');
  };

  if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }

  media.addListener(listener);
  return () => media.removeListener(listener);
};
