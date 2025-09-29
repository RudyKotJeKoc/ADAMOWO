import { create } from 'zustand';

export type PlayerStatus = 'idle' | 'buffering' | 'playing' | 'reconnecting' | 'error';

export interface PlayerState {
  playing: boolean;
  volume: number;
  muted: boolean;
  src: string;
  status: PlayerStatus;
  error: string | null;
  reconnectCount: number;
  setPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  setStatus: (status: PlayerStatus) => void;
  setError: (error: string | null) => void;
  setSrc: (src: string) => void;
  setReconnectCount: (count: number) => void;
  resetReconnect: () => void;
}

const STREAM_SRC = import.meta.env.VITE_STREAM_URL_HLS ?? '';

export const usePlayerStore = create<PlayerState>((set) => ({
  playing: false,
  volume: 1,
  muted: false,
  src: STREAM_SRC,
  status: 'idle',
  error: null,
  reconnectCount: 0,
  setPlaying: (playing) => set({ playing }),
  setVolume: (volume) => set({ volume }),
  setMuted: (muted) => set({ muted }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
  setSrc: (src) => set({ src }),
  setReconnectCount: (count) => set({ reconnectCount: count }),
  resetReconnect: () => set({ reconnectCount: 0 })
}));
