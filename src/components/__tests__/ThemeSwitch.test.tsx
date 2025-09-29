import { act, fireEvent, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';

import i18n from '../../i18n';
import { ThemeProvider } from '../../state/theme';
import { ThemeSwitch } from '../ThemeSwitch';

declare global {
  interface Window {
    matchMedia: (query: string) => MediaQueryList;
  }
}

describe('ThemeSwitch', () => {
  let listeners: Array<(event: MediaQueryListEvent) => void>;
  beforeEach(async () => {
    listeners = [];
    window.localStorage.clear();
    document.documentElement.className = '';
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-theme-resolved');
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      media: '(prefers-color-scheme: dark)',
      addEventListener: (_: string, handler: (event: MediaQueryListEvent) => void) => listeners.push(handler),
      removeEventListener: (_: string, handler: (event: MediaQueryListEvent) => void) =>
        (listeners = listeners.filter((listener) => listener !== handler)),
      addListener: (handler: (event: MediaQueryListEvent) => void) => listeners.push(handler),
      removeListener: (handler: (event: MediaQueryListEvent) => void) =>
        (listeners = listeners.filter((listener) => listener !== handler)),
      onchange: null,
      dispatchEvent: () => false
    }));
    await i18n.changeLanguage('en');
  });

  it('switches between light, dark and system modes', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider initialTheme="system">
          <ThemeSwitch />
        </ThemeProvider>
      </I18nextProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /dark mode/i }));
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(window.localStorage.getItem('radio-adamowo-theme')).toBe('dark');

    fireEvent.click(screen.getByRole('button', { name: /light mode/i }));
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(window.localStorage.getItem('radio-adamowo-theme')).toBe('light');

    fireEvent.click(screen.getByRole('button', { name: /system theme/i }));
    expect(window.localStorage.getItem('radio-adamowo-theme')).toBe('system');

    act(() => {
      listeners.forEach((listener) => listener({ matches: true } as MediaQueryListEvent));
    });
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
