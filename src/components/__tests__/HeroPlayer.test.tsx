import { fireEvent, render, screen, waitFor, act } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '../../i18n';
import { HeroPlayer } from '../HeroPlayer';
import { usePlayerStore } from '../../state/player';

type LocalAudioClientOptions = {
  onReady?: () => void;
  onError?: (message: string) => void;
  onTrackChange?: (track: {
    id: string;
    title: string;
    artist: string;
    url: string;
    coverUrl?: string;
  }) => void;
  onPlaylistLoaded?: (tracks: unknown[]) => void;
};

// vi.mock(...) factories below are hoisted above regular module code, so the
// mocks they reference must be created inside vi.hoisted() rather than as
// plain top-level consts (which would still be in their temporal dead zone
// when the hoisted factories run).
const {
  defaultNowPlaying,
  mockGetNowPlaying,
  mockSubscribeNowPlaying,
  mockRetry,
  mockDestroy,
  mockCreateLocalAudioClient,
} = vi.hoisted(() => {
  const defaultNowPlaying = {
    title: 'Mock Show',
    artist: 'Mock Artist',
    track: 'Mock Track',
    coverUrl: '/mock.jpg',
    startedAt: '2024-01-01T00:00:00Z',
  };

  const mockGetNowPlaying = vi.fn(() => Promise.resolve(defaultNowPlaying));
  const mockSubscribeNowPlaying = vi.fn<[], () => void>(() => () => undefined);
  const mockRetry = vi.fn();
  const mockDestroy = vi.fn();
  const mockCreateLocalAudioClient = vi.fn();

  return {
    defaultNowPlaying,
    mockGetNowPlaying,
    mockSubscribeNowPlaying,
    mockRetry,
    mockDestroy,
    mockCreateLocalAudioClient,
  };
});

let capturedClientOptions: LocalAudioClientOptions | undefined;

vi.mock('../../data/nowPlaying', () => ({
  getNowPlaying: mockGetNowPlaying,
  subscribeNowPlaying: mockSubscribeNowPlaying,
  FALLBACK_NOW_PLAYING: defaultNowPlaying,
}));

vi.mock('../../lib/localAudioClient', () => ({
  createLocalAudioClient: mockCreateLocalAudioClient,
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
    playlistUrl: '/music/playlist.json',
    status: 'idle',
    error: null,
    currentTrack: null,
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
  capturedClientOptions = undefined;
  mockGetNowPlaying.mockResolvedValue(defaultNowPlaying);
  mockSubscribeNowPlaying.mockReturnValue(() => undefined);
  mockCreateLocalAudioClient.mockImplementation(
    (_audio: HTMLAudioElement, _playlistUrl: string, options: LocalAudioClientOptions) => {
      capturedClientOptions = options;
      return {
        destroy: mockDestroy,
        retry: mockRetry,
        nextTrack: vi.fn(),
        previousTrack: vi.fn(),
        getCurrentTrack: () => null,
        getPlaylist: () => [],
      };
    }
  );
});

afterEach(() => {
  vi.useRealTimers();
});

describe('HeroPlayer', () => {
  it('renders now playing info and toggles play/pause state', async () => {
    renderPlayer();

    await waitFor(() => expect(mockCreateLocalAudioClient).toHaveBeenCalled());

    const playButton = await screen.findByRole('button', { name: /odtwórz/i });

    expect(playButton).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(playButton);

    await waitFor(() => expect(playButton).toHaveAttribute('aria-pressed', 'true'));

    fireEvent.click(playButton);

    await waitFor(() => expect(playButton).toHaveAttribute('aria-pressed', 'false'));
  });

  it('updates volume slider and mute button aria attributes', async () => {
    renderPlayer();

    const volumeSlider = await screen.findByRole('slider', { name: /głośność/i });
    fireEvent.change(volumeSlider, { target: { value: '0.5' } });

    await waitFor(() =>
      expect(volumeSlider).toHaveAttribute('aria-valuenow', expect.stringContaining('0.5'))
    );

    const muteButton = screen.getByRole('button', { name: /wycisz/i });
    fireEvent.click(muteButton);

    await waitFor(() => expect(muteButton).toHaveAttribute('aria-pressed', 'true'));

    fireEvent.click(muteButton);
    await waitFor(() => expect(muteButton).toHaveAttribute('aria-pressed', 'false'));
  });

  it('shows error message and retry option when the audio client reports an error', async () => {
    renderPlayer();

    await waitFor(() => expect(mockCreateLocalAudioClient).toHaveBeenCalled());
    expect(capturedClientOptions).toBeDefined();

    act(() => {
      capturedClientOptions?.onError?.('Network down');
    });

    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('Nie udało się odtworzyć strumienia.')
    );
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Brak połączenia internetowego. Sprawdź swoją sieć Wi-Fi lub dane komórkowe.'
    );

    fireEvent.click(screen.getByRole('button', { name: /spróbuj ponownie/i }));
    expect(mockRetry).toHaveBeenCalled();
  });

  it('refreshes now playing metadata on interval', async () => {
    const first = {
      title: 'Track One',
      artist: 'Artist One',
      track: 'First Cut',
      coverUrl: '/one.jpg',
      startedAt: '2024-01-01T00:00:00Z',
    };
    const second = {
      title: 'Track Two',
      artist: 'Artist Two',
      track: 'Second Cut',
      coverUrl: '/two.jpg',
      startedAt: '2024-01-01T00:05:00Z',
    };

    mockGetNowPlaying.mockResolvedValueOnce(first).mockResolvedValueOnce(second);

    // Fake timers must be active before the component mounts, otherwise its
    // setInterval registers against the real clock and advanceTimersByTimeAsync
    // (which only drives the fake timer queue) can never fire it. The initial
    // poll only needs its promise microtask flushed, not a timer tick, so a
    // synchronous getByText after that flush works without findBy's
    // real-timer-based polling.
    vi.useFakeTimers();

    renderPlayer();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(screen.getByText('Track One')).toBeInTheDocument();
    expect(screen.getByText('Artist One – First Cut')).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(15_000);
    });

    expect(screen.getByText('Track Two')).toBeInTheDocument();
    expect(screen.getByText('Artist Two – Second Cut')).toBeInTheDocument();
  });
});
