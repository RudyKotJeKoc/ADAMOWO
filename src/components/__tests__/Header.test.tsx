import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';

import i18n from '../../i18n';
import { ThemeProvider } from '../../state/theme';
import { Header } from '../Header';

declare global {
  interface Window {
    matchMedia: (query: string) => MediaQueryList;
  }
}

const renderHeader = () =>
  render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider initialTheme="system">
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </ThemeProvider>
    </I18nextProvider>
  );
describe('Header', () => {
  beforeEach(async () => {
    window.localStorage.clear();
    document.documentElement.className = '';
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-theme-resolved');
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      media: '(prefers-color-scheme: dark)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      onchange: null,
      dispatchEvent: () => false
    }));
    await i18n.changeLanguage('en');
  });

  it('renders navigation and toggles the mobile drawer', () => {
    renderHeader();
    ['Live', 'Violence Loop', 'Shows'].forEach((label) =>
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    );
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }));
    expect(screen.getByRole('dialog', { name: /main navigation/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /close menu/i }));
    expect(screen.queryByRole('dialog', { name: /main navigation/i })).not.toBeInTheDocument();
  });

  it('sets focus on the first link inside the drawer', () => {
    renderHeader();
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }));
    const focusable = Array.from(
      screen.getByRole('dialog', { name: /main navigation/i }).querySelectorAll<HTMLElement>(
        "a[href],button:not([disabled])"
      )
    );
    expect(document.activeElement).toBe(focusable[0]);
    expect(focusable.slice(0, 3).map((el) => el.textContent?.trim())).toEqual(['Live', 'Violence Loop', 'Shows']);
  });

  it('changes language and theme', async () => {
    renderHeader();
    fireEvent.click(screen.getByRole('button', { name: 'Dutch' }));
    expect(await screen.findByRole('link', { name: 'Geweldscyclus' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /donkere modus/i }));
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
