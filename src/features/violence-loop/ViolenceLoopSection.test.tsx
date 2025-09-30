import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import i18n from '../../i18n';
import { ViolenceLoopSection } from './ViolenceLoopSection';

describe('ViolenceLoopSection', () => {
  const originalMatchMedia = window.matchMedia;
  let prefersReducedMotion = false;

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: query.includes('prefers-reduced-motion') ? prefersReducedMotion : false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        onchange: null,
        dispatchEvent: vi.fn()
      })
    });
  });

  beforeEach(() => {
    prefersReducedMotion = false;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    window.matchMedia = originalMatchMedia;
  });

  const renderSection = () =>
    render(
      <I18nextProvider i18n={i18n}>
        <ViolenceLoopSection />
      </I18nextProvider>
    );

  it('renders the section heading and description', () => {
    renderSection();

    expect(screen.getByRole('region', { name: 'Kocioł Wiedźmy: Pętla Przemocy' })).toBeInTheDocument();
    expect(screen.getByText('Fazy relacji, które zazębiają się i powtarzają.')).toBeInTheDocument();
  });

  it('toggles play and pause state via the main control button', () => {
    renderSection();

    const playButton = screen.getByRole('button', { name: 'Wstrzymaj' });
    expect(playButton).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(playButton);

    expect(screen.getByRole('button', { name: 'Odtwórz' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('moves between phases when next and previous buttons are used', () => {
    renderSection();

    const nextButton = screen.getByRole('button', { name: 'Następna faza' });
    fireEvent.click(nextButton);

    expect(
      screen.getByText('Krytyka i chłód emocjonalny podkopują poczucie własnej wartości.')
    ).toBeInTheDocument();

    const prevButton = screen.getByRole('button', { name: 'Poprzednia faza' });
    fireEvent.click(prevButton);

    expect(
      screen.getByText('Przesadne czułości i obietnice tworzą fałszywe poczucie bezpieczeństwa.')
    ).toBeInTheDocument();
  });

  it('starts paused when the system prefers reduced motion', async () => {
    prefersReducedMotion = true;
    renderSection();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Odtwórz' })).toHaveAttribute('aria-pressed', 'false');
    });
  });

  it('supports keyboard navigation via the diagram', () => {
    renderSection();

    const diagram = screen.getByRole('group', { name: 'Diagram nieskończoności pętli przemocy' });
    diagram.focus();
    fireEvent.keyDown(diagram, { key: 'ArrowRight' });

    expect(
      screen.getByText('Krytyka i chłód emocjonalny podkopują poczucie własnej wartości.')
    ).toBeInTheDocument();
  });
});
