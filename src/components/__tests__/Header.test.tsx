import { fireEvent, render, screen, within } from '@testing-library/react';
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
      dispatchEvent: () => false,
    }));
    await i18n.changeLanguage('en');
  });

  it('renders all ADAMOWO sections without hiding them behind a mobile drawer', () => {
    renderHeader();
    const mobileNav = screen.getByRole('navigation', { name: 'Działy ADAMOWO' });
    const mobileLinks = within(mobileNav).getAllByRole('link');

    expect(mobileLinks.map((link) => link.textContent).join('')).toBe('ADAMOWO');
    [
      'Analizy',
      'Definicje',
      'Argumenty',
      'Mechanizmy',
      'Orzecznictwo',
      'Wykładnie',
      'Ochrona',
    ].forEach((label) =>
      expect(within(mobileNav).getByRole('link', { name: label })).toBeInTheDocument()
    );
    expect(screen.queryByRole('button', { name: /open menu/i })).not.toBeInTheDocument();
  });

  it('keeps every compact letter link keyboard accessible', () => {
    renderHeader();
    const mobileNav = screen.getByRole('navigation', { name: 'Działy ADAMOWO' });
    const links = within(mobileNav).getAllByRole('link');
    links[0].focus();

    expect(document.activeElement).toBe(links[0]);
    expect(links.slice(0, 3).map((link) => link.getAttribute('aria-label'))).toEqual([
      'Analizy',
      'Definicje',
      'Argumenty',
    ]);
  });

  it('changes language', async () => {
    renderHeader();
    fireEvent.click(screen.getByRole('button', { name: 'Dutch' }));
    expect((await screen.findAllByRole('link', { name: 'Analizy' })).length).toBeGreaterThan(0);
  });
});
