import { fireEvent, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { beforeEach, describe, expect, it } from 'vitest';

import i18n from '../../i18n';
import { LibrarySection } from './LibrarySection';

describe('LibrarySection', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('pl');
  });

  const renderSection = () =>
    render(
      <I18nextProvider i18n={i18n}>
        <LibrarySection />
      </I18nextProvider>
    );

  it('renders four library cards and details for the first entry', () => {
    renderSection();

    expect(screen.getByRole('heading', { name: 'Biblioteka Przypadków' })).toBeInTheDocument();
    const cards = screen.getAllByRole('button', { name: /Zobacz —/ });
    expect(cards).toHaveLength(4);
    expect(screen.getByRole('heading', { name: 'Sprawa Adamskich: Wprowadzenie' })).toBeInTheDocument();
    expect(screen.getByText('Rodzina Adamskich zgłosiła serię subtelnych, lecz narastających aktów izolacji i dewaluacji ze strony głowy rodziny.')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Streszczenie' })).toHaveAttribute('aria-selected', 'true');
  });

  it('allows switching entries and tabs while keeping focus on the detail panel', () => {
    const { container } = renderSection();
    const secondCard = screen.getByRole('button', {
      name: 'Zobacz — Analiza Kalendarza: Kronika Eskalacji'
    });

    fireEvent.click(secondCard);

    const focusTarget = container.querySelector('[tabindex="-1"]') as HTMLElement | null;
    expect(focusTarget).not.toBeNull();
    expect(document.activeElement).toBe(focusTarget);

    expect(screen.getByRole('heading', { name: 'Analiza Kalendarza: Kronika Eskalacji' })).toBeInTheDocument();

    const timelineTab = screen.getByRole('tab', { name: 'Oś czasu' });
    fireEvent.click(timelineTab);
    expect(timelineTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Dzień 14')).toBeInTheDocument();
    expect(screen.getByText('Powtarza się cykl: prezent – milczenie – krytyka.')).toBeInTheDocument();

    const tabList = screen.getByRole('tablist', { name: 'Zakładki treści biblioteki' });
    fireEvent.keyDown(tabList, { key: 'ArrowRight' });
    const resourcesTab = screen.getByRole('tab', { name: 'Materiały' });
    expect(resourcesTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('link', { name: /Szablon kalendarza eskalacji/ })).toBeInTheDocument();
  });

  it('loads translations for supported languages', async () => {
    for (const [lang, expected] of [
      ['pl', 'Biblioteka Przypadków'],
      ['en', 'Case Library'],
      ['nl', 'Casusbibliotheek']
    ] as const) {
      await i18n.changeLanguage(lang);
      const { unmount } = renderSection();
      expect(
        screen.getByRole('heading', { name: expected })
      ).toBeInTheDocument();
      unmount();
    }
  });
});
