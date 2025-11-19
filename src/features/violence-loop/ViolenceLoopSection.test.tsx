import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import i18n from '../../i18n';
import { ViolenceLoopSection } from './ViolenceLoopSection';

// Mock InfinityDiagram to avoid SVG path issues in jsdom

vi.mock('./InfinityDiagram', () => {
  return {
    InfinityDiagram: ({
      phases,
      activePhaseId,
      onRequestNavigate,
      diagramLabel,
      instructions,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }: any) => (
      <div
        role="group"
        aria-label={diagramLabel}
        aria-describedby="loop-diagram-instructions"
        tabIndex={0}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onKeyDown={(e: any) => {
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            onRequestNavigate('prev');
          } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            onRequestNavigate('next');
          }
        }}
      >
        <p id="loop-diagram-instructions" className="sr-only">
          {instructions}
        </p>
        {phases.map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (phase: any) => (
            <div key={phase.id} data-active={phase.id === activePhaseId}>
              {phase.title}
            </div>
          )
        )}
      </div>
    ),
  };
});

describe('ViolenceLoopSection', () => {
  const originalMatchMedia = window.matchMedia;
  let prefersReducedMotion = false;

  beforeAll(async () => {
    // Set i18n language to Polish for consistent test behavior
    await i18n.changeLanguage('pl');

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
        dispatchEvent: vi.fn(),
      }),
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
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <ViolenceLoopSection />
        </I18nextProvider>
      </MemoryRouter>
    );

  it('renders the section heading and description', () => {
    renderSection();

    expect(screen.getByRole('region', { name: /loop\.title/i })).toBeInTheDocument();
    expect(screen.getByText(/loop\.subtitle/i)).toBeInTheDocument();
  });

  it('toggles play and pause state via the main control button', () => {
    renderSection();

    const playButton = screen.getByRole('button', { name: /loop\.controls\.pause/i });
    expect(playButton).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(playButton);

    expect(screen.getByRole('button', { name: /loop\.controls\.play/i })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });

  it('moves between phases when next and previous buttons are used', () => {
    renderSection();

    const nextButton = screen.getByRole('button', { name: /loop\.controls\.next/i });
    fireEvent.click(nextButton);

    expect(screen.getByText(/loop\.phase\.devaluation\.summary/i)).toBeInTheDocument();

    const prevButton = screen.getByRole('button', { name: /loop\.controls\.prev/i });
    fireEvent.click(prevButton);

    expect(screen.getByText(/loop\.phase\.loveBombing\.summary/i)).toBeInTheDocument();
  });

  it('starts paused when the system prefers reduced motion', async () => {
    prefersReducedMotion = true;
    renderSection();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /loop\.controls\.play/i })).toHaveAttribute(
        'aria-pressed',
        'false'
      );
    });
  });

  it('supports keyboard navigation via the diagram', () => {
    renderSection();

    const diagram = screen.getByRole('group', { name: /loop\.diagram\.label/i });
    diagram.focus();
    fireEvent.keyDown(diagram, { key: 'ArrowRight' });

    expect(screen.getByText(/loop\.phase\.devaluation\.summary/i)).toBeInTheDocument();
  });
});
