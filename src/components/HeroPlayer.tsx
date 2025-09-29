import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import clsx from 'clsx';
import Hls from 'hls.js';
import { useTranslation } from 'react-i18next';
import { AudioViz } from './AudioViz';
import type { HlsClient } from '../lib/hlsClient';
import { MAX_RECONNECT_ATTEMPTS, createHlsClient } from '../lib/hlsClient';
import {
  FALLBACK_NOW_PLAYING,
  NowPlaying,
  fetchNowPlaying
} from '../lib/nowPlaying';
import { usePlayerStore } from '../state/player';

const POLLING_INTERVAL = 15_000;

export function HeroPlayer(): JSX.Element {
  const { t } = useTranslation();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<HlsClient | null>(null);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying>(FALLBACK_NOW_PLAYING);

  const {
    playing,
    volume,
    muted,
    status,
    error,
    reconnectCount,
    src,
    setPlaying,
    setVolume,
    setMuted,
    setStatus,
    setError,
    setReconnectCount,
    resetReconnect
  } = usePlayerStore((state) => ({
    playing: state.playing,
    volume: state.volume,
    muted: state.muted,
    status: state.status,
    error: state.error,
    reconnectCount: state.reconnectCount,
    src: state.src,
    setPlaying: state.setPlaying,
    setVolume: state.setVolume,
    setMuted: state.setMuted,
    setStatus: state.setStatus,
    setError: state.setError,
    setReconnectCount: state.setReconnectCount,
    resetReconnect: state.resetReconnect
  }));

  useEffect(() => {
    let isMounted = true;

    const poll = async (): Promise<void> => {
      const metadata = await fetchNowPlaying();
      if (isMounted) {
        setNowPlaying(metadata);
      }
    };

    void poll();
    const intervalId = window.setInterval(poll, POLLING_INTERVAL);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) {
      return;
    }

    if (Hls.isSupported()) {
      const client = createHlsClient(audio, src, {
        onReady: () => {
          setStatus('buffering');
        },
        onReconnectAttempt: (attempt) => {
          setStatus('reconnecting');
          setReconnectCount(attempt);
          setError(null);
        },
        onReconnectSuccess: () => {
          setStatus('buffering');
          resetReconnect();
        },
        onError: (message) => {
          setStatus('error');
          setError(message);
          setPlaying(false);
        }
      });

      hlsRef.current = client;

      return () => {
        client.destroy();
        hlsRef.current = null;
      };
    }

    if (audio.canPlayType('application/vnd.apple.mpegurl')) {
      audio.src = src;
      setStatus('buffering');
      return () => {
        audio.removeAttribute('src');
      };
    }

    audio.src = src;
    setStatus('buffering');

    return () => {
      audio.removeAttribute('src');
    };
  }, [resetReconnect, setError, setPlaying, setReconnectCount, setStatus, src]);

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

  const statusLabel = useMemo(() => {
    switch (status) {
      case 'playing':
        return t('player.live');
      case 'buffering':
        return t('player.buffering');
      case 'reconnecting':
        return t('player.reconnecting', {
          attempt: reconnectCount,
          max: MAX_RECONNECT_ATTEMPTS
        });
      case 'error':
        return t('player.error');
      default:
        return t('player.idle');
    }
  }, [reconnectCount, status, t]);

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
      resetReconnect();
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
    resetReconnect();
    if (hlsRef.current) {
      hlsRef.current.retry();
      return;
    }

    const audio = audioRef.current;
    if (!audio || !src) {
      return;
    }

    audio.load();
    void audio.play().catch(() => {
      setStatus('error');
    });
  };

  return (
    <section
      className="rounded-3xl bg-gradient-to-br from-[#0a0e27] to-[#1a1f3a] p-6 text-base-100 shadow-xl sm:p-10"
      role="region"
      aria-label={t('player.regionLabel')}
    >
      <div className="grid gap-6 lg:grid-cols-[280px,1fr] lg:items-center">
        <div className="relative overflow-hidden rounded-3xl bg-base-900/50">
          <img
            src={nowPlaying.artwork}
            alt={t('player.artworkAlt', { title: nowPlaying.title, artist: nowPlaying.artist })}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-accent-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-base-950">
            <span className="h-2 w-2 rounded-full bg-base-950" aria-hidden="true" />
            {t('player.live')}
          </span>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent-300">
              {t('player.nowPlaying')}
            </p>
            <h2 className="text-3xl font-bold text-base-50 sm:text-4xl">{nowPlaying.title}</h2>
            <p className="text-base-200">{nowPlaying.artist}</p>
          </div>
          <AudioViz
            audio={audioRef.current}
            active={playing}
            ariaLabel={t('player.visualizerAria')}
          />
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleTogglePlay}
                className={clsx(
                  'rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors',
                  playing
                    ? 'bg-accent-500 text-base-950 hover:bg-accent-400'
                    : 'bg-accent-400 text-base-950 hover:bg-accent-300'
                )}
                aria-pressed={playing}
                aria-label={playing ? t('player.pause') : t('player.play')}
              >
                {playing ? t('player.pause') : t('player.play')}
              </button>
              <button
                type="button"
                onClick={handleMuteToggle}
                className="rounded-full border border-base-700 px-4 py-2 text-sm text-base-100 transition-colors hover:border-accent-400 hover:text-accent-200"
                aria-pressed={muted}
                aria-label={muted ? t('player.unmute') : t('player.mute')}
              >
                {muted ? t('player.unmute') : t('player.mute')}
              </button>
              <span className="rounded-full border border-base-800 px-3 py-1 text-xs uppercase tracking-wide text-base-200">
                {t('player.quality_128kbps')}
              </span>
            </div>
            <label className="flex w-full flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-base-200 lg:w-64">
              {t('player.volume')}
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={muted ? 0 : volume}
                onChange={handleVolumeChange}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-base-800 accent-accent-400"
                aria-valuemin={0}
                aria-valuemax={1}
                aria-valuenow={Number((muted ? 0 : volume).toFixed(2))}
                aria-label={t('player.volume')}
              />
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-base-200">
            <p role="status" aria-live="polite" className="font-semibold text-base-100">
              {statusLabel}
            </p>
            {status === 'error' && (
              <>
                <span className="text-base-400" role="alert">
                  {error}
                </span>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="rounded-full border border-accent-400 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-accent-200 transition-colors hover:bg-accent-400/10"
                >
                  {t('player.retry')}
                </button>
              </>
            )}
          </div>
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
