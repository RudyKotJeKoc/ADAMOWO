import { create } from 'zustand';

/**
 * Player status states.
 *
 * - 'idle': Player is not active
 * - 'buffering': Player is loading audio data
 * - 'playing': Audio is currently playing
 * - 'error': Player encountered an error
 */
export type PlayerStatus = 'idle' | 'buffering' | 'playing' | 'error';

/**
 * Represents the currently loaded track in the player.
 *
 * @property id - Unique identifier for the track
 * @property title - Track title
 * @property artist - Artist name
 * @property url - URL to the audio file
 * @property coverUrl - Optional URL to the cover image
 */
export interface CurrentTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  coverUrl?: string;
}

/**
 * Player state interface for the Zustand store.
 * Manages global audio player state including playback, volume, and current track.
 *
 * @property playing - Whether audio is currently playing
 * @property volume - Volume level (0.0 to 1.0)
 * @property muted - Whether audio is muted
 * @property playlistUrl - URL to the current playlist JSON
 * @property status - Current player status
 * @property error - Error message if status is 'error', null otherwise
 * @property currentTrack - Currently loaded track, null if none
 * @property setPlaying - Sets the playing state
 * @property setVolume - Sets the volume level (0.0 to 1.0)
 * @property setMuted - Sets the muted state
 * @property setStatus - Sets the player status
 * @property setError - Sets or clears the error message
 * @property setPlaylistUrl - Sets the playlist URL
 * @property setCurrentTrack - Sets the current track
 */
export interface PlayerState {
  playing: boolean;
  volume: number;
  muted: boolean;
  playlistUrl: string;
  status: PlayerStatus;
  error: string | null;
  currentTrack: CurrentTrack | null;
  setPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  setStatus: (status: PlayerStatus) => void;
  setError: (error: string | null) => void;
  setPlaylistUrl: (url: string) => void;
  setCurrentTrack: (track: CurrentTrack | null) => void;
}

/**
 * Default playlist URL pointing to local music folder.
 *
 * @internal
 */
const DEFAULT_PLAYLIST_URL = '/music/playlist.json';

/**
 * Zustand store for global audio player state.
 * Provides centralized state management for the audio player component.
 *
 * @example
 * ```typescript
 * // In a component:
 * const { playing, currentTrack, setPlaying } = usePlayerStore();
 *
 * // Toggle playback
 * const handlePlayPause = () => {
 *   setPlaying(!playing);
 * };
 *
 * // Display current track
 * if (currentTrack) {
 *   console.log(`Now playing: ${currentTrack.title} by ${currentTrack.artist}`);
 * }
 * ```
 */
export const usePlayerStore = create<PlayerState>((set) => ({
  playing: false,
  volume: 1,
  muted: false,
  playlistUrl: DEFAULT_PLAYLIST_URL,
  status: 'idle',
  error: null,
  currentTrack: null,
  setPlaying: (playing) => set({ playing }),
  setVolume: (volume) => set({ volume }),
  setMuted: (muted) => set({ muted }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
  setPlaylistUrl: (url) => set({ playlistUrl: url }),
  setCurrentTrack: (track) => set({ currentTrack: track })
}));
