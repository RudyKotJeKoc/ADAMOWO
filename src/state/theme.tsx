/**
 * Theme State Management
 *
 * React Context and Provider for managing application theme (light/dark/system).
 * Provides theme state, theme resolution, and synchronization with system preferences.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';

import {
  applyTheme,
  persistTheme,
  resolveTheme,
  subscribeToSystemTheme,
  toggleTheme,
  type ResolvedTheme,
  type Theme
} from '../utils/theme';

/**
 * Theme context value interface containing theme state and actions.
 * @interface ThemeContextValue
 * @property {Theme} theme - Current theme setting ('light', 'dark', or 'system')
 * @property {ResolvedTheme} resolvedTheme - Resolved theme ('light' or 'dark')
 * @property {function(Theme): void} setTheme - Sets the theme
 * @property {function(): void} toggle - Toggles between light and dark themes
 */
interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}

/**
 * React context for theme state.
 * @private
 */
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Props for ThemeProvider component.
 * @interface ThemeProviderProps
 * @property {Theme} initialTheme - Initial theme to use on mount
 * @property {ReactNode} children - Child components to wrap
 */
interface ThemeProviderProps {
  initialTheme: Theme;
  children: ReactNode;
}

/**
 * Theme provider component that manages theme state and provides it to child components.
 * Handles theme persistence, system theme synchronization, and theme application.
 * @component
 * @param {ThemeProviderProps} props - Component props
 * @param {Theme} props.initialTheme - Initial theme setting
 * @param {ReactNode} props.children - Child components
 * @returns {JSX.Element} Theme provider wrapper
 * @example
 * <ThemeProvider initialTheme="system">
 *   <App />
 * </ThemeProvider>
 */
export function ThemeProvider({ children, initialTheme }: ThemeProviderProps): JSX.Element {
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolveTheme(initialTheme));

  /**
   * Sets the theme and persists it to localStorage.
   * @param {Theme} next - Theme to set
   */
  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    applyTheme(next);
    persistTheme(next);
    setResolvedTheme(resolveTheme(next));
  }, []);

  /**
   * Toggles between light and dark themes.
   * If current theme is 'system', switches to opposite of current system preference.
   */
  const handleToggle = useCallback(() => {
    setThemeState((prev) => {
      const next = toggleTheme(prev);
      applyTheme(next);
      persistTheme(next);
      setResolvedTheme(resolveTheme(next));
      return next;
    });
  }, []);

  /**
   * Subscribes to system theme changes when theme is set to 'system'.
   * Automatically updates resolved theme when system preference changes.
   */
  useEffect(() => {
    if (theme !== 'system') {
      return;
    }

    const unsubscribe = subscribeToSystemTheme((next) => {
      applyTheme('system');
      setResolvedTheme(next);
    });

    return unsubscribe;
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggle: handleToggle
    }),
    [theme, resolvedTheme, setTheme, handleToggle]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Hook to access theme context.
 * Must be used within a ThemeProvider component.
 * @hook
 * @returns {ThemeContextValue} Theme state and actions
 * @throws {Error} When used outside ThemeProvider
 * @example
 * const { theme, resolvedTheme, setTheme, toggle } = useTheme();
 *
 * // Set theme to dark
 * setTheme('dark');
 *
 * // Toggle theme
 * toggle();
 *
 * // Get current resolved theme (always 'light' or 'dark')
 * console.log(resolvedTheme);
 */
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
};
