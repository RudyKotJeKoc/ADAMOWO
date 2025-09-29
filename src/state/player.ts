import { create } from 'zustand';

export type StreamQuality = '128kbps';

interface PlayerState {
  isPlaying: boolean;
  volume: number;
  quality: StreamQuality;
  setPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setQuality: (quality: StreamQuality) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  isPlaying: false,
  volume: 1,
  quality: '128kbps',
  setPlaying: (isPlaying) => set({ isPlaying }),
  setVolume: (volume) => set({ volume }),
  setQuality: (quality) => set({ quality })
}));
