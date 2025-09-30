import { fireEvent, render, screen, waitFor, act } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '../../i18n';
import { HeroPlayer } from '../HeroPlayer';
import { usePlayerStore } from '../../state/player';

vi.mock('hls.js', () => ({
  default: {
    isSupported: () => true
  }
}));

const defaultNowPlaying = {
  title: 'Mock Show',
  artist: 'Mock Artist',
  track: 'Mock Track',
  coverUrl: '/mock.jpg',
  startedAt: '2024-01-01T00:00:00Z'
};

type HlsEventHandlers = {
  onReady?: () => void;
  onReconnectAttempt?: (attempt: number, max: number) => void;
  onReconnectSuccess?: () => void;
  onError?: (message: string) => void;
};

let capturedHlsOptions: HlsEventHandlers | undefined;

const mockGetNowPlaying = vi.fn(() => Promise.resolve(defaultNowPlaying));
const mockSubscribeNowPlaying = vi.fn<[], () => void>(() => () => undefined);
const mockRetry = vi.fn();
const mockCreateHlsClient = vi.fn((_: unknown, __: unknown, options: HlsEventHandlers) => {
  capturedHlsOptions = options;
  return {
    destroy: vi.fn(),
    retry: mockRetry
  };
});

vi.mock('../../data/nowPlaying', () => ({
  getNowPlaying: mockGetNowPlaying,
  subscribeNowPlaying: mockSubscribeNowPlaying,
  FALLBACK_NOW_PLAYING: defaultNowPlaying
}));

vi.mock('../../lib/hlsClient', () => ({
  MAX_RECONNECT_ATTEMPTS: 5,
  createHlsClient: mockCreateHlsClient
}));

const renderPlayer = (): void => {
  render(
    <I18nextProvider i18n={i18n}>
      <HeroPlayer />
    </I18nextProvider>
  );
};

const resetPlayerStore = (): void => {
  usePlayerStore.setState({
    playing: false,
    volume: 1,
    muted: false,
    src: 'https://example.com/stream.m3u8',
    status: 'idle',
    error: null,
    reconnectCount: 0
  });
};

beforeAll(() => {
  const playSpy = vi
    .spyOn(window.HTMLMediaElement.prototype, 'play')
    .mockImplementation(function mockPlay(this: HTMLMediaElement) {
      this.dispatchEvent(new Event('play'));
      this.dispatchEvent(new Event('playing'));
      return Promise.resolve();
    });

  const pauseSpy = vi
    .spyOn(window.HTMLMediaElement.prototype, 'pause')
    .mockImplementation(function mockPause(this: HTMLMediaElement) {
      this.dispatchEvent(new Event('pause'));
    });

  const loadSpy = vi
    .spyOn(window.HTMLMediaElement.prototype, 'load')
    .mockImplementation(() => undefined);

  // Silence unused variable lint warnings
  if (!playSpy || !pauseSpy || !loadSpy) {
    throw new Error('Failed to mock media element methods');
  }
});

beforeEach(() => {
  vi.clearAllMocks();
  resetPlayerStore();
  capturedHlsOptions = undefined;
  mockGetNowPlaying.mockResolvedValue(defaultNowPlaying);
  mockSubscribeNowPlaying.mockReturnValue(() => undefined);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('HeroPlayer', () => {
  it('renders now playing info and toggles play/pause state', async () => {
    renderPlayer();

    await waitFor(() => expect(mockCreateHlsClient).toHaveBeenCalled());

    const playButton = await screen.findByRole('button', { name: /play/i });

    expect(playButton).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(playButton);

    await waitFor(() => expect(playButton).toHaveAttribute('aria-pressed', 'true'));

    fireEvent.click(playButton);

    await waitFor(() => expect(playButton).toHaveAttribute('aria-pressed', 'false'));
  });

  it('updates volume slider and mute button aria attributes', async () => {
    renderPlayer();

    const volumeSlider = await screen.findByRole('slider', { name: /volume/i });
    fireEvent.change(volumeSlider, { target: { value: '0.5' } });

    await waitFor(() =>
      expect(volumeSlider).toHaveAttribute('aria-valuenow', expect.stringContaining('0.5'))
    );

    const muteButton = screen.getByRole('button', { name: /mute/i });
    fireEvent.click(muteButton);

    await waitFor(() => expect(muteButton).toHaveAttribute('aria-pressed', 'true'));

    fireEvent.click(muteButton);
    await waitFor(() => expect(muteButton).toHaveAttribute('aria-pressed', 'false'));
  });

  it('shows error message and retry option on HLS error', async () => {
    renderPlayer();

    await waitFor(() => expect(mockCreateHlsClient).toHaveBeenCalled());
    expect(capturedHlsOptions).toBeDefined();

    act(() => {
      capturedHlsOptions?.onReconnectAttempt?.(2, 5);
    });

    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('Reconnecting (2/5)…')
    );

    act(() => {
      capturedHlsOptions?.onError?.('Network down');
    });

    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Playback error'));
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Network down'));

    fireEvent.click(screen.getByRole('button', { name: /retry/i }));
    expect(mockRetry).toHaveBeenCalled();
  });

  it('refreshes now playing metadata on interval', async () => {
    vi.useFakeTimers();

    const first = {
      title: 'Track One',
      artist: 'Artist One',
      track: 'First Cut',
      coverUrl: '/one.jpg',
      startedAt: '2024-01-01T00:00:00Z'
    };
    const second = {
      title: 'Track Two',
      artist: 'Artist Two',
      track: 'Second Cut',
      coverUrl: '/two.jpg',
      startedAt: '2024-01-01T00:05:00Z'
    };

    mockGetNowPlaying.mockResolvedValueOnce(first).mockResolvedValueOnce(second);

    renderPlayer();

    expect(await screen.findByText('Track One')).toBeInTheDocument();
    expect(screen.getByText('Artist One – First Cut')).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(15_000);
      await Promise.resolve();
    });

    await waitFor(() => expect(screen.getByText('Track Two')).toBeInTheDocument());
    expect(screen.getByText('Artist Two – Second Cut')).toBeInTheDocument();
  });
});
