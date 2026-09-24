import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BackwardIcon,
  ForwardIcon,
  MusicalNoteIcon,
  PauseIcon,
  PlayIcon,
  SpeakerWaveIcon,
} from '@heroicons/react/24/solid';

const TRACK_COUNT = 50;
/** Ile uszkodzonych/brakujących plików z rzędu pomijamy, zanim się poddamy. */
const MAX_CONSECUTIVE_FAILURES = 5;

const shuffle = (items: string[]): string[] => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export function AdamowoHeader(): JSX.Element {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);
  // Czy użytkownik chce słuchać - decyduje, czy po zmianie utworu od razu grać.
  const wantsPlaybackRef = useRef(false);
  const failuresRef = useRef(0);

  const shuffledTracks = useMemo(
    () =>
      shuffle(Array.from({ length: TRACK_COUNT }, (_, index) => `/music/Utwor (${index + 1}).mp3`)),
    []
  );

  const currentTrack = shuffledTracks[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  /** Ładuje wskazany utwór i - jeśli użytkownik tego chce - zaczyna odtwarzanie. */
  const loadTrack = useCallback(
    (index: number) => {
      const audio = audioRef.current;
      const track = shuffledTracks[index];
      if (!audio || !track) return;

      audio.src = track;
      if (wantsPlaybackRef.current) {
        setIsLoading(true);
        audio.play().catch((error: unknown) => {
          // Błędy ładowania obsługuje zdarzenie `error`; tu tylko blokada autoplay itp.
          if (error instanceof DOMException && error.name === 'NotAllowedError') {
            wantsPlaybackRef.current = false;
            setIsLoading(false);
          }
        });
      }
    },
    [shuffledTracks]
  );

  const goToTrack = useCallback(
    (step: 1 | -1) => {
      const nextIndex = (currentTrackIndex + step + shuffledTracks.length) % shuffledTracks.length;
      setCurrentTrackIndex(nextIndex);
      loadTrack(nextIndex);
    },
    [currentTrackIndex, loadTrack, shuffledTracks.length]
  );

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (!audio.paused) {
      wantsPlaybackRef.current = false;
      audio.pause();
      return;
    }

    wantsPlaybackRef.current = true;
    failuresRef.current = 0;
    setUnavailable(false);

    // Pierwsze kliknięcie albo poprzedni plik się nie wczytał - ładujemy od nowa.
    if (!audio.currentSrc || audio.error) {
      loadTrack(currentTrackIndex);
      return;
    }

    setIsLoading(true);
    audio.play().catch(() => setIsLoading(false));
  }, [currentTrack, currentTrackIndex, loadTrack]);

  const playNext = useCallback(() => {
    failuresRef.current = 0;
    setUnavailable(false);
    goToTrack(1);
  }, [goToTrack]);

  const playPrevious = useCallback(() => {
    failuresRef.current = 0;
    setUnavailable(false);
    goToTrack(-1);
  }, [goToTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlaying = () => {
      failuresRef.current = 0;
      setIsPlaying(true);
      setIsLoading(false);
    };
    const handlePause = () => {
      setIsPlaying(false);
      setIsLoading(false);
    };
    const handleWaiting = () => setIsLoading(true);
    const handleEnded = () => goToTrack(1);
    const handleError = () => {
      setIsPlaying(false);
      failuresRef.current += 1;
      // Brakujący plik → spróbuj następnego, ale nie w nieskończoność.
      if (wantsPlaybackRef.current && failuresRef.current < MAX_CONSECUTIVE_FAILURES) {
        goToTrack(1);
        return;
      }
      console.error('Nie udało się odtworzyć nagrania:', audio.error);
      wantsPlaybackRef.current = false;
      setIsLoading(false);
      setUnavailable(true);
    };

    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [goToTrack]);

  return (
    <section
      aria-label="Odtwarzacz biblioteki audio"
      className="border-b border-base-800/70 bg-base-925/80"
    >
      <div className="container-responsive flex min-h-16 items-center justify-between gap-3 py-2">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent-500/30 bg-accent-500/10 text-accent-300 transition-shadow duration-300 ${
              isPlaying ? 'glow-accent-soft' : ''
            }`}
          >
            <MusicalNoteIcon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-accent-300">
              Biblioteka audio
            </p>
            <p className="truncate text-sm text-base-300" role="status" aria-live="polite">
              {unavailable
                ? 'Nagrania są chwilowo niedostępne'
                : isLoading
                  ? `Wczytywanie nagrania ${currentTrackIndex + 1}…`
                  : `Nagranie ${currentTrackIndex + 1}`}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={playPrevious}
            className="touch-target inline-flex h-9 w-9 items-center justify-center glow-hover rounded-full text-base-300 transition hover:bg-base-800 hover:text-accent-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
            aria-label="Poprzednie nagranie"
          >
            <BackwardIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={togglePlay}
            className="touch-target inline-flex h-10 w-10 items-center justify-center glow-hover rounded-full bg-accent-500 text-base-950 transition hover:bg-accent-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300"
            aria-label={isPlaying ? 'Wstrzymaj odtwarzanie' : 'Odtwórz nagranie'}
            aria-busy={isLoading}
          >
            {isPlaying ? (
              <PauseIcon className="h-5 w-5" />
            ) : (
              <PlayIcon className="ml-0.5 h-5 w-5" />
            )}
          </button>
          <button
            type="button"
            onClick={playNext}
            className="touch-target inline-flex h-9 w-9 items-center justify-center glow-hover rounded-full text-base-300 transition hover:bg-base-800 hover:text-accent-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
            aria-label="Następne nagranie"
          >
            <ForwardIcon className="h-4 w-4" />
          </button>

          <label className="ml-2 hidden items-center gap-2 border-l border-base-800 pl-3 sm:flex">
            <span className="sr-only">Głośność</span>
            <SpeakerWaveIcon className="h-4 w-4 text-base-400" aria-hidden="true" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(event) => setVolume(Number(event.target.value))}
              className="h-1 w-20 cursor-pointer appearance-none rounded bg-base-800 accent-accent-500"
            />
          </label>
        </div>

        <audio ref={audioRef} preload="none" />
      </div>
    </section>
  );
}
