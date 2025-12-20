/**
 * MusicPlayer Component
 *
 * Advanced music player with dynamic playlist loading
 * - Loads tracks from /music/playlist.json
 * - Auto-shuffle on startup for random playback
 * - Modern, intuitive UI/UX
 * - Integration with AudioEngine
 */

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AudioEngine } from '../media/AudioEngine';
import { AudioVisualizer } from '../media/AudioVisualizer';
import {
  useAudioEngineStore,
  usePlaylistQueueStore,
  selectCurrentTrack,
  selectProgress,
} from '../../state/media';
import type { AudioTrack } from '../media/media.schema';
import IMAGE_PATHS from '../../config/imageMap';

interface PlaylistTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  year?: number;
  url: string;
  coverUrl?: string;
  duration?: number;
  genre?: string;
  category?: string;
  mood?: string[];
  therapeuticTags?: string[];
}

/**
 * Load tracks from playlist.json
 */
async function loadPlaylist(): Promise<AudioTrack[]> {
  try {
    const response = await fetch('/music/playlist.json');
    if (!response.ok) {
      throw new Error('Failed to load playlist');
    }
    const data: PlaylistTrack[] = await response.json();

    return data.map((track) => ({
      id: track.id,
      title: track.title,
      artist: track.artist,
      album: track.album || 'Radio Adamowo',
      url: track.url,
      coverUrl: track.coverUrl || IMAGE_PATHS.placeholders.cover,
      genre: track.genre || 'Various',
      category: track.category || 'Music',
      duration: track.duration,
    }));
  } catch (error) {
    console.error('Failed to load playlist:', error);
    return [];
  }
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function MusicPlayer(): JSX.Element {
  const { t } = useTranslation();
  const [showQueue, setShowQueue] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allTracks, setAllTracks] = useState<AudioTrack[]>([]);

  // Audio Engine Store
  const status = useAudioEngineStore((state) => state.status);
  const currentTrack = useAudioEngineStore(selectCurrentTrack);
  const volume = useAudioEngineStore((state) => state.volume);
  const muted = useAudioEngineStore((state) => state.muted);
  const error = useAudioEngineStore((state) => state.error);
  const setVolume = useAudioEngineStore((state) => state.setVolume);
  const setMuted = useAudioEngineStore((state) => state.setMuted);
  const progress = useAudioEngineStore(selectProgress);

  // Queue Store
  const queue = usePlaylistQueueStore((state) => state.queue);
  const setQueue = usePlaylistQueueStore((state) => state.setQueue);
  const next = usePlaylistQueueStore((state) => state.next);
  const previous = usePlaylistQueueStore((state) => state.previous);
  const toggleShuffle = usePlaylistQueueStore((state) => state.toggleShuffle);
  const setRepeat = usePlaylistQueueStore((state) => state.setRepeat);
  const jumpTo = usePlaylistQueueStore((state) => state.jumpTo);

  const isPlaying = useMemo(() => status === 'playing', [status]);

  // Load playlist on mount
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      setLoading(true);
      const tracks = await loadPlaylist();

      if (mounted && tracks.length > 0) {
        setAllTracks(tracks);
        // Auto-shuffle on startup for random playback
        const shuffled = shuffleArray(tracks);
        setQueue(shuffled);
        // Enable shuffle mode
        if (!queue.shuffle) {
          toggleShuffle();
        }
      }

      setLoading(false);
    };

    init();

    return () => {
      mounted = false;
    };
  }, [setQueue, toggleShuffle, queue.shuffle]);

  // Handle shuffle
  const handleShuffle = () => {
    if (!queue.shuffle) {
      // Enable shuffle - randomize queue
      const shuffled = shuffleArray(allTracks);
      setQueue(shuffled);
    } else {
      // Disable shuffle - restore original order
      setQueue(allTracks);
    }
    toggleShuffle();
  };

  // Handle play random
  const handlePlayRandom = () => {
    const randomIndex = Math.floor(Math.random() * allTracks.length);
    jumpTo(randomIndex);
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && muted) {
      setMuted(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-16 w-16 mx-auto animate-spin rounded-full border-4 border-accent-500 border-t-transparent" />
          <p className="text-lg font-medium text-base-200">Ładowanie muzyki...</p>
        </div>
      </div>
    );
  }

  // No tracks available
  if (allTracks.length === 0) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-base-900 to-base-800 p-12 text-center">
        <p className="text-xl text-base-200">Brak dostępnych utworów</p>
        <p className="mt-2 text-sm text-base-400">Sprawdź plik /music/playlist.json</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Audio Engine (headless) */}
      <AudioEngine />

      {/* Header */}
      <header className="rounded-2xl border border-base-700 bg-[radial-gradient(circle_at_top,_#1a1f3a,_#080b1e)] p-6 text-base-50 shadow-lg shadow-indigo-950/40">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-base-50 sm:text-4xl">
              {t('pages.lab.title', 'Lab')}
            </h1>
            <p className="mt-2 text-sm text-base-300">
              Odtwarzacz Muzyki • {allTracks.length} {allTracks.length === 1 ? 'utwór' : 'utworów'}
            </p>
          </div>
          <div className="text-right space-y-1">
            <div className="flex items-center gap-2 justify-end">
              <span
                className={`h-2 w-2 rounded-full ${
                  status === 'playing'
                    ? 'bg-accent-400 animate-pulse'
                    : status === 'loading'
                      ? 'bg-yellow-500 animate-pulse'
                      : status === 'error'
                        ? 'bg-red-500'
                        : 'bg-base-600'
                }`}
              />
              <p className="text-xs text-base-300 capitalize">{status}</p>
            </div>
            <p className="text-xs text-base-400">{queue.tracks.length} w kolejce</p>
          </div>
        </div>
      </header>

      {/* Player Card */}
      <section
        className="rounded-2xl border border-base-700 bg-[radial-gradient(circle_at_top,_#1a1f3a,_#080b1e)] p-8 text-base-50 shadow-lg shadow-indigo-950/40"
        role="region"
        aria-label="Odtwarzacz muzyki"
      >
        {/* Current Track Info */}
        <div className="mb-8 grid gap-8 lg:grid-cols-[240px,1fr]">
          {/* Album Art */}
          <div className="relative overflow-hidden rounded-xl bg-base-900/50 shadow-lg">
            <img
              src={currentTrack?.coverUrl || IMAGE_PATHS.placeholders.cover}
              alt={currentTrack?.title || 'Brak utworu'}
              className="h-full w-full object-cover"
              width={240}
              height={240}
              loading="lazy"
            />
            {status === 'playing' && (
              <div className="absolute bottom-3 right-3 rounded-full bg-base-800/80 backdrop-blur-sm px-3 py-1.5 text-xs text-base-100 border border-accent-500/30">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-400 animate-pulse mr-1.5" />
                Odtwarzanie
              </div>
            )}
            {status === 'loading' && (
              <div className="absolute inset-0 flex items-center justify-center bg-base-950/80 backdrop-blur-sm">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent-500 border-t-transparent" />
              </div>
            )}
          </div>

          {/* Track Details & Visualizer */}
          <div className="flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-300">
                Teraz Gra
              </p>
              <h2 className="text-3xl font-semibold leading-tight text-base-50 sm:text-4xl">
                {currentTrack?.title || 'Wybierz utwór aby rozpocząć'}
              </h2>
              <p className="text-base text-base-200">{currentTrack?.artist || 'Radio Adamowo'}</p>
              {currentTrack?.album && (
                <p className="text-sm text-base-300">Album: {currentTrack.album}</p>
              )}
              {currentTrack?.genre && (
                <p className="text-xs text-base-400">
                  {currentTrack.genre}
                  {currentTrack.category ? ` • ${currentTrack.category}` : ''}
                </p>
              )}
            </div>

            {/* Visualizer */}
            <div className="rounded-xl bg-base-950/30 p-4 border border-base-700/30">
              <AudioVisualizer height={80} />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-base-800 ring-1 ring-base-700/50">
            <div
              className="h-full bg-gradient-to-r from-accent-600 via-accent-500 to-accent-400 transition-all duration-300 shadow-lg"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-base-50 shadow-xl ring-2 ring-accent-400 transition-all duration-300"
              style={{ left: `calc(${progress}% - 8px)` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-base-400">
            <span>Postęp: {Math.round(progress)}%</span>
            {queue.currentIndex >= 0 && (
              <span>
                Utwór {queue.currentIndex + 1} z {queue.tracks.length}
              </span>
            )}
          </div>
        </div>

        {/* Main Controls */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={previous}
            disabled={queue.currentIndex === 0 && queue.repeat === 'none'}
            className="rounded-full border border-base-700 bg-base-900/50 p-4 text-base-100 shadow transition hover:border-accent-400 hover:bg-base-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-base-700 disabled:hover:bg-base-900/50"
            title="Poprzedni utwór"
            aria-label="Poprzedni utwór"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={next}
            className="rounded-full border-2 border-accent-400 bg-accent-500 p-6 text-base-950 shadow-lg transition hover:bg-accent-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-300"
            title={isPlaying ? 'Pauza' : 'Odtwórz'}
            aria-label={isPlaying ? 'Pauza' : 'Odtwórz'}
            aria-pressed={isPlaying}
          >
            {isPlaying ? (
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={next}
            className="rounded-full border border-base-700 bg-base-900/50 p-4 text-base-100 shadow transition hover:border-accent-400 hover:bg-base-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
            title="Następny utwór"
            aria-label="Następny utwór"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 18h2V6h-2zm-11-7l8.5-6v12z" />
            </svg>
          </button>
        </div>

        {/* Secondary Controls */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleShuffle}
            className={`rounded-full px-5 py-2 text-sm font-semibold uppercase tracking-wide transition ${
              queue.shuffle
                ? 'border-2 border-accent-400 bg-accent-500 text-base-950 hover:bg-accent-400'
                : 'border border-base-700 bg-base-900/50 text-base-200 hover:border-accent-400 hover:text-accent-200'
            } focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400`}
            title="Włącz/wyłącz losowe odtwarzanie"
            aria-pressed={queue.shuffle}
          >
            Shuffle {queue.shuffle ? 'ON' : 'OFF'}
          </button>

          <button
            type="button"
            onClick={handlePlayRandom}
            className="rounded-full border border-base-700 bg-base-900/50 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-base-200 transition hover:border-accent-400 hover:text-accent-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
            title="Odtwórz losowy utwór"
          >
            Losowy
          </button>

          <button
            type="button"
            onClick={() => {
              const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all'];
              const currentIndex = modes.indexOf(queue.repeat);
              const nextIndex = (currentIndex + 1) % modes.length;
              setRepeat(modes[nextIndex]);
            }}
            className={`rounded-full px-5 py-2 text-sm font-semibold uppercase tracking-wide transition ${
              queue.repeat !== 'none'
                ? 'border-2 border-accent-400 bg-accent-500 text-base-950 hover:bg-accent-400'
                : 'border border-base-700 bg-base-900/50 text-base-200 hover:border-accent-400 hover:text-accent-200'
            } focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400`}
            title={`Powtarzanie: ${queue.repeat}`}
            aria-pressed={queue.repeat !== 'none'}
          >
            {queue.repeat === 'one'
              ? 'Powtórz jeden'
              : queue.repeat === 'all'
                ? 'Powtórz wszystkie'
                : 'Bez powtórek'}
          </button>

          <button
            type="button"
            onClick={() => setShowQueue(!showQueue)}
            className="rounded-full border border-base-700 bg-base-900/50 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-base-200 transition hover:border-accent-400 hover:text-accent-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
            title="Pokaż/ukryj kolejkę odtwarzania"
            aria-expanded={showQueue}
          >
            Kolejka {showQueue ? '▲' : '▼'}
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center justify-center gap-4 rounded-xl bg-base-950/30 p-6 border border-base-700/30">
          <button
            type="button"
            onClick={() => setMuted(!muted)}
            className="rounded-md border border-base-700 px-3 py-1 text-xs uppercase tracking-wide text-base-200 transition hover:border-accent-400 hover:text-accent-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
            aria-pressed={muted}
            aria-label={muted ? 'Wyłącz wyciszenie' : 'Wycisz'}
          >
            {muted ? 'Wyłącz wyciszenie' : 'Wycisz'}
          </button>

          <label className="flex flex-1 max-w-md items-center gap-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-base-300">
              Głośność
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={muted ? 0 : volume}
              onChange={handleVolumeChange}
              className="flex-1 accent-accent-400"
              aria-valuemin={0}
              aria-valuemax={1}
              aria-valuenow={muted ? 0 : volume}
              aria-label="Głośność"
            />
            <span className="w-12 text-right text-sm text-base-200">
              {Math.round((muted ? 0 : volume) * 100)}%
            </span>
          </label>
        </div>

        {/* Error Display */}
        {error && (
          <div
            className="mt-6 rounded-xl border-2 border-red-500/50 bg-red-900/20 px-6 py-4 shadow-lg"
            role="alert"
          >
            <p className="text-sm font-semibold text-red-300">Błąd odtwarzania: {error}</p>
            <p className="mt-1 text-xs text-red-400">
              Sprawdź połączenie internetowe i spróbuj ponownie.
            </p>
          </div>
        )}
      </section>

      {/* Queue Display */}
      {showQueue && (
        <section
          className="rounded-2xl border border-base-700 bg-[radial-gradient(circle_at_top,_#1a1f3a,_#080b1e)] p-8 text-base-50 shadow-lg shadow-indigo-950/40"
          role="region"
          aria-label="Kolejka odtwarzania"
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-base-50">Kolejka odtwarzania</h3>
            <span className="rounded-full border border-accent-500/30 bg-accent-500/10 px-4 py-1.5 text-xs font-semibold text-accent-300">
              {queue.tracks.length} {queue.tracks.length === 1 ? 'utwór' : 'utworów'}
            </span>
          </div>

          <div className="max-h-[500px] space-y-2 overflow-y-auto pr-2">
            {queue.tracks.map((track, index) => (
              <button
                key={`${track.id}-${index}`}
                type="button"
                onClick={() => jumpTo(index)}
                className={`group w-full rounded-lg px-4 py-3 text-left transition ${
                  index === queue.currentIndex
                    ? 'border-2 border-accent-500/60 bg-accent-500/20'
                    : 'border border-base-700/30 bg-base-800/40 hover:border-accent-500/30 hover:bg-base-800/60'
                } focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      index === queue.currentIndex
                        ? 'bg-accent-500 text-base-950'
                        : 'bg-base-700 text-base-300 group-hover:bg-base-600'
                    }`}
                  >
                    {index === queue.currentIndex ? '▶' : index + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-semibold truncate text-sm ${
                        index === queue.currentIndex ? 'text-accent-100' : 'text-base-100'
                      }`}
                    >
                      {track.title}
                    </p>
                    <p className="text-xs text-base-300 truncate">
                      {track.artist}
                      {track.genre ? ` • ${track.genre}` : ''}
                    </p>
                  </div>

                  {index === queue.currentIndex && (
                    <span className="shrink-0 rounded-full border border-accent-500/50 bg-accent-500/20 px-3 py-1 text-xs font-semibold text-accent-200">
                      Odtwarzanie
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
