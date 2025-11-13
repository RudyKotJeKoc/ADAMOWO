import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  BackwardIcon,
  SpeakerWaveIcon,
} from '@heroicons/react/24/solid';

export function AdamowoHeader(): JSX.Element {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Generate list of potential music files
  // Looking for pattern: Utwor (1).mp3, Utwor (2).mp3, etc.
  const musicTracks = useMemo(() => {
    const tracks: string[] = [];
    // Generate paths for potential tracks (1-50)
    for (let i = 1; i <= 50; i++) {
      tracks.push(`/music/Utwor (${i}).mp3`);
    }
    // Also include the existing whisper file
    tracks.push('/music/whisper-2017.mp3');
    return tracks;
  }, []);

  // Shuffle tracks on mount for random playback
  const [shuffledTracks, setShuffledTracks] = useState<string[]>([]);

  useEffect(() => {
    const shuffled = [...musicTracks].sort(() => Math.random() - 0.5);
    setShuffledTracks(shuffled);
  }, [musicTracks]);

  const currentTrack = shuffledTracks[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      playNext();
    };

    const handleError = () => {
      // If track doesn't exist, try next one
      console.log(`Track not found: ${currentTrack}, trying next...`);
      playNext();
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [currentTrack]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  }, [isPlaying]);

  const playNext = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % shuffledTracks.length);
    setIsPlaying(true);
  }, [shuffledTracks.length]);

  const playPrevious = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev - 1 + shuffledTracks.length) % shuffledTracks.length);
    setIsPlaying(true);
  }, [shuffledTracks.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    audio.src = currentTrack;
    if (isPlaying) {
      audio.play().catch((error) => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      });
    }
  }, [currentTrack, isPlaying]);

  return (
    <div className="border-b border-accent-500/20 bg-gradient-to-r from-base-950 via-base-900 to-base-950">
      <div className="container-responsive py-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Elegant Adamowo.com branding */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <motion.div
                className="absolute -inset-2 rounded-full bg-gradient-to-r from-accent-500 to-accent-300 opacity-20 blur-xl"
                animate={{
                  opacity: [0.2, 0.3, 0.2],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <h1 className="relative font-display text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-accent-300 via-accent-200 to-accent-300 md:text-5xl">
                Adamowo.com
              </h1>
            </div>
          </motion.div>

          {/* Audio player controls */}
          <motion.div
            className="flex items-center gap-3 rounded-full border border-accent-500/30 bg-base-900/50 px-6 py-3 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button
              type="button"
              onClick={playPrevious}
              className="touch-target inline-flex h-10 w-10 items-center justify-center rounded-full text-accent-200 transition hover:bg-accent-500/20 hover:text-accent-100 focus-visible:ring-2 focus-visible:ring-accent-400"
              aria-label="Previous track"
            >
              <BackwardIcon className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              className="touch-target inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent-500 text-base-950 transition hover:bg-accent-400 focus-visible:ring-2 focus-visible:ring-accent-400"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <PauseIcon className="h-6 w-6" />
              ) : (
                <PlayIcon className="ml-1 h-6 w-6" />
              )}
            </button>

            <button
              type="button"
              onClick={playNext}
              className="touch-target inline-flex h-10 w-10 items-center justify-center rounded-full text-accent-200 transition hover:bg-accent-500/20 hover:text-accent-100 focus-visible:ring-2 focus-visible:ring-accent-400"
              aria-label="Next track"
            >
              <ForwardIcon className="h-5 w-5" />
            </button>

            <div className="ml-2 flex items-center gap-2">
              <SpeakerWaveIcon className="h-5 w-5 text-accent-300" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-base-700 accent-accent-500"
                aria-label="Volume control"
              />
            </div>
          </motion.div>
        </div>

        {/* Hidden audio element */}
        <audio ref={audioRef} preload="metadata" />
      </div>
    </div>
  );
}
