import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, ReactElement } from 'react';
import Hls from 'hls.js';

export interface VideoChapter {
  id: string;
  title: string;
  time: number;
  summary?: string;
}

export interface SubtitleTrack {
  id: string;
  label: string;
  src: string;
  srclang: string;
  kind?: SubtitleTrackKind;
  default?: boolean;
}

export interface PlayerStatusMessages {
  loading: string;
  error: string;
  noSource: string;
}

export interface PlayerLabels {
  controlsGroup: string;
  play: string;
  pause: string;
  mute: string;
  unmute: string;
  subtitlesOn: string;
  subtitlesOff: string;
  enterFullscreen: string;
  exitFullscreen: string;
  progress: string;
  volume: string;
  volumeIndicator: (value: number) => string;
  subtitlesUnavailable: string;
  chapterHeading: string;
  chapterCurrent: string;
  getChapterAriaLabel?: (chapter: VideoChapter, formattedTime: string) => string;
}

interface VideoPlayerProps {
  title: string;
  hlsSrc?: string;
  mp4Src?: string;
  poster?: string;
  chapters: VideoChapter[];
  subtitleTracks?: SubtitleTrack[];
  statusMessages: PlayerStatusMessages;
  labels: PlayerLabels;
}

type PlayerStatus = 'idle' | 'loading' | 'ready' | 'error' | 'no-source';
type SubtitleTrackKind = 'subtitles' | 'captions';

const formatTime = (seconds: number): string => {
  if (!Number.isFinite(seconds)) {
    return '0:00';
  }

  const totalSeconds = Math.max(0, Math.floor(seconds));
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const canUseHls = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  return Hls.isSupported();
};

export function VideoPlayer({
  title,
  hlsSrc,
  mp4Src,
  poster,
  chapters,
  subtitleTracks,
  statusMessages,
  labels
}: VideoPlayerProps): ReactElement {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [status, setStatus] = useState<PlayerStatus>('idle');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showSubtitles, setShowSubtitles] = useState(true);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) {
      return;
    }

    if (!hlsSrc && !mp4Src) {
      setStatus('no-source');
      return;
    }

    setStatus('loading');

    const canPlayNativeHls = videoElement.canPlayType('application/vnd.apple.mpegurl');

    if (hlsSrc) {
      if (canPlayNativeHls) {
        videoElement.src = hlsSrc;
        videoElement.load();
      } else if (canUseHls()) {
        const hls = new Hls({ enableWorker: false });
        hlsRef.current = hls;
        hls.attachMedia(videoElement);
        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          hls.loadSource(hlsSrc);
        });
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data?.fatal) {
            setStatus('error');
          }
        });
      } else if (mp4Src) {
        videoElement.src = mp4Src;
        videoElement.load();
      } else {
        setStatus('error');
      }
    } else if (mp4Src) {
      videoElement.src = mp4Src;
      videoElement.load();
    } else {
      setStatus('no-source');
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [hlsSrc, mp4Src]);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) {
      return;
    }

    const handleLoadedMetadata = () => {
      setDuration(Number.isFinite(videoElement.duration) ? videoElement.duration : 0);
      setStatus((current) => (current === 'loading' ? 'ready' : current));
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setStatus('ready');
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleWaiting = () => {
      setStatus('loading');
    };

    const handleCanPlay = () => {
      setStatus('ready');
    };

    const handleError = () => {
      setStatus('error');
    };

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
    };

    const handleVolumeChange = () => {
      setVolume(videoElement.volume);
      setMuted(videoElement.muted || videoElement.volume === 0);
    };

    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('waiting', handleWaiting);
    videoElement.addEventListener('canplay', handleCanPlay);
    videoElement.addEventListener('error', handleError);
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('volumechange', handleVolumeChange);

    return () => {
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('waiting', handleWaiting);
      videoElement.removeEventListener('canplay', handleCanPlay);
      videoElement.removeEventListener('error', handleError);
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('volumechange', handleVolumeChange);
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === videoRef.current);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement || !subtitleTracks?.length) {
      return;
    }

    const tracks = Array.from(videoElement.textTracks);
    tracks.forEach((track) => {
      track.mode = showSubtitles ? 'showing' : 'disabled';
    });
  }, [showSubtitles, subtitleTracks]);

  const statusMessage = useMemo(() => {
    switch (status) {
      case 'loading':
        return statusMessages.loading;
      case 'error':
        return statusMessages.error;
      case 'no-source':
        return statusMessages.noSource;
      default:
        return '';
    }
  }, [status, statusMessages]);

  const handleTogglePlay = useCallback(() => {
    const videoElement = videoRef.current;

    if (!videoElement) {
      return;
    }

    if (videoElement.paused) {
      void videoElement.play();
    } else {
      videoElement.pause();
    }
  }, []);

  const handleSeek = useCallback((time: number) => {
    const videoElement = videoRef.current;

    if (!videoElement || !Number.isFinite(time)) {
      return;
    }

    videoElement.currentTime = time;
    setCurrentTime(time);
  }, []);

  const handleProgressChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    handleSeek(value);
  }, [handleSeek]);

  const handleVolumeChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const videoElement = videoRef.current;
    if (!videoElement) {
      return;
    }

    const value = Number(event.target.value);
    videoElement.volume = value;
    videoElement.muted = value === 0;
    setVolume(value);
    setMuted(value === 0);
  }, []);

  const handleToggleMute = useCallback(() => {
    const videoElement = videoRef.current;

    if (!videoElement) {
      return;
    }

    const nextMuted = !muted;
    videoElement.muted = nextMuted;
    setMuted(nextMuted);
  }, [muted]);

  const handleToggleSubtitles = useCallback(() => {
    setShowSubtitles((previous) => !previous);
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    const videoElement = videoRef.current;
    if (!videoElement) {
      return;
    }

    if (typeof document === 'undefined') {
      return;
    }

    if (!document.fullscreenElement) {
      if (typeof videoElement.requestFullscreen === 'function') {
        void videoElement.requestFullscreen();
      }
      return;
    }

    if (typeof document.exitFullscreen === 'function') {
      void document.exitFullscreen();
    }
  }, []);

  const activeChapterId = useMemo(() => {
    if (!chapters.length) {
      return undefined;
    }

    const sorted = [...chapters].sort((a, b) => a.time - b.time);

    for (let index = sorted.length - 1; index >= 0; index -= 1) {
      if (currentTime >= sorted[index].time) {
        return sorted[index].id;
      }
    }

    return sorted[0].id;
  }, [chapters, currentTime]);

  const playbackLabel = isPlaying ? labels.pause : labels.play;
  const muteLabel = muted ? labels.unmute : labels.mute;
  const subtitlesLabel = showSubtitles ? labels.subtitlesOff : labels.subtitlesOn;
  const fullscreenLabel = isFullscreen ? labels.exitFullscreen : labels.enterFullscreen;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-base-700 bg-gradient-to-br from-base-900/90 to-base-800/80 p-4 shadow-xl shadow-base-950/40">
        <div className="flex flex-col gap-4">
          <div className="relative overflow-hidden rounded-lg border border-base-700/80 bg-base-950/60">
            {status === 'no-source' ? (
              <div className="flex h-64 flex-col items-center justify-center gap-2 text-center text-sm text-base-300">
                <p>{statusMessages.noSource}</p>
              </div>
            ) : (
              <video
                ref={videoRef}
                data-testid="documentary-video"
                className="aspect-video w-full rounded-lg bg-base-950"
                controls={false}
                poster={poster}
                aria-label={title}
              >
                {mp4Src ? <source src={mp4Src} type="video/mp4" /> : null}
                {subtitleTracks?.map((track) => (
                  <track
                    key={track.id}
                    label={track.label}
                    src={track.src}
                    kind={track.kind ?? 'subtitles'}
                    srcLang={track.srclang}
                    default={track.default}
                  />
                ))}
              </video>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label={labels.controlsGroup}>
              <button
                type="button"
                onClick={handleTogglePlay}
                className="rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold text-base-950 transition hover:bg-accent-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-300"
                aria-label={playbackLabel}
                aria-pressed={isPlaying}
              >
                {playbackLabel}
              </button>
              <button
                type="button"
                onClick={handleToggleMute}
                className="rounded-full border border-base-600 px-4 py-2 text-sm font-semibold text-base-200 transition hover:border-accent-400 hover:text-accent-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-300"
                aria-label={muteLabel}
                aria-pressed={muted}
              >
                {muteLabel}
              </button>
              <button
                type="button"
                onClick={handleToggleSubtitles}
                className="rounded-full border border-base-600 px-4 py-2 text-sm font-semibold text-base-200 transition hover:border-accent-400 hover:text-accent-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-300"
                aria-label={subtitlesLabel}
                aria-pressed={showSubtitles}
                disabled={!subtitleTracks?.length}
              >
                {subtitleTracks?.length ? subtitlesLabel : labels.subtitlesUnavailable}
              </button>
              <button
                type="button"
                onClick={handleToggleFullscreen}
                className="rounded-full border border-base-600 px-4 py-2 text-sm font-semibold text-base-200 transition hover:border-accent-400 hover:text-accent-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-300"
                aria-label={fullscreenLabel}
                aria-pressed={isFullscreen}
              >
                {fullscreenLabel}
              </button>
            </div>

            <div className="flex flex-col gap-3" aria-live="polite">
              {statusMessage ? (
                <p className="text-sm text-base-300">{statusMessage}</p>
              ) : null}
              <label className="flex flex-col gap-1 text-xs text-base-300" htmlFor="doc-progress">
                <span className="sr-only">{labels.progress}</span>
                <input
                  id="doc-progress"
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={1}
                  value={Number.isFinite(currentTime) ? currentTime : 0}
                  onChange={handleProgressChange}
                  aria-valuemin={0}
                  aria-valuemax={Math.floor(duration)}
                  aria-valuenow={Math.floor(currentTime)}
                  aria-label={labels.progress}
                  className="h-2 cursor-pointer appearance-none rounded-full bg-base-700 accent-accent-500"
                />
                <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-wide text-base-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </label>

              <label className="flex items-center gap-3 text-xs text-base-300" htmlFor="doc-volume">
                <span className="sr-only">{labels.volume}</span>
                <input
                  id="doc-volume"
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={handleVolumeChange}
                  aria-valuemin={0}
                  aria-valuemax={1}
                  aria-valuenow={Number(volume.toFixed(2))}
                  aria-label={labels.volume}
                  className="h-2 w-48 cursor-pointer appearance-none rounded-full bg-base-700 accent-accent-500"
                />
                <span className="text-[0.7rem] uppercase tracking-wide text-base-400">
                  {labels.volumeIndicator(volume)}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {chapters.length ? (
        <div className="rounded-xl border border-base-800/70 bg-base-950/40 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-accent-200">{labels.chapterHeading}</h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {chapters.map((chapter) => {
              const isActive = chapter.id === activeChapterId;
              const formattedTime = formatTime(chapter.time);
              const ariaLabel = labels.getChapterAriaLabel
                ? labels.getChapterAriaLabel(chapter, formattedTime)
                : `${chapter.title} (${formattedTime})`;

              return (
                <li key={chapter.id}>
                  <button
                    type="button"
                    onClick={() => handleSeek(chapter.time)}
                    className={`w-full rounded-lg border px-4 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-300 ${
                      isActive
                        ? 'border-accent-400 bg-accent-500/10 text-accent-100'
                        : 'border-base-700/70 bg-base-900/40 text-base-100 hover:border-accent-400 hover:text-accent-100'
                    }`}
                    aria-label={ariaLabel}
                    aria-current={isActive}
                  >
                    <div className="flex items-center justify-between text-xs uppercase tracking-wide text-accent-300/80">
                      <span>{formattedTime}</span>
                      {isActive ? <span aria-label={labels.chapterCurrent}>●</span> : null}
                    </div>
                    <p className="mt-1 text-sm font-semibold">{chapter.title}</p>
                    {chapter.summary ? (
                      <p className="mt-1 text-xs text-base-300">{chapter.summary}</p>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
