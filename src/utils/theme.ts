export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'radio-adamowo-theme';

const getSystemPreference = (): Theme => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  return 'dark';
};

export const readStoredTheme = (): Theme | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
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

export const applyTheme = (theme: Theme): void => {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.dataset.theme = theme;
};

export const initTheme = (): Theme => {
  const stored = readStoredTheme();
  const theme = stored ?? getSystemPreference();
  applyTheme(theme);
  return theme;
};

export const toggleTheme = (current: Theme): Theme =>
  current === 'dark' ? 'light' : 'dark';

export const THEME_STORAGE_KEY = STORAGE_KEY;
