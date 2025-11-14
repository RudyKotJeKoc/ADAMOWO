import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import type { JSX } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { AudioViz } from './AudioViz';
import { Tooltip } from './Tooltip';
import type { LocalAudioClient, Track } from '../lib/localAudioClient';
import { createLocalAudioClient } from '../lib/localAudioClient';
import { FALLBACK_NOW_PLAYING, getNowPlaying, subscribeNowPlaying } from '../data/nowPlaying';
import type { NowPlaying } from '../data/types';
import { usePlayerStore } from '../state/player';

/**
 * Interval in milliseconds for polling now playing metadata.
 *
 * @internal
 */
const POLLING_INTERVAL = 15_000;

/**
 * Maps error messages to user-friendly localized strings.
 *
 * Analyzes error strings and returns appropriate translation keys based on
 * error type (network, permission, timeout, media, etc.). Falls back to
 * a generic error message if no specific match is found.
 *
 * @param error - Raw error message string or null
 * @param t - i18n translation function
 * @returns Localized user-friendly error message
 *
 * @internal
 */
const getErrorMessage = (error: string | null, t: (key: string) => string): string => {
  if (!error) return '';

  if (error.includes('network') || error.includes('Network')) {
    return t('player.errors.network');
  }
  if (error.includes('not supported') || error.includes('NotSupported')) {
    return t('player.errors.notSupported');
  }
  if (error.includes('permission') || error.includes('Permission')) {
    return t('player.errors.permission');
  }
  if (error.includes('timeout') || error.includes('Timeout')) {
    return t('player.errors.timeout');
  }
  if (error.includes('Media error') || error.includes('MEDIA')) {
    return t('player.errors.media');
  }
  if (error.includes('Maximum reconnect')) {
    return t('player.errors.maxRetries');
  }

  return t('player.errors.generic');
};

/**
 * Detects user's reduced motion preference.
 *
 * Listens to the prefers-reduced-motion media query and returns true when
 * the user has requested reduced motion. Automatically updates when the
 * system preference changes.
 *
 * @returns True if user prefers reduced motion, false otherwise
 *
 * @internal
 */
const usePrefersReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => {
      setPrefersReducedMotion(query.matches);
    };

    updatePreference();
    query.addEventListener('change', updatePreference);

    return () => {
      query.removeEventListener('change', updatePreference);
    };
  }, []);

  return prefersReducedMotion;
};

/**
 * Hero audio player component with live stream playback and visualization.
 *
 * A comprehensive audio player featuring:
 * - Live stream playback with playlist support via LocalAudioClient
 * - Real-time now playing metadata with polling and subscription
 * - Visual audio waveform visualization
 * - Play/pause, volume, and mute controls
 * - Keyboard shortcuts (Space, M, Arrow Up/Down)
 * - Error handling with user-friendly messages and retry functionality
 * - Responsive layout with album artwork and track information
 * - Accessibility features (ARIA labels, status announcements)
 * - State persistence via Zustand store
 *
 * The player polls for metadata every 15 seconds and subscribes to real-time
 * updates when available. It respects the user's reduced motion preferences
 * for animations.
 *
 * @returns A section element containing the live audio player interface
 */
export function HeroPlayer(): JSX.Element {
  const { t } = useTranslation();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioClientRef = useRef<LocalAudioClient | null>(null);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying>(FALLBACK_NOW_PLAYING);
  const prefersReducedMotion = usePrefersReducedMotion();

  const {
    playing,
    volume,
    muted,
    status,
    error,
    playlistUrl,
    currentTrack,
    setPlaying,
    setVolume,
    setMuted,
    setStatus,
    setError,
    setCurrentTrack
  } = usePlayerStore((state) => ({
    playing: state.playing,
    volume: state.volume,
    muted: state.muted,
    status: state.status,
    error: state.error,
    playlistUrl: state.playlistUrl,
    currentTrack: state.currentTrack,
    setPlaying: state.setPlaying,
    setVolume: state.setVolume,
    setMuted: state.setMuted,
    setStatus: state.setStatus,
    setError: state.setError,
    setCurrentTrack: state.setCurrentTrack
  }));

  useEffect(() => {
    let isMounted = true;
    const unsubscribe = subscribeNowPlaying((payload) => {
      if (isMounted) {
        setNowPlaying(payload);
      }
    });

    const poll = async (): Promise<void> => {
      try {
        const metadata = await getNowPlaying();
        if (isMounted) {
          setNowPlaying(metadata);
        }
      } catch (error) {
        console.error('Failed to load Now Playing metadata', error);
        if (isMounted) {
          setNowPlaying(FALLBACK_NOW_PLAYING);
        }
      }
    };

    void poll();
    const intervalId = window.setInterval(poll, POLLING_INTERVAL);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !playlistUrl) {
      return;
    }

    const client = createLocalAudioClient(audio, playlistUrl, {
      onReady: () => {
        setStatus('buffering');
      },
      onTrackChange: (track: Track) => {
        setCurrentTrack({
          id: track.id,
          title: track.title,
          artist: track.artist,
          url: track.url,
          coverUrl: track.coverUrl
        });
        setError(null);
      },
      onPlaylistLoaded: (tracks: Track[]) => {
        console.log(`Playlist loaded with ${tracks.length} tracks`);
      },
      onError: (message) => {
        setStatus('error');
        setError(message);
        setPlaying(false);
      }
    });

    audioClientRef.current = client;

    return () => {
      client.destroy();
      audioClientRef.current = null;
    };
  }, [playlistUrl, setError, setPlaying, setStatus, setCurrentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.volume = muted ? 0 : volume;
    audio.muted = muted;
  }, [muted, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const handlePlay = (): void => {
      setStatus('playing');
      setPlaying(true);
      setError(null);
    };

    const handlePause = (): void => {
      setPlaying(false);
      if (!audio.error) {
        setStatus('idle');
      }
    };

    const handleWaiting = (): void => {
      setStatus('buffering');
    };

    const handleError = (): void => {
      const mediaError = audio.error
        ? `Media error: ${audio.error.code}`
        : 'Playback error';
      setError(mediaError);
      setStatus('error');
      setPlaying(false);
    };

    const handleEnded = (): void => {
      setPlaying(false);
      setStatus('idle');
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('playing', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('playing', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [setError, setPlaying, setStatus]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      const audio = audioRef.current;
      if (!audio) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case ' ':
          event.preventDefault();
          if (playing) {
            audio.pause();
            setPlaying(false);
            setStatus('idle');
          } else {
            setError(null);
            setStatus('buffering');
            void audio.play().then(() => setPlaying(true)).catch(() => {
              setStatus('error');
              setError('Playback failed');
            });
          }
          break;
        case 'm':
          event.preventDefault();
          const nextMuted = !muted;
          setMuted(nextMuted);
          audio.muted = nextMuted;
          if (!nextMuted && audio.volume === 0) {
            audio.volume = 0.5;
            setVolume(0.5);
          }
          break;
        case 'arrowup':
          event.preventDefault();
          const newVolumeUp = Math.min(1, volume + 0.1);
          setVolume(newVolumeUp);
          audio.volume = newVolumeUp;
          if (muted) {
            setMuted(false);
            audio.muted = false;
          }
          break;
        case 'arrowdown':
          event.preventDefault();
          const newVolumeDown = Math.max(0, volume - 0.1);
          setVolume(newVolumeDown);
          audio.volume = newVolumeDown;
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [playing, muted, volume, setVolume, setMuted, setPlaying, setStatus, setError]);

  const statusLabel = useMemo(() => {
    switch (status) {
      case 'playing':
        return currentTrack ? `${currentTrack.artist} - ${currentTrack.title}` : t('player.playing');
      case 'buffering':
        return t('player.buffering');
      case 'error':
        return t('player.error');
      default:
        return t('player.idle');
    }
  }, [currentTrack, status, t]);

  const handleTogglePlay = async (): Promise<void> => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (playing) {
      audio.pause();
      setPlaying(false);
      setStatus('idle');
      return;
    }

    try {
      setError(null);
      setStatus('buffering');
      await audio.play();
      setPlaying(true);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Playback failed');
    }
  };

  const handleVolumeChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = Number(event.target.value);
    setVolume(value);
    const audio = audioRef.current;
    if (audio) {
      audio.volume = value;
    }
    if (value === 0) {
      setMuted(true);
    } else if (muted) {
      setMuted(false);
      if (audio) {
        audio.muted = false;
      }
    }
  };

  const handleMuteToggle = (): void => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const nextMuted = !muted;
    setMuted(nextMuted);
    audio.muted = nextMuted;
    if (!nextMuted && audio.volume === 0) {
      audio.volume = 0.5;
      setVolume(0.5);
    }
  };

  const handleRetry = (): void => {
    setError(null);
    setStatus('buffering');

    if (audioClientRef.current) {
      audioClientRef.current.retry();
      return;
    }

    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.load();
    void audio.play().catch(() => {
      setStatus('error');
    });
  };

  const nowPlayingDetails = useMemo(() => {
    if (nowPlaying.artist) {
      return nowPlaying.track ? `${nowPlaying.artist} – ${nowPlaying.track}` : nowPlaying.artist;
    }

    if (nowPlaying.track) {
      return nowPlaying.track;
    }

    return t('player.live');
  }, [nowPlaying.artist, nowPlaying.track, t]);

  const artworkAlt = useMemo(
    () =>
      t('player.artworkAlt', {
        title: nowPlaying.title,
        artist: nowPlaying.artist ?? nowPlayingDetails
      }),
    [nowPlaying.artist, nowPlaying.title, nowPlayingDetails, t]
  );

  const friendlyErrorMessage = useMemo(
    () => getErrorMessage(error, t),
    [error, t]
  );

  return (
    <section
      className="rounded-3xl bg-gradient-to-br from-[#0a0e27] to-[#1a1f3a] p-6 text-base-100 shadow-xl sm:p-10 transition-all duration-300"
      role="region"
      aria-label={t('player.regionLabel')}
    >
      <div className="grid gap-6 lg:grid-cols-[280px,1fr] lg:items-center">
        <div className="relative overflow-hidden rounded-3xl bg-base-900/50 shadow-lg">
          <img
            src={nowPlaying.coverUrl ?? FALLBACK_NOW_PLAYING.coverUrl}
            alt={artworkAlt}
            className="h-full w-full object-cover transition-opacity duration-300"
            loading="lazy"
            decoding="async"
            width={640}
            height={640}
          />
          <Tooltip content={t('player.tooltips.live')}>
            <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-accent-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-base-950 shadow-md">
              <span
                className="h-2 w-2 rounded-full bg-base-950 animate-pulse"
                aria-hidden="true"
              />
              {t('player.live')}
            </span>
          </Tooltip>
          {status === 'buffering' && (
            <div className="absolute inset-0 flex items-center justify-center bg-base-950/60 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent-500 border-t-transparent" />
                <p className="text-sm font-medium">{t('player.status.buffering')}</p>
              </div>
            </div>
          )}
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent-300">
              {t('player.nowPlaying')}
            </p>
            <h2 className="text-3xl font-bold text-base-50 sm:text-4xl">{nowPlaying.title}</h2>
            <p className="text-base-200">{nowPlayingDetails}</p>
          </div>
          <Tooltip content={t('player.tooltips.visualizer')}>
            <div>
              <AudioViz
                audio={audioRef.current}
                active={playing && !prefersReducedMotion}
                ariaLabel={t('player.visualizerAria')}
              />
            </div>
          </Tooltip>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleTogglePlay}
                disabled={status === 'error'}
                className={clsx(
                  'touch-target rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-all duration-200 shadow-lg',
                  playing
                    ? 'bg-accent-500 text-base-950 hover:bg-accent-400 hover:shadow-xl hover:scale-105'
                    : 'bg-accent-400 text-base-950 hover:bg-accent-300 hover:shadow-xl hover:scale-105',
                  status === 'error' && 'opacity-50 cursor-not-allowed'
                )}
                aria-pressed={playing}
                aria-label={playing ? t('player.pause') : t('player.play')}
              >
                {playing ? t('player.pause') : t('player.play')}
              </button>
              <button
                type="button"
                onClick={handleMuteToggle}
                className="touch-target rounded-full border border-base-700 px-4 py-2 text-sm text-base-100 transition-all duration-200 hover:border-accent-400 hover:text-accent-200 hover:scale-105"
                aria-pressed={muted}
                aria-label={muted ? t('player.unmute') : t('player.mute')}
              >
                {muted ? t('player.unmute') : t('player.mute')}
              </button>
              <Tooltip content={t('player.tooltips.quality')}>
                <span className="rounded-full border border-base-800 px-3 py-1 text-xs uppercase tracking-wide text-base-200 cursor-help">
                  {t('player.quality_128kbps')}
                </span>
              </Tooltip>
            </div>
            <Tooltip content={t('player.tooltips.volume')}>
              <label className="flex w-full flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-base-200 lg:w-64">
                {t('player.volume')}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={muted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-base-800 accent-accent-400 transition-all"
                  aria-valuemin={0}
                  aria-valuemax={1}
                  aria-valuenow={Number((muted ? 0 : volume).toFixed(2))}
                  aria-label={t('player.volume')}
                  aria-orientation="horizontal"
                />
              </label>
            </Tooltip>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-base-200">
            <p role="status" aria-live="polite" className="font-semibold text-base-100">
              {statusLabel}
            </p>
            {status === 'error' && (
              <>
                <span className="text-accent-300 bg-accent-500/10 px-3 py-1 rounded-full text-xs" role="alert">
                  {friendlyErrorMessage}
                </span>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="touch-target rounded-full border-2 border-accent-400 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-accent-200 transition-all duration-200 hover:bg-accent-400/20 hover:scale-105"
                >
                  {t('player.retry')}
                </button>
              </>
            )}
          </div>
          <details className="mt-2">
            <summary className="cursor-pointer text-xs text-base-400 hover:text-accent-300 transition-colors">
              {t('player.keyboard.info')}
            </summary>
            <ul className="mt-2 space-y-1 text-xs text-base-300 pl-4">
              <li>{t('player.keyboard.space')}</li>
              <li>{t('player.keyboard.m')}</li>
              <li>{t('player.keyboard.up')}</li>
              <li>{t('player.keyboard.down')}</li>
            </ul>
          </details>
        </div>
      </div>
      <audio
        ref={audioRef}
        preload="none"
        crossOrigin="anonymous"
        aria-hidden="true"
      />
    </section>
  );
}
