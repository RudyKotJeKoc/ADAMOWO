import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  BackwardIcon,
  SpeakerWaveIcon,
} from '@heroicons/react/24/solid';

/**
 * Elegant header component featuring the Adamowo.com branding with an integrated audio player.
 *
 * Displays the site's main branding with animated glow effects and a fully functional
 * music player with controls for play/pause, next/previous track, and volume adjustment.
 * The player automatically shuffles and plays through a collection of music tracks.
 *
 * @component
 * @returns {JSX.Element} A header with branding and audio player controls
 *
 * @example
 * ```tsx
 * <AdamowoHeader />
 * ```
 *
 * Features:
 * - Animated branding with gradient text and glow effects
 * - Audio playback with play/pause, next/previous controls
 * - Volume control slider
 * - Automatic track progression and shuffling
 * - Error handling for missing audio files
 * - Accessible button labels and controls
 * - Responsive design with mobile optimization
 */
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

  /**
   * Toggles audio playback between play and pause states.
   *
   * Handles asynchronous play operations and manages playback state.
   * Includes error handling for playback failures.
   */
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

  /**
   * Advances to the next track in the shuffled playlist.
   *
   * Uses modulo arithmetic to loop back to the first track when reaching
   * the end of the playlist. Automatically sets playback to active.
   */
  const playNext = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % shuffledTracks.length);
    setIsPlaying(true);
  }, [shuffledTracks.length]);

  /**
   * Returns to the previous track in the shuffled playlist.
   *
   * Uses modulo arithmetic to loop to the last track when at the beginning
   * of the playlist. Automatically sets playback to active.
   */
  const playPrevious = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev - 1 + shuffledTracks.length) % shuffledTracks.length);
    setIsPlaying(true);
  }, [shuffledTracks.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      playNext();
    };

    const handleError = () => {
      console.log(`Track not found: ${currentTrack}, trying next...`);
      playNext();
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [currentTrack, playNext]);

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
    <div className="border-b border-base-800/50 bg-base-950">
      <div className="container-responsive py-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Radio Adamowo branding z lampką ON AIR */}
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* ON AIR lampka - delikatny puls */}
            <div className="flex flex-col items-center gap-1">
              <motion.div
                className="h-3 w-3 rounded-full bg-danger-600 shadow-lg shadow-danger-500/50"
                animate={{
                  opacity: [0.9, 1, 0.9],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <span className="font-display text-[10px] font-medium uppercase tracking-wider text-danger-600">
                ON AIR
              </span>
            </div>

            {/* Logo */}
            <div className="relative">
              <h1 className="font-display text-3xl font-bold tracking-tight text-accent-400 md:text-4xl">
                Radio Adamowo
              </h1>
              <p className="font-mono text-xs text-base-400 uppercase tracking-widest mt-0.5">
                Studio Śledcze
              </p>
            </div>
          </motion.div>

          {/* Audio player controls - prostsze, hardware'owe */}
          <motion.div
            className="flex items-center gap-3 rounded border border-base-800 bg-base-900/80 px-6 py-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {/* Przyciski - hardware'owy design, proste kształty */}
            <button
              type="button"
              onClick={playPrevious}
              className="touch-target inline-flex h-9 w-9 items-center justify-center rounded text-base-200 transition-colors duration-150 hover:bg-base-800 hover:text-accent-400 focus-visible:ring-2 focus-visible:ring-accent-400"
              aria-label="Previous track"
            >
              <BackwardIcon className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              className="touch-target inline-flex h-10 w-10 items-center justify-center rounded bg-accent-500/90 text-base-950 transition-colors duration-150 hover:bg-accent-500 focus-visible:ring-2 focus-visible:ring-accent-400"
              aria-label={isPlaying ? 'Pause' : 'Play'}
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
              className="touch-target inline-flex h-9 w-9 items-center justify-center rounded text-base-200 transition-colors duration-150 hover:bg-base-800 hover:text-accent-400 focus-visible:ring-2 focus-visible:ring-accent-400"
              aria-label="Next track"
            >
              <ForwardIcon className="h-5 w-5" />
            </button>

            {/* Volume control */}
            <div className="ml-2 flex items-center gap-2 border-l border-base-800 pl-3">
              <SpeakerWaveIcon className="h-4 w-4 text-base-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="h-1 w-20 cursor-pointer appearance-none rounded bg-base-800 accent-accent-500"
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
