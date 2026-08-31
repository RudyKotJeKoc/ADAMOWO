import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BackwardIcon,
  ForwardIcon,
  MusicalNoteIcon,
  PauseIcon,
  PlayIcon,
  SpeakerWaveIcon,
} from '@heroicons/react/24/solid';

export function AdamowoHeader(): JSX.Element {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);

  const musicTracks = useMemo(
    () => Array.from({ length: 50 }, (_, index) => `/music/Utwor (${index + 1}).mp3`),
    []
  );
  const [shuffledTracks, setShuffledTracks] = useState<string[]>([]);

  useEffect(() => {
    setShuffledTracks([...musicTracks].sort(() => Math.random() - 0.5));
  }, [musicTracks]);

  const currentTrack = shuffledTracks[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Nie udało się odtworzyć nagrania:', error);
      setIsPlaying(false);
    }
  }, [currentTrack, isPlaying]);

  const playNext = useCallback(() => {
    if (shuffledTracks.length === 0) return;
    setCurrentTrackIndex((previous) => (previous + 1) % shuffledTracks.length);
    setIsPlaying(true);
  }, [shuffledTracks.length]);

  const playPrevious = useCallback(() => {
    if (shuffledTracks.length === 0) return;
    setCurrentTrackIndex(
      (previous) => (previous - 1 + shuffledTracks.length) % shuffledTracks.length
    );
    setIsPlaying(true);
  }, [shuffledTracks.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => playNext();
    const handleError = () => playNext();
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [playNext]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    audio.src = currentTrack;
    if (isPlaying) {
      audio.play().catch((error) => {
        console.error('Nie udało się odtworzyć nagrania:', error);
        setIsPlaying(false);
      });
    }
  }, [currentTrack, isPlaying]);

  return (
    <section
      aria-label="Odtwarzacz biblioteki audio"
      className="border-b border-base-800/70 bg-base-925/80"
    >
      <div className="container-responsive flex min-h-16 items-center justify-between gap-3 py-2">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent-500/30 bg-accent-500/10 text-accent-300">
            <MusicalNoteIcon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-accent-300">
              Biblioteka audio
            </p>
            <p className="truncate text-sm text-base-300">
              {currentTrack ? `Nagranie ${currentTrackIndex + 1}` : 'Przygotowywanie playlisty…'}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={playPrevious}
            className="touch-target inline-flex h-9 w-9 items-center justify-center rounded-full text-base-300 transition hover:bg-base-800 hover:text-accent-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
            aria-label="Poprzednie nagranie"
          >
            <BackwardIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={togglePlay}
            className="touch-target inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent-500 text-base-950 transition hover:bg-accent-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300"
            aria-label={isPlaying ? 'Wstrzymaj odtwarzanie' : 'Odtwórz nagranie'}
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
            className="touch-target inline-flex h-9 w-9 items-center justify-center rounded-full text-base-300 transition hover:bg-base-800 hover:text-accent-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
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

        <audio ref={audioRef} preload="metadata" />
      </div>
    </section>
  );
}
