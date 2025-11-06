/**
 * MusicPlayer Component
 *
 * Advanced music player with automatic track discovery
 * - Auto-discovers tracks in format /music/utworXXX.mp3 (001-500)
 * - Shuffle/random playback
 * - Queue management
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

const TOTAL_TRACKS = 500;

/**
 * Generate track list for utwor001.mp3 to utwor500.mp3
 */
function generateTrackList(): AudioTrack[] {
  const tracks: AudioTrack[] = [];

  for (let i = 1; i <= TOTAL_TRACKS; i++) {
    const trackNum = String(i).padStart(3, '0');
    tracks.push({
      id: `utwor-${trackNum}`,
      title: `Utwór ${trackNum}`,
      artist: 'Radio Adamowo',
      album: 'Music Collection',
      url: `/music/utwor${trackNum}.mp3`,
      coverUrl: '/images/Icon.jpg',
      genre: 'Various',
      category: 'Music',
    });
  }

  return tracks;
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

  // Generate all tracks
  const allTracks = useMemo(() => generateTrackList(), []);

  // Initialize queue with all tracks
  useEffect(() => {
    if (queue.tracks.length === 0) {
      setQueue(allTracks);
    }
  }, [allTracks, queue.tracks.length, setQueue]);

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


  return (
    <div className="space-y-6">
      {/* Audio Engine (headless) */}
      <AudioEngine />

      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-br from-base-900/80 to-base-800/80 p-6 backdrop-blur-sm">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-base-50 sm:text-4xl">
              {t('pages.lab.title', 'Lab')}
            </h1>
            <p className="mt-2 text-base-200">
              Music Player - {TOTAL_TRACKS} dostępnych utworów
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-base-300">
              Status: <span className="font-semibold text-accent-400">{status}</span>
            </p>
            <p className="text-sm text-base-300">
              Kolejka: {queue.tracks.length} utworów
            </p>
          </div>
        </div>
      </div>

      {/* Player Card */}
      <div className="rounded-2xl bg-gradient-to-br from-base-900 to-base-800 p-8 shadow-xl">
        {/* Current Track Info */}
        <div className="mb-6 grid gap-6 lg:grid-cols-[200px,1fr]">
          {/* Album Art */}
          <div className="overflow-hidden rounded-xl bg-base-950/50 shadow-lg">
            <img
              src={currentTrack?.coverUrl || '/images/Icon.jpg'}
              alt={currentTrack?.title || 'No track'}
              className="h-full w-full object-cover"
              width={200}
              height={200}
            />
          </div>

          {/* Track Details */}
          <div className="flex flex-col justify-center space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent-400">
              Now Playing
            </p>
            <h2 className="text-2xl font-bold text-base-50">
              {currentTrack?.title || 'Wybierz utwór'}
            </h2>
            <p className="text-base-200">
              {currentTrack?.artist || 'Radio Adamowo'}
            </p>
            {currentTrack?.album && (
              <p className="text-sm text-base-300">
                Album: {currentTrack.album}
              </p>
            )}
          </div>
        </div>

        {/* Visualizer */}
        <div className="mb-6">
          <AudioVisualizer height={100} />
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 w-full overflow-hidden rounded-full bg-base-800">
            <div
              className="h-full bg-gradient-to-r from-accent-500 to-accent-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={previous}
            className="rounded-full bg-base-700 px-6 py-3 text-sm font-semibold text-base-100 transition-all hover:bg-base-600 hover:scale-105"
            disabled={queue.currentIndex === 0 && queue.repeat === 'none'}
          >
            ⏮ Previous
          </button>

          <button
            type="button"
            onClick={next}
            className="rounded-full bg-accent-500 px-8 py-4 text-base font-bold text-base-950 transition-all hover:bg-accent-400 hover:scale-110 hover:shadow-xl"
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>

          <button
            type="button"
            onClick={next}
            className="rounded-full bg-base-700 px-6 py-3 text-sm font-semibold text-base-100 transition-all hover:bg-base-600 hover:scale-105"
          >
            Next ⏭
          </button>
        </div>

        {/* Secondary Controls */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleShuffle}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all hover:scale-105 ${
              queue.shuffle
                ? 'bg-accent-500 text-base-950'
                : 'bg-base-700 text-base-100 hover:bg-base-600'
            }`}
          >
            🔀 Shuffle {queue.shuffle ? 'ON' : 'OFF'}
          </button>

          <button
            type="button"
            onClick={handlePlayRandom}
            className="rounded-full bg-base-700 px-5 py-2 text-sm font-semibold text-base-100 transition-all hover:bg-base-600 hover:scale-105"
          >
            🎲 Losowy utwór
          </button>

          <button
            type="button"
            onClick={() => {
              const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all'];
              const currentIndex = modes.indexOf(queue.repeat);
              const nextIndex = (currentIndex + 1) % modes.length;
              setRepeat(modes[nextIndex]);
            }}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all hover:scale-105 ${
              queue.repeat !== 'none'
                ? 'bg-accent-500 text-base-950'
                : 'bg-base-700 text-base-100 hover:bg-base-600'
            }`}
          >
            🔁 Repeat: {queue.repeat.toUpperCase()}
          </button>

          <button
            type="button"
            onClick={() => setShowQueue(!showQueue)}
            className="rounded-full bg-base-700 px-5 py-2 text-sm font-semibold text-base-100 transition-all hover:bg-base-600 hover:scale-105"
          >
            📋 {showQueue ? 'Hide' : 'Show'} Queue
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setMuted(!muted)}
            className="rounded-full bg-base-700 px-4 py-2 text-sm text-base-100 transition-all hover:bg-base-600"
          >
            {muted ? '🔇' : volume > 0.5 ? '🔊' : '🔉'}
          </button>

          <label className="flex w-64 items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-base-200">
              Volume
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={muted ? 0 : volume}
              onChange={handleVolumeChange}
              className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-base-700 accent-accent-400"
            />
            <span className="w-12 text-right text-sm font-semibold text-base-100">
              {Math.round((muted ? 0 : volume) * 100)}%
            </span>
          </label>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-center">
            <p className="text-sm font-semibold text-red-400">
              Error: {error}
            </p>
          </div>
        )}
      </div>

      {/* Queue Display */}
      {showQueue && (
        <div className="rounded-2xl bg-base-900/80 p-6 backdrop-blur-sm">
          <h3 className="mb-4 text-xl font-bold text-base-50">
            Kolejka odtwarzania ({queue.tracks.length} utworów)
          </h3>
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {queue.tracks.slice(0, 50).map((track, index) => (
              <button
                key={track.id}
                type="button"
                onClick={() => jumpTo(index)}
                className={`w-full rounded-lg px-4 py-3 text-left transition-all hover:bg-base-800 ${
                  index === queue.currentIndex
                    ? 'bg-accent-500/20 border border-accent-500/50'
                    : 'bg-base-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-base-100">
                      {index === queue.currentIndex && '▶ '}
                      {track.title}
                    </p>
                    <p className="text-sm text-base-300">{track.artist}</p>
                  </div>
                  {index === queue.currentIndex && (
                    <span className="rounded-full bg-accent-500 px-3 py-1 text-xs font-bold text-base-950">
                      PLAYING
                    </span>
                  )}
                </div>
              </button>
            ))}
            {queue.tracks.length > 50 && (
              <p className="py-3 text-center text-sm text-base-400">
                ... i {queue.tracks.length - 50} więcej utworów
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
