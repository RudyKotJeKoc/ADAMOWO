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

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  initialTheme: Theme;
  children: ReactNode;
}

export function ThemeProvider({ children, initialTheme }: ThemeProviderProps): JSX.Element {
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolveTheme(initialTheme));

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    applyTheme(next);
    persistTheme(next);
    setResolvedTheme(resolveTheme(next));
  }, []);

  const handleToggle = useCallback(() => {
    setThemeState((prev) => {
      const next = toggleTheme(prev);
      applyTheme(next);
      persistTheme(next);
      setResolvedTheme(resolveTheme(next));
      return next;
    });
  }, []);

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

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
};
