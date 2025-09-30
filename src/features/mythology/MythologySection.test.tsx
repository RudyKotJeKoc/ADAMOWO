import { fireEvent, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { beforeEach, describe, expect, it } from 'vitest';

import i18n from '../../i18n';
import { MythologySection } from './MythologySection';

describe('MythologySection', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('pl');
  });

  const renderSection = () =>
    render(
      <I18nextProvider i18n={i18n}>
        <MythologySection />
      </I18nextProvider>
    );

  it('renders four symbols and details for symbol 7', () => {
    renderSection();

    expect(screen.getByRole('heading', { name: 'Mitologia Narcyza' })).toBeInTheDocument();
    const symbolButtons = screen.getAllByRole('button', { name: /Zobacz symbol/ });
    expect(symbolButtons).toHaveLength(4);
    expect(screen.getByRole('button', { name: 'Siedem — Zobacz symbol' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Siedem' })).toBeInTheDocument();
    expect(screen.getByText('Obietnica wyjątkowego porozumienia ponad normami społecznymi.')).toBeInTheDocument();
  });

  it('switches symbols and moves focus to the detail panel', () => {
    const { container } = renderSection();

    const symbolFour = screen.getByRole('button', { name: 'Cztery — Zobacz symbol' });
    fireEvent.click(symbolFour);

    const focusTarget = container.querySelector('[tabindex="-1"]') as HTMLElement | null;
    expect(focusTarget).not.toBeNull();
    expect(document.activeElement).toBe(focusTarget);

    expect(screen.getByRole('heading', { name: 'Cztery' })).toBeInTheDocument();
    expect(symbolFour).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Gdy wsparcie finansowe wiąże się z raportowaniem każdej wydanej złotówki.')).toBeInTheDocument();
  });

  it('supports translations for PL, EN and NL', async () => {
    for (const [lang, expected] of [
      ['pl', 'Mitologia Narcyza'],
      ['en', 'Mythology of the Narcissist'],
      ['nl', 'Mythologie van de narcist']
    ] as const) {
      await i18n.changeLanguage(lang);
      const { unmount } = renderSection();
      expect(screen.getByRole('heading', { name: expected })).toBeInTheDocument();
      unmount();
    }
  });
});
