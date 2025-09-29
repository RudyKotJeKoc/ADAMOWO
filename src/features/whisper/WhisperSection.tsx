import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import whisperAudio from '../../assets/audio/whisper-2017.mp3';
import { WhisperCurtain } from './WhisperCurtain';
import './whisper.css';

const FALLBACK_DURATION = 12 * 60 + 34; // 12 minutes 34 seconds
const STORAGE_KEY = 'whisper-playback-position';

const formatTime = (value: number): string => {
  const safeValue = Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0;
  const minutes = Math.floor(safeValue / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(safeValue % 60)
    .toString()
    .padStart(2, '0');

  return `${minutes}:${seconds}`;
};

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

export function WhisperSection(): JSX.Element {
  const { t } = useTranslation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(FALLBACK_DURATION);
  const [currentTime, setCurrentTime] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  const audioSource = useMemo(() => {
    const envSource = import.meta.env.VITE_WHISPER_AUDIO_URL;
    return envSource && envSource.length > 0 ? envSource : whisperAudio;
  }, []);

  const ethicsItems = useMemo(
    () => t('whisper.ethics.body', { returnObjects: true }) as string[],
    [t]
  );

  useEffect(() => {
    setStatusMessage(t('whisper.status.paused'));
  }, [t]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const handleLoadedMetadata = () => {
      const loadedDuration = Number.isFinite(audio.duration) ? audio.duration : FALLBACK_DURATION;
      setDuration(loadedDuration);

      if (typeof window !== 'undefined') {
        const saved = window.sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
          const savedPosition = Number.parseFloat(saved);
          if (Number.isFinite(savedPosition) && savedPosition < loadedDuration && savedPosition >= 0) {
            audio.currentTime = savedPosition;
            setCurrentTime(savedPosition);
          }
        }
      }
    };

    const handleTimeUpdate = () => {
      const time = audio.currentTime;
      setCurrentTime(time);
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(STORAGE_KEY, time.toString());
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setStatusMessage(t('whisper.status.playing'));
    };

    const handlePause = () => {
      setIsPlaying(false);
      if (!audio.ended) {
        setStatusMessage(t('whisper.status.paused'));
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setStatusMessage(t('whisper.status.ended'));
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(STORAGE_KEY);
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [t]);

  const handlePlayPause = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (isPlaying) {
      audio.pause();
      return;
    }

    try {
      await audio.play();
      setStatusMessage(t('whisper.status.playing'));
    } catch (error) {
      // Playback may be blocked by the browser until user interaction.
      setStatusMessage(t('whisper.status.error'));
      // eslint-disable-next-line no-console
      console.error('Unable to play the audio file.', error);
    }
  }, [isPlaying, t]);

  const handleRestart = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.currentTime = 0;
    setCurrentTime(0);
    setStatusMessage(t('whisper.status.restarted'));

    if (isPlaying) {
      try {
        await audio.play();
      } catch (error) {
        setStatusMessage(t('whisper.status.error'));
        // eslint-disable-next-line no-console
        console.error('Unable to resume playback.', error);
      }
    }
  }, [isPlaying, t]);

  const handleSeek = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const audio = audioRef.current;
      if (!audio) {
        return;
      }

      const value = Number.parseFloat(event.target.value);
      if (!Number.isFinite(value)) {
        return;
      }

      audio.currentTime = value;
      setCurrentTime(value);
      setStatusMessage(t('whisper.status.seeked'));
    },
    [t]
  );

  const handleVolumeChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const audio = audioRef.current;
      if (!audio) {
        return;
      }

      const value = Number.parseFloat(event.target.value);
      if (!Number.isFinite(value)) {
        return;
      }

      audio.volume = value;
      setVolume(value);
      const muted = value === 0;
      audio.muted = muted;
      setIsMuted(muted);
      setStatusMessage(muted ? t('whisper.status.muted') : t('whisper.status.volume'));
    },
    [t]
  );

  const handleMuteToggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const nextMuted = !isMuted;
    audio.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted && audio.volume === 0) {
      audio.volume = 0.5;
      setVolume(0.5);
    }
    setStatusMessage(nextMuted ? t('whisper.status.muted') : t('whisper.status.unmuted'));
  }, [isMuted, t]);

  return (
    <section
      aria-label={t('whisper.regionLabel')}
      className="whisper-section relative isolate overflow-hidden rounded-3xl border border-white/10 p-6 text-base-50 shadow-xl ring-1 ring-base-800/60 sm:p-10"
      role="region"
    >
      <WhisperCurtain reducedMotion={prefersReducedMotion} />
      <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-start">
        <div className="max-w-xl space-y-4">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.3em] text-accent-400">{t('whisper.length')}</p>
            <h2 className="font-display text-3xl font-semibold text-base-50 sm:text-4xl">{t('whisper.title')}</h2>
            <p className="text-base text-base-100 sm:text-lg">{t('whisper.subtitle')}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <h3 className="font-medium text-accent-300">{t('whisper.ethics.title')}</h3>
            <ul className="mt-3 space-y-2 text-sm text-base-100">
              {ethicsItems.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span aria-hidden="true" className="mt-1 inline-flex h-2 w-2 rounded-full bg-accent-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="w-full max-w-md space-y-4 rounded-2xl border border-white/10 bg-base-900/70 p-5 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              className="inline-flex items-center justify-center rounded-full bg-accent-500 px-5 py-2 text-sm font-semibold text-base-50 shadow-lg shadow-accent-500/30 transition hover:bg-accent-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
              onClick={handlePlayPause}
              type="button"
            >
              {isPlaying ? t('whisper.pause') : t('whisper.play')}
            </button>
            <button
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-base-100 transition hover:border-accent-500/80 hover:text-base-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
              onClick={handleRestart}
              type="button"
            >
              {t('whisper.restart')}
            </button>
            <button
              aria-pressed={isMuted}
              className="ml-auto inline-flex items-center justify-center rounded-full border border-white/20 p-2 text-sm font-medium text-base-100 transition hover:border-accent-500/80 hover:text-base-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
              onClick={handleMuteToggle}
              type="button"
            >
              {isMuted ? t('whisper.unmute') : t('whisper.mute')}
            </button>
          </div>
          <div className="space-y-3">
            <label className="block text-xs uppercase tracking-wide text-base-200" htmlFor="whisper-progress">
              {t('whisper.scrub')}
            </label>
            <input
              aria-label={t('whisper.scrub')}
              aria-valuemax={Math.round(duration)}
              aria-valuemin={0}
              aria-valuenow={Math.round(currentTime)}
              aria-valuetext={formatTime(currentTime)}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-base-800 accent-accent-500"
              id="whisper-progress"
              max={duration}
              min={0}
              onChange={handleSeek}
              step={1}
              type="range"
              value={currentTime}
            />
            <div className="flex justify-between text-xs text-base-200">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          <div className="space-y-3">
            <label className="block text-xs uppercase tracking-wide text-base-200" htmlFor="whisper-volume">
              {t('whisper.volume')}
            </label>
            <input
              aria-label={t('whisper.volume')}
              aria-valuemax={1}
              aria-valuemin={0}
              aria-valuenow={Number(volume.toFixed(2))}
              aria-valuetext={`${Math.round(volume * 100)}%`}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-base-800 accent-accent-500"
              id="whisper-volume"
              max={1}
              min={0}
              onChange={handleVolumeChange}
              step={0.01}
              type="range"
              value={volume}
            />
            <div className="flex justify-between text-xs text-base-200">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
          <div aria-live="polite" className="text-xs text-base-200">
            {statusMessage}
          </div>
          <audio
            aria-hidden="true"
            preload="metadata"
            ref={audioRef}
            src={audioSource}
          />
        </div>
      </div>
    </section>
  );
}
