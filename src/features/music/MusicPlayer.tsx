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
  selectProgress
} from '../../state/media';
import type { AudioTrack } from '../media/media.schema';

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
      coverUrl: track.coverUrl || '/images/Icon.jpg',
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
  }, []);

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
      <div className="rounded-2xl bg-gradient-to-br from-base-900/80 to-base-800/80 p-6 backdrop-blur-sm border border-base-700/50">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-base-50 sm:text-4xl">
              {t('pages.lab.title', 'Lab')}
            </h1>
            <p className="mt-2 text-base-200">
              🎵 Odtwarzacz Muzyki - {allTracks.length} {allTracks.length === 1 ? 'utwór' : 'utworów'}
            </p>
          </div>
          <div className="text-right space-y-1">
            <div className="flex items-center gap-2 justify-end">
              <span className={`h-2.5 w-2.5 rounded-full ${
                status === 'playing' ? 'bg-green-500 animate-pulse' :
                status === 'loading' ? 'bg-yellow-500 animate-pulse' :
                status === 'error' ? 'bg-red-500' : 'bg-base-600'
              }`} />
              <p className="text-sm text-base-300 capitalize">{status}</p>
            </div>
            <p className="text-sm text-base-400">
              Kolejka: {queue.tracks.length} utworów
            </p>
          </div>
        </div>
      </div>

      {/* Player Card */}
      <div className="rounded-2xl bg-gradient-to-br from-base-900 to-base-800 p-8 shadow-2xl border border-base-700/50">
        {/* Current Track Info */}
        <div className="mb-8 grid gap-8 lg:grid-cols-[240px,1fr]">
          {/* Album Art */}
          <div className="relative overflow-hidden rounded-2xl bg-base-950/50 shadow-2xl ring-2 ring-accent-500/20">
            <img
              src={currentTrack?.coverUrl || '/images/Icon.jpg'}
              alt={currentTrack?.title || 'No track'}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              width={240}
              height={240}
            />
            {status === 'playing' && (
              <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-accent-500/90 px-3 py-1.5 text-xs font-bold text-base-950">
                <span className="h-2 w-2 rounded-full bg-base-950 animate-pulse" />
                PLAYING
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
              <p className="text-xs font-bold uppercase tracking-widest text-accent-400">
                🎵 Teraz Gra
              </p>
              <h2 className="text-3xl font-bold leading-tight text-base-50 sm:text-4xl">
                {currentTrack?.title || 'Wybierz utwór aby rozpocząć'}
              </h2>
              <p className="text-lg text-base-200">
                {currentTrack?.artist || 'Radio Adamowo'}
              </p>
              {currentTrack?.album && (
                <p className="text-sm text-base-300">
                  📀 Album: {currentTrack.album}
                </p>
              )}
              {currentTrack?.genre && (
                <p className="text-xs text-base-400">
                  🎸 Gatunek: {currentTrack.genre} {currentTrack.category ? `• ${currentTrack.category}` : ''}
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
              <span>Utwór {queue.currentIndex + 1} z {queue.tracks.length}</span>
            )}
          </div>
        </div>

        {/* Main Controls */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={previous}
            disabled={queue.currentIndex === 0 && queue.repeat === 'none'}
            className="group rounded-full bg-gradient-to-br from-base-700 to-base-800 p-4 text-base-100 shadow-lg transition-all hover:from-base-600 hover:to-base-700 hover:scale-110 hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 ring-2 ring-base-600/50 hover:ring-accent-500/50"
            title="Poprzedni utwór"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
            </svg>
          </button>

          <button
            type="button"
            onClick={next}
            className="group rounded-full bg-gradient-to-br from-accent-500 to-accent-600 p-6 text-base-950 shadow-2xl transition-all hover:from-accent-400 hover:to-accent-500 hover:scale-110 hover:shadow-accent-500/50 ring-4 ring-accent-400/30 hover:ring-accent-300/50"
            title={isPlaying ? 'Pauza' : 'Odtwórz'}
          >
            {isPlaying ? (
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={next}
            className="group rounded-full bg-gradient-to-br from-base-700 to-base-800 p-4 text-base-100 shadow-lg transition-all hover:from-base-600 hover:to-base-700 hover:scale-110 hover:shadow-xl ring-2 ring-base-600/50 hover:ring-accent-500/50"
            title="Następny utwór"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 18h2V6h-2zm-11-7l8.5-6v12z"/>
            </svg>
          </button>
        </div>

        {/* Secondary Controls */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleShuffle}
            className={`rounded-lg px-6 py-3 text-sm font-bold uppercase tracking-wide transition-all hover:scale-105 shadow-md ${
              queue.shuffle
                ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-base-950 ring-2 ring-accent-400/50'
                : 'bg-base-700 text-base-100 hover:bg-base-600'
            }`}
            title="Włącz/wyłącz losowe odtwarzanie"
          >
            🔀 Shuffle {queue.shuffle ? 'ON' : 'OFF'}
          </button>

          <button
            type="button"
            onClick={handlePlayRandom}
            className="rounded-lg bg-gradient-to-r from-base-700 to-base-800 px-6 py-3 text-sm font-bold uppercase tracking-wide text-base-100 shadow-md transition-all hover:from-base-600 hover:to-base-700 hover:scale-105"
            title="Odtwórz losowy utwór"
          >
            🎲 Losowy
          </button>

          <button
            type="button"
            onClick={() => {
              const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all'];
              const currentIndex = modes.indexOf(queue.repeat);
              const nextIndex = (currentIndex + 1) % modes.length;
              setRepeat(modes[nextIndex]);
            }}
            className={`rounded-lg px-6 py-3 text-sm font-bold uppercase tracking-wide transition-all hover:scale-105 shadow-md ${
              queue.repeat !== 'none'
                ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-base-950 ring-2 ring-accent-400/50'
                : 'bg-base-700 text-base-100 hover:bg-base-600'
            }`}
            title={`Powtarzanie: ${queue.repeat}`}
          >
            🔁 {queue.repeat === 'one' ? 'Jeden' : queue.repeat === 'all' ? 'Wszystkie' : 'Wyłączone'}
          </button>

          <button
            type="button"
            onClick={() => setShowQueue(!showQueue)}
            className="rounded-lg bg-gradient-to-r from-base-700 to-base-800 px-6 py-3 text-sm font-bold uppercase tracking-wide text-base-100 shadow-md transition-all hover:from-base-600 hover:to-base-700 hover:scale-105"
            title="Pokaż/ukryj kolejkę odtwarzania"
          >
            📋 Kolejka {showQueue ? '▲' : '▼'}
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center justify-center gap-4 rounded-xl bg-base-950/30 p-6 border border-base-700/30">
          <button
            type="button"
            onClick={() => setMuted(!muted)}
            className="rounded-lg bg-gradient-to-br from-base-700 to-base-800 p-3 text-xl transition-all hover:from-base-600 hover:to-base-700 hover:scale-110 shadow-md"
            title={muted ? 'Wyłącz wyciszenie' : 'Wycisz'}
          >
            {muted ? '🔇' : volume > 0.5 ? '🔊' : '🔉'}
          </button>

          <label className="flex flex-1 max-w-md items-center gap-4">
            <span className="text-sm font-bold uppercase tracking-wider text-accent-300">
              Głośność
            </span>
            <div className="relative flex-1">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={muted ? 0 : volume}
                onChange={handleVolumeChange}
                className="h-3 w-full cursor-pointer appearance-none rounded-full bg-base-700 accent-accent-400 transition-all"
                style={{
                  background: `linear-gradient(to right, rgb(var(--color-accent-500)) 0%, rgb(var(--color-accent-500)) ${(muted ? 0 : volume) * 100}%, rgb(var(--color-base-700)) ${(muted ? 0 : volume) * 100}%, rgb(var(--color-base-700)) 100%)`
                }}
              />
            </div>
            <span className="w-16 text-right text-lg font-bold text-base-50">
              {Math.round((muted ? 0 : volume) * 100)}%
            </span>
          </label>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-6 rounded-xl bg-gradient-to-r from-red-900/20 to-red-800/20 border-2 border-red-500/50 px-6 py-4 text-center shadow-lg">
            <p className="text-base font-bold text-red-300 flex items-center justify-center gap-2">
              <span className="text-2xl">⚠️</span>
              <span>Błąd: {error}</span>
            </p>
            <p className="mt-2 text-sm text-red-400">
              Odtwarzacz napotkał problem. Sprawdź połączenie internetowe i spróbuj ponownie.
            </p>
          </div>
        )}
      </div>

      {/* Queue Display */}
      {showQueue && (
        <div className="rounded-2xl bg-gradient-to-br from-base-900/95 to-base-800/95 p-8 backdrop-blur-md border border-base-700/50 shadow-2xl">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-2xl font-bold text-base-50 flex items-center gap-3">
              <span className="text-3xl">📋</span>
              Kolejka odtwarzania
            </h3>
            <span className="rounded-full bg-accent-500/20 px-4 py-2 text-sm font-bold text-accent-300 ring-2 ring-accent-500/30">
              {queue.tracks.length} {queue.tracks.length === 1 ? 'utwór' : 'utworów'}
            </span>
          </div>

          <div
            className="max-h-[500px] space-y-2 overflow-y-auto pr-2"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(var(--color-accent-500), 0.5) rgba(var(--color-base-800), 0.3)'
            }}
          >
            {queue.tracks.map((track, index) => (
              <button
                key={`${track.id}-${index}`}
                type="button"
                onClick={() => jumpTo(index)}
                className={`group w-full rounded-xl px-5 py-4 text-left transition-all duration-200 ${
                  index === queue.currentIndex
                    ? 'bg-gradient-to-r from-accent-500/30 to-accent-600/30 border-2 border-accent-500/60 shadow-lg scale-[1.02]'
                    : 'bg-base-800/60 border border-base-700/30 hover:bg-base-700/80 hover:border-accent-500/30 hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    index === queue.currentIndex
                      ? 'bg-accent-500 text-base-950'
                      : 'bg-base-700 text-base-300 group-hover:bg-base-600'
                  }`}>
                    {index === queue.currentIndex ? '▶' : index + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className={`font-bold truncate ${
                      index === queue.currentIndex ? 'text-accent-100' : 'text-base-100'
                    }`}>
                      {track.title}
                    </p>
                    <p className="text-sm text-base-300 truncate">
                      {track.artist} {track.genre ? `• ${track.genre}` : ''}
                    </p>
                  </div>

                  {index === queue.currentIndex && (
                    <span className="shrink-0 rounded-full bg-accent-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-base-950 shadow-lg animate-pulse">
                      Gra teraz
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
