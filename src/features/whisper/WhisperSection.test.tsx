import { act, fireEvent, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import i18n from '../../i18n';
import { WhisperSection } from './WhisperSection';

describe('WhisperSection', () => {
  let reduceMotion = false;
  const originalMatchMedia = window.matchMedia;
  const originalPlay = HTMLMediaElement.prototype.play;
  const originalPause = HTMLMediaElement.prototype.pause;

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: query.includes('prefers-reduced-motion') ? reduceMotion : false,
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
    reduceMotion = false;
    sessionStorage.clear();
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    window.matchMedia = originalMatchMedia;
    HTMLMediaElement.prototype.play = originalPlay;
    HTMLMediaElement.prototype.pause = originalPause;
  });

  const renderSection = () =>
    render(
      <I18nextProvider i18n={i18n}>
        <WhisperSection />
      </I18nextProvider>
    );

  it('renders the archival audio region and ethics guidance', () => {
    renderSection();

    expect(screen.getByRole('region', { name: /Szept zza Kurtyny/ })).toBeInTheDocument();
    expect(screen.getByText('Nagranie dokumentuje napięte przesłuchanie publiczne z 2017 roku.')).toBeInTheDocument();
  });

  it('starts playback when the play button is pressed', async () => {
    renderSection();
    const playButton = screen.getByRole('button', { name: 'Odtwórz' });

    await act(async () => {
      fireEvent.click(playButton);
    });

    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();

    const audioElement = document.querySelector('audio');
    expect(audioElement).not.toBeNull();
    audioElement?.dispatchEvent(new Event('play'));

    expect(screen.getByRole('button', { name: 'Wstrzymaj' })).toBeInTheDocument();
  });

  it('updates aria attributes when volume changes', () => {
    renderSection();
    const volumeSlider = screen.getByLabelText('Głośność');

    fireEvent.change(volumeSlider, { target: { value: '0.4' } });

    expect(volumeSlider).toHaveAttribute('aria-valuenow', '0.4');
    expect(volumeSlider).toHaveAttribute('aria-valuetext', '40%');
  });

  it('returns to play state after the audio ends', () => {
    renderSection();
    const audioElement = document.querySelector('audio');
    const playButton = screen.getByRole('button', { name: 'Odtwórz' });

    act(() => {
      playButton.click();
    });

    audioElement?.dispatchEvent(new Event('play'));
    audioElement?.dispatchEvent(new Event('ended'));

    expect(screen.getByRole('button', { name: 'Odtwórz' })).toBeInTheDocument();
  });

  it('disables curtain animation when reduced motion is preferred', () => {
    reduceMotion = true;
    const { container } = renderSection();
    const curtain = container.querySelector('.whisper-curtain');
    expect(curtain).not.toBeNull();
    expect(curtain).toHaveAttribute('data-reduced-motion', 'true');
  });
});
