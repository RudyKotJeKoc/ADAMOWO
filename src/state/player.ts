import { create } from 'zustand';

export type PlayerStatus = 'idle' | 'buffering' | 'playing' | 'error';

export interface CurrentTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  coverUrl?: string;
}

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

// Default playlist URL pointing to local music folder
const DEFAULT_PLAYLIST_URL = '/music/playlist.json';

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
