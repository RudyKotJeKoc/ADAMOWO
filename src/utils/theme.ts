/**
 * Represents the theme preference options available to the user.
 * - 'light': Forces light theme
 * - 'dark': Forces dark theme
 * - 'system': Follows system preference (default)
 *
 * @typedef {'light' | 'dark' | 'system'} Theme
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * Represents a resolved theme value that is either light or dark.
 * This is computed from a Theme value when the theme is 'system',
 * by checking the system preference. For explicit 'light' or 'dark'
 * themes, the resolved value is the same as the input.
 *
 * @typedef {'light' | 'dark'} ResolvedTheme
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
 * Detects the system's color scheme preference.
 * Checks the user's OS-level theme preference using the CSS media query 'prefers-color-scheme'.
 * Returns 'dark' if dark mode is preferred, otherwise 'light'.
 * In server-side rendering environments where window is undefined, defaults to 'dark'.
 *
 * @private
 * @returns {ResolvedTheme} Either 'light' or 'dark' based on system preference
 *
 * @example
 * const systemTheme = getSystemPreference();
 * // Returns 'dark' if user has dark mode enabled in their OS settings
 */
const getSystemPreference = (): ResolvedTheme => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia(MEDIA_QUERY).matches ? 'dark' : 'light';
  }

  return 'dark';
};

/**
 * Attempts to read the user's stored theme preference from localStorage.
 * Only available in browser environments. Returns null if no valid theme is stored,
 * if an error occurs while accessing localStorage, or in SSR contexts.
 *
 * @returns {Theme | null} The stored theme ('light', 'dark', or 'system'), or null if not found or invalid
 * @throws Does not throw - errors are caught and logged as warnings
 *
 * @example
 * const storedTheme = readStoredTheme();
 * if (storedTheme) {
 *   applyTheme(storedTheme);
 * } else {
 *   applyTheme('system'); // Use system preference as fallback
 * }
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
 * Persists the user's theme preference to localStorage.
 * Only available in browser environments. Silently handles errors that may occur
 * due to storage quota exceeded or private browsing mode restrictions.
 *
 * @param {Theme} theme - The theme preference to store ('light', 'dark', or 'system')
 * @returns {void}
 * @throws Does not throw - errors are caught and logged as warnings
 *
 * @example
 * persistTheme('dark'); // Saves user's dark mode preference
 * persistTheme('system'); // Saves user's preference to follow system theme
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
 * Resolves a theme preference to a concrete value.
 * If the theme is 'system', returns the current system color scheme preference.
 * For 'light' or 'dark', returns the value as-is.
 *
 * @param {Theme} theme - The theme preference to resolve
 * @returns {ResolvedTheme} Either 'light' or 'dark'
 *
 * @example
 * resolveTheme('light'); // Returns 'light'
 * resolveTheme('system'); // Returns 'dark' or 'light' depending on OS preference
 * resolveTheme('dark'); // Returns 'dark'
 */
export const resolveTheme = (theme: Theme): ResolvedTheme =>
  theme === 'system' ? getSystemPreference() : theme;

/**
 * Applies a theme to the DOM by updating the document root element.
 * Sets CSS classes, data attributes for styling and script queries.
 * Safe for server-side rendering - silently no-ops if document is undefined.
 *
 * This function:
 * - Toggles the 'dark' CSS class based on the resolved theme
 * - Sets data-theme attribute to the user's preference ('light', 'dark', or 'system')
 * - Sets data-theme-resolved attribute to the concrete theme ('light' or 'dark')
 *
 * @param {Theme} theme - The theme preference to apply
 * @returns {void}
 *
 * @example
 * applyTheme('dark'); // Applies dark theme and sets attributes
 * // Results in: <html class="dark" data-theme="dark" data-theme-resolved="dark">
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
 * Initializes the application theme on page load.
 * Reads the stored theme preference and applies it to the DOM.
 * If no stored preference exists, defaults to 'system' theme.
 *
 * This should be called early in the application lifecycle, ideally in a
 * synchronous script before the page renders to prevent theme flash.
 *
 * @returns {Theme} The theme that was initialized and applied
 *
 * @example
 * // In main.tsx or script tag in HTML head
 * const theme = initTheme();
 * console.log('Theme initialized:', theme); // 'system', 'light', or 'dark'
 */
export const initTheme = (): Theme => {
  const stored = readStoredTheme();
  const theme = stored ?? 'system';
  applyTheme(theme);
  return theme;
};

/**
 * Cycles to the next theme in the theme rotation.
 * Follows the cycle: 'system' → 'light' → 'dark' → 'system' → ...
 *
 * Useful for theme toggle buttons or cycling through theme options.
 * The caller is responsible for persisting the returned theme value if needed.
 *
 * @param {Theme} current - The current theme preference
 * @returns {Theme} The next theme in the cycle
 *
 * @example
 * let currentTheme = 'system';
 * currentTheme = toggleTheme(currentTheme); // Returns 'light'
 * currentTheme = toggleTheme(currentTheme); // Returns 'dark'
 * currentTheme = toggleTheme(currentTheme); // Returns 'system'
 *
 * // In a theme toggle button:
 * const newTheme = toggleTheme(currentTheme);
 * setTheme(newTheme);
 * persistTheme(newTheme);
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
 * The key used to store theme preferences in localStorage.
 * Value: 'radio-adamowo-theme'
 *
 * @type {string}
 * @constant
 */
export const THEME_STORAGE_KEY = STORAGE_KEY;

/**
 * Callback function type for system theme preference change events.
 * Called when the system's color scheme preference changes (e.g., user switches
 * between light and dark mode in their OS settings) while the app theme is set to 'system'.
 *
 * @typedef {Function} ThemeChangeHandler
 * @param {ResolvedTheme} theme - The new resolved theme ('light' or 'dark')
 * @returns {void}
 *
 * @example
 * const handleThemeChange: ThemeChangeHandler = (theme) => {
 *   console.log('System theme changed to:', theme);
 *   updateUI(theme);
 * };
 */
type ThemeChangeHandler = (theme: ResolvedTheme) => void;

/**
 * Subscribes to changes in the system's color scheme preference.
 * Listens for OS-level theme changes (e.g., user switches dark mode on/off)
 * and calls the handler when changes occur.
 *
 * Uses the 'prefers-color-scheme' media query with fallback support for
 * older browsers. In environments without window or matchMedia support,
 * returns a no-op cleanup function.
 *
 * @param {ThemeChangeHandler} handler - Callback to invoke when system theme changes
 * @returns {() => void} Cleanup function to unsubscribe from theme changes
 *
 * @example
 * const unsubscribe = subscribeToSystemTheme((theme) => {
 *   console.log('System changed to:', theme);
 *   applyTheme('system'); // Re-apply if using system theme
 * });
 *
 * // Later, when component unmounts:
 * unsubscribe();
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
