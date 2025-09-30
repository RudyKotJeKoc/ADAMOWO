import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { Episode } from './data.schema';

export type AnalysisPlayerHandle = {
  seekTo: (seconds: number) => void;
};

type AnalysisPlayerProps = {
  episode: Episode | null;
};

function formatTime(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds)) {
    return '0:00';
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, '0');

  return `${minutes}:${seconds}`;
}

export const AnalysisPlayer = forwardRef<AnalysisPlayerHandle, AnalysisPlayerProps>(function AnalysisPlayer(
  { episode },
  ref
) {
  const { t } = useTranslation();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const statusRef = useRef<HTMLSpanElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(episode?.durationSec ?? 0);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);

  useImperativeHandle(ref, () => ({
    seekTo(seconds: number) {
      const audio = audioRef.current;
      if (!audio) {
        return;
      }

      audio.currentTime = Math.min(Math.max(seconds, 0), audio.duration || seconds);
      setCurrentTime(audio.currentTime);
    }
  }));

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const handleLoaded = () => {
      const metaDuration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : null;
      setDuration(metaDuration ?? episode?.durationSec ?? 0);
      setCurrentTime(0);
      setIsPlaying(false);
    };

    const handleTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', handleLoaded);
    audio.addEventListener('timeupdate', handleTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoaded);
      audio.removeEventListener('timeupdate', handleTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [episode?.id, episode?.durationSec]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.volume = isMuted ? 0 : volume;
    audio.muted = isMuted;
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (episode) {
      audio.src = episode.audioUrl;
      audio.load();
      setCurrentTime(0);
      setDuration(episode.durationSec ?? 0);
      setIsPlaying(false);
    } else {
      audio.pause();
      audio.removeAttribute('src');
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
    }
  }, [episode]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const playPromise = async () => {
      try {
        if (isPlaying) {
          await audio.play();
          statusRef.current?.setAttribute('data-status', 'playing');
        } else {
          audio.pause();
          statusRef.current?.setAttribute('data-status', 'paused');
        }
      } catch (error) {
        console.warn('[analysis-player] Failed to toggle playback', error);
      }
    };

    void playPromise();
  }, [isPlaying]);

  const chapterMarkers = useMemo(() => {
    if (!episode?.chapters || duration === 0) {
      return [];
    }

    return episode.chapters.map((chapter) => ({
      ...chapter,
      position: Math.min(100, Math.max(0, (chapter.startSec / duration) * 100))
    }));
  }, [episode?.chapters, duration]);

  const handleSeek = (value: number) => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.currentTime = value;
    setCurrentTime(value);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const togglePlay = () => {
    if (!episode) {
      return;
    }

    setIsPlaying((prev) => !prev);
  };

  return (
    <section
      className="rounded-2xl border border-base-700 bg-[radial-gradient(circle_at_top,_#1a1f3a,_#080b1e)] p-6 text-base-50 shadow-lg shadow-indigo-950/40"
      role="region"
      aria-labelledby="analysis-player-heading"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 id="analysis-player-heading" className="text-xl font-semibold text-accent-300">
              {t('analysis.player.title')}
            </h2>
            <p className="text-sm text-base-200" aria-live="polite" ref={statusRef}>
              {episode ? t('analysis.player.nowPlaying', { title: episode.title }) : t('analysis.player.idle')}
            </p>
          </div>
          <button
            type="button"
            onClick={togglePlay}
            disabled={!episode}
            className="rounded-full border border-accent-400 px-5 py-2 text-sm font-semibold text-accent-200 transition hover:bg-accent-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 disabled:cursor-not-allowed disabled:border-base-600 disabled:text-base-400"
            aria-pressed={isPlaying}
          >
            {isPlaying ? t('analysis.player.pause') : t('analysis.player.play')}
          </button>
        </div>

        <div className="relative">
          <label className="flex flex-col gap-2" htmlFor="analysis-progress">
            <span className="sr-only">{t('analysis.player.progress')}</span>
            <input
              id="analysis-progress"
              type="range"
              min={0}
              max={duration || 0}
              step={1}
              value={Number.isFinite(currentTime) ? currentTime : 0}
              onChange={(event) => handleSeek(Number(event.target.value))}
              className="w-full accent-accent-400"
              aria-valuemin={0}
              aria-valuemax={duration || 0}
              aria-valuenow={Number.isFinite(currentTime) ? currentTime : 0}
              aria-label={t('analysis.player.progress')}
            />
          </label>
          <div className="pointer-events-none absolute inset-x-4 top-1/2 -translate-y-1/2">
            {chapterMarkers.map((chapter) => (
              <span
                key={chapter.title}
                className="absolute h-3 w-3 -translate-y-1/2 rounded-full border border-accent-400 bg-accent-500/60 shadow"
                style={{ left: `${chapter.position}%` }}
                aria-hidden="true"
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-base-300">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleMute}
              className="rounded-md border border-base-700 px-3 py-1 text-xs uppercase tracking-wide text-base-200 transition hover:border-accent-400 hover:text-accent-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
              aria-pressed={isMuted}
              aria-label={isMuted ? t('analysis.player.unmute') : t('analysis.player.mute')}
            >
              {isMuted ? t('analysis.player.unmute') : t('analysis.player.mute')}
            </button>
            <label className="flex items-center gap-2 text-xs text-base-300" htmlFor="analysis-volume">
              <span>{t('analysis.player.volume')}</span>
              <input
                id="analysis-volume"
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(event) => setVolume(Number(event.target.value))}
                className="accent-accent-400"
                aria-valuemin={0}
                aria-valuemax={1}
                aria-valuenow={isMuted ? 0 : volume}
                aria-label={t('analysis.player.volume')}
              />
            </label>
          </div>
          {episode?.chapters && episode.chapters.length > 0 ? (
            <div className="flex items-center gap-2 text-xs text-base-200">
              <span>{t('analysis.player.chapters')}</span>
              <div className="flex gap-1">
                {episode.chapters.map((chapter) => (
                  <span
                    key={chapter.title}
                    className="inline-block rounded-full border border-accent-400 px-2 py-0.5 text-[10px] uppercase tracking-wide text-accent-200"
                  >
                    {formatTime(chapter.startSec)}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <audio ref={audioRef} className="hidden" aria-hidden="true" />
    </section>
  );
});
