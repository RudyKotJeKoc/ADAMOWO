/**
 * Theme preference type.
 *
 * - 'light': Light theme
 * - 'dark': Dark theme
 * - 'system': Follow system preference
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * Resolved theme type (after system preference is evaluated).
 *
 * - 'light': Light theme
 * - 'dark': Dark theme
 */
export type ResolvedTheme = 'light' | 'dark';

/**
 * LocalStorage key for theme persistence.
 *
 * @internal
 */
const STORAGE_KEY = 'radio-adamowo-theme';

/**
 * Media query for detecting dark mode preference.
 *
 * @internal
 */
const MEDIA_QUERY = '(prefers-color-scheme: dark)';

/**
 * Gets the system's preferred color scheme.
 * Defaults to 'dark' if window.matchMedia is not available.
 *
 * @returns System's preferred theme ('dark' or 'light')
 *
 * @internal
 */
const getSystemPreference = (): ResolvedTheme => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia(MEDIA_QUERY).matches ? 'dark' : 'light';
  }

  return 'dark';
};

/**
 * Reads the stored theme preference from localStorage.
 * Returns null if no theme is stored or if localStorage is unavailable.
 *
 * @returns Stored theme preference, or null if not found
 *
 * @example
 * ```typescript
 * const theme = readStoredTheme();
 * if (theme) {
 *   console.log(`User prefers ${theme} theme`);
 * }
 * ```
 */
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

/**
 * Persists the theme preference to localStorage.
 * Silently fails if localStorage is unavailable.
 *
 * @param theme - Theme preference to save
 *
 * @example
 * ```typescript
 * persistTheme('dark');
 * ```
 */
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

/**
 * Resolves a theme to its concrete value.
 * If theme is 'system', returns the system preference.
 *
 * @param theme - Theme to resolve
 * @returns Resolved theme ('light' or 'dark')
 *
 * @example
 * ```typescript
 * resolveTheme('system'); // Returns 'dark' if system prefers dark mode
 * resolveTheme('light');  // Returns 'light'
 * ```
 */
export const resolveTheme = (theme: Theme): ResolvedTheme =>
  theme === 'system' ? getSystemPreference() : theme;

/**
 * Applies the theme to the document by setting CSS classes and data attributes.
 * Updates document.documentElement with:
 * - 'dark' class (if dark theme)
 * - data-theme attribute (original theme value)
 * - data-theme-resolved attribute (resolved theme value)
 *
 * @param theme - Theme to apply
 *
 * @example
 * ```typescript
 * applyTheme('dark');   // Adds 'dark' class to <html>
 * applyTheme('system'); // Adds 'dark' class if system prefers dark mode
 * ```
 */
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

/**
 * Initializes the theme on page load.
 * Reads stored theme or defaults to 'system', then applies it.
 *
 * @returns The initialized theme value
 *
 * @example
 * ```typescript
 * // In app initialization:
 * const theme = initTheme();
 * console.log(`Theme initialized to: ${theme}`);
 * ```
 */
export const initTheme = (): Theme => {
  const stored = readStoredTheme();
  const theme = stored ?? 'system';
  applyTheme(theme);
  return theme;
};

/**
 * Toggles to the next theme in the cycle: system → light → dark → system.
 *
 * @param current - Current theme value
 * @returns Next theme in the cycle
 *
 * @example
 * ```typescript
 * let theme = 'system';
 * theme = toggleTheme(theme); // Returns 'light'
 * theme = toggleTheme(theme); // Returns 'dark'
 * theme = toggleTheme(theme); // Returns 'system'
 * ```
 */
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

/**
 * Exported storage key for theme persistence.
 * Same value as internal STORAGE_KEY constant.
 */
export const THEME_STORAGE_KEY = STORAGE_KEY;

/**
 * Callback function type for system theme change events.
 *
 * @param theme - New resolved theme value
 *
 * @internal
 */
type ThemeChangeHandler = (theme: ResolvedTheme) => void;

/**
 * Subscribes to system theme changes using the prefers-color-scheme media query.
 * Returns an unsubscribe function to stop listening.
 *
 * @param handler - Callback function to invoke when system theme changes
 * @returns Unsubscribe function to stop listening
 *
 * @example
 * ```typescript
 * const unsubscribe = subscribeToSystemTheme((newTheme) => {
 *   console.log(`System theme changed to: ${newTheme}`);
 *   if (currentTheme === 'system') {
 *     applyTheme('system');
 *   }
 * });
 *
 * // Later, to stop listening:
 * unsubscribe();
 * ```
 */
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
