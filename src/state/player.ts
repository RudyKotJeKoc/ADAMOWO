/**
 * Audio Player State Management
 *
 * Zustand store for managing basic audio player state including playback control,
 * volume, track information, and player status.
 */

import { create } from 'zustand';

/**
 * Represents the current status of the audio player.
 * @typedef {'idle' | 'buffering' | 'playing' | 'error'} PlayerStatus
 */
export type PlayerStatus = 'idle' | 'buffering' | 'playing' | 'error';

/**
 * Represents the currently playing track.
 * @interface CurrentTrack
 * @property {string} id - Unique track identifier
 * @property {string} title - Track title
 * @property {string} artist - Artist name
 * @property {string} url - URL to the audio file
 * @property {string} [coverUrl] - Optional URL to the track's cover art
 */
export interface CurrentTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  coverUrl?: string;
}

/**
 * Audio player state and actions interface.
 * @interface PlayerState
 * @property {boolean} playing - Whether audio is currently playing
 * @property {number} volume - Volume level (0 to 1)
 * @property {boolean} muted - Whether audio is muted
 * @property {string} playlistUrl - URL to the playlist JSON file
 * @property {PlayerStatus} status - Current player status
 * @property {string | null} error - Error message if status is 'error', null otherwise
 * @property {CurrentTrack | null} currentTrack - Currently playing track, or null if none
 * @property {function(boolean): void} setPlaying - Sets playing state
 * @property {function(number): void} setVolume - Sets volume level (0 to 1)
 * @property {function(boolean): void} setMuted - Sets muted state
 * @property {function(PlayerStatus): void} setStatus - Sets player status
 * @property {function(string | null): void} setError - Sets error message
 * @property {function(string): void} setPlaylistUrl - Sets playlist URL
 * @property {function(CurrentTrack | null): void} setCurrentTrack - Sets current track
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
 * @constant {string}
 * @private
 */
const DEFAULT_PLAYLIST_URL = '/music/playlist.json';

/**
 * Zustand store hook for audio player state management.
 * Provides access to player state and actions for controlling playback.
 * @hook
 * @returns {PlayerState} Player state and actions
 * @example
 * const { playing, setPlaying, currentTrack, volume } = usePlayerStore();
 *
 * // Play/pause toggle
 * const togglePlay = () => setPlaying(!playing);
 *
 * // Set volume to 50%
 * setVolume(0.5);
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
