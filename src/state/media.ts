/**
 * Multimedia State Management
 *
 * Zustand store for managing audio engine, visualizer, slideshow, and rating states
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AudioEngineState,
  AudioEngineConfig,
  VisualizerConfig,
  VisualizerMode,
  SlideshowConfig,
  SlideshowState,
  TrackRating,
  PlaylistQueue,
  AudioTrack,
} from '../features/media/media.schema';

// ============================================================================
// AUDIO ENGINE STORE
// ============================================================================

interface AudioEngineStore extends AudioEngineState {
  config: AudioEngineConfig;
  // Actions
  setStatus: (status: AudioEngineState['status']) => void;
  setCurrentTrack: (track: AudioTrack | null) => void;
  setNextTrack: (track: AudioTrack | null) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  setError: (error: string | null) => void;
  setTransitioning: (transitioning: boolean) => void;
  updateConfig: (config: Partial<AudioEngineConfig>) => void;
  reset: () => void;
}

const defaultAudioEngineState: AudioEngineState = {
  status: 'idle',
  currentTrack: null,
  nextTrack: null,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  muted: false,
  error: null,
  isTransitioning: false,
};

const defaultAudioEngineConfig: AudioEngineConfig = {
  crossfadeDuration: 3000, // 3 seconds
  preloadNextTrack: true,
  enableCaching: true,
  cacheSize: 10, // cache up to 10 tracks
  volume: 0.8,
  enableVisualization: true,
};

export const useAudioEngineStore = create<AudioEngineStore>()(
  persist(
    (set) => ({
      ...defaultAudioEngineState,
      config: defaultAudioEngineConfig,

      setStatus: (status) => set({ status }),
      setCurrentTrack: (currentTrack) => set({ currentTrack }),
      setNextTrack: (nextTrack) => set({ nextTrack }),
      setCurrentTime: (currentTime) => set({ currentTime }),
      setDuration: (duration) => set({ duration }),
      setVolume: (volume) => set({ volume }),
      setMuted: (muted) => set({ muted }),
      setError: (error) => set({ error }),
      setTransitioning: (isTransitioning) => set({ isTransitioning }),
      updateConfig: (newConfig) =>
        set((state) => ({
          config: { ...state.config, ...newConfig },
        })),
      reset: () => set(defaultAudioEngineState),
    }),
    {
      name: 'adamowo-audio-engine',
      partialize: (state) => ({
        volume: state.volume,
        muted: state.muted,
        config: state.config,
      }),
    }
  )
);

// ============================================================================
// VISUALIZER STORE
// ============================================================================

interface VisualizerStore {
  config: VisualizerConfig;
  isActive: boolean;
  // Actions
  setMode: (mode: VisualizerMode) => void;
  setActive: (active: boolean) => void;
  updateConfig: (config: Partial<VisualizerConfig>) => void;
}

const defaultVisualizerConfig: VisualizerConfig = {
  mode: '2d-bars',
  fftSize: 256,
  smoothingTimeConstant: 0.8,
  minDecibels: -90,
  maxDecibels: -10,
  colorScheme: {
    primary: '#f59e0b',
    secondary: '#d97706',
    accent: '#fbbf24',
    background: '#0a0e27',
    gradient: ['#f59e0b', '#d97706', '#b45309'],
  },
  responsive: true,
};

export const useVisualizerStore = create<VisualizerStore>()(
  persist(
    (set) => ({
      config: defaultVisualizerConfig,
      isActive: true,

      setMode: (mode) =>
        set((state) => ({
          config: { ...state.config, mode },
        })),
      setActive: (isActive) => set({ isActive }),
      updateConfig: (newConfig) =>
        set((state) => ({
          config: { ...state.config, ...newConfig },
        })),
    }),
    {
      name: 'adamowo-visualizer',
    }
  )
);

// ============================================================================
// PLAYLIST QUEUE STORE
// ============================================================================

interface PlaylistQueueStore {
  queue: PlaylistQueue;
  // Actions
  setQueue: (tracks: AudioTrack[]) => void;
  addToQueue: (track: AudioTrack) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
  next: () => void;
  previous: () => void;
  jumpTo: (index: number) => void;
  toggleShuffle: () => void;
  setRepeat: (repeat: PlaylistQueue['repeat']) => void;
  addToHistory: (track: AudioTrack) => void;
}

const defaultQueue: PlaylistQueue = {
  currentIndex: 0,
  tracks: [],
  history: [],
  shuffle: false,
  repeat: 'none',
};

export const usePlaylistQueueStore = create<PlaylistQueueStore>()(
  persist(
    (set, get) => ({
      queue: defaultQueue,

      setQueue: (tracks) =>
        set((state) => ({
          queue: { ...state.queue, tracks, currentIndex: 0 },
        })),

      addToQueue: (track) =>
        set((state) => ({
          queue: {
            ...state.queue,
            tracks: [...state.queue.tracks, track],
          },
        })),

      removeFromQueue: (trackId) =>
        set((state) => ({
          queue: {
            ...state.queue,
            tracks: state.queue.tracks.filter((t) => t.id !== trackId),
          },
        })),

      clearQueue: () =>
        set((state) => ({
          queue: { ...state.queue, tracks: [], currentIndex: 0 },
        })),

      next: () =>
        set((state) => {
          const { queue } = state;
          const { currentIndex, tracks, repeat } = queue;

          if (tracks.length === 0) return state;

          let nextIndex: number;

          if (repeat === 'one') {
            nextIndex = currentIndex;
          } else if (currentIndex < tracks.length - 1) {
            nextIndex = currentIndex + 1;
          } else if (repeat === 'all') {
            nextIndex = 0;
          } else {
            return state; // End of queue, no repeat
          }

          return {
            queue: { ...queue, currentIndex: nextIndex },
          };
        }),

      previous: () =>
        set((state) => {
          const { queue } = state;
          const { currentIndex, tracks, repeat } = queue;

          if (tracks.length === 0) return state;

          let prevIndex: number;

          if (currentIndex > 0) {
            prevIndex = currentIndex - 1;
          } else if (repeat === 'all') {
            prevIndex = tracks.length - 1;
          } else {
            return state; // Beginning of queue
          }

          return {
            queue: { ...queue, currentIndex: prevIndex },
          };
        }),

      jumpTo: (index) =>
        set((state) => ({
          queue: {
            ...state.queue,
            currentIndex: Math.max(0, Math.min(index, state.queue.tracks.length - 1)),
          },
        })),

      toggleShuffle: () =>
        set((state) => ({
          queue: { ...state.queue, shuffle: !state.queue.shuffle },
        })),

      setRepeat: (repeat) =>
        set((state) => ({
          queue: { ...state.queue, repeat },
        })),

      addToHistory: (track) =>
        set((state) => ({
          queue: {
            ...state.queue,
            history: [track, ...state.queue.history.slice(0, 49)], // Keep last 50
          },
        })),
    }),
    {
      name: 'adamowo-playlist-queue',
    }
  )
);

// ============================================================================
// SLIDESHOW STORE
// ============================================================================

interface SlideshowStore extends SlideshowState {
  config: SlideshowConfig;
  // Actions
  setItems: (items: SlideshowState['items']) => void;
  setCurrentIndex: (index: number) => void;
  setPlaying: (playing: boolean) => void;
  setTransitioning: (transitioning: boolean) => void;
  next: () => void;
  previous: () => void;
  updateConfig: (config: Partial<SlideshowConfig>) => void;
}

const defaultSlideshowState: SlideshowState = {
  currentIndex: 0,
  items: [],
  isPlaying: false,
  isTransitioning: false,
};

const defaultSlideshowConfig: SlideshowConfig = {
  autoPlay: true,
  interval: 5000, // 5 seconds
  transition: 'fade',
  transitionDuration: 800,
  shuffle: false,
  loop: true,
  showControls: true,
  showProgress: true,
};

export const useSlideshowStore = create<SlideshowStore>()(
  persist(
    (set) => ({
      ...defaultSlideshowState,
      config: defaultSlideshowConfig,

      setItems: (items) => set({ items, currentIndex: 0 }),
      setCurrentIndex: (currentIndex) => set({ currentIndex }),
      setPlaying: (isPlaying) => set({ isPlaying }),
      setTransitioning: (isTransitioning) => set({ isTransitioning }),

      next: () =>
        set((state) => {
          const { currentIndex, items } = state;
          const { loop } = state.config;

          if (items.length === 0) return state;

          let nextIndex: number;

          if (currentIndex < items.length - 1) {
            nextIndex = currentIndex + 1;
          } else if (loop) {
            nextIndex = 0;
          } else {
            return { ...state, isPlaying: false }; // End of slideshow
          }

          return { currentIndex: nextIndex };
        }),

      previous: () =>
        set((state) => {
          const { currentIndex, items } = state;
          const { loop } = state.config;

          if (items.length === 0) return state;

          let prevIndex: number;

          if (currentIndex > 0) {
            prevIndex = currentIndex - 1;
          } else if (loop) {
            prevIndex = items.length - 1;
          } else {
            return state; // Beginning of slideshow
          }

          return { currentIndex: prevIndex };
        }),

      updateConfig: (newConfig) =>
        set((state) => ({
          config: { ...state.config, ...newConfig },
        })),
    }),
    {
      name: 'adamowo-slideshow',
      partialize: (state) => ({
        config: state.config,
      }),
    }
  )
);

// ============================================================================
// RATING STORE
// ============================================================================

interface RatingStore {
  ratings: Record<string, TrackRating>; // trackId -> rating
  // Actions
  setRating: (trackId: string, rating: number, comment?: string) => void;
  removeRating: (trackId: string) => void;
  getRating: (trackId: string) => TrackRating | undefined;
  getAllRatings: () => TrackRating[];
  clearRatings: () => void;
}

export const useRatingStore = create<RatingStore>()(
  persist(
    (set, get) => ({
      ratings: {},

      setRating: (trackId, rating, comment) =>
        set((state) => ({
          ratings: {
            ...state.ratings,
            [trackId]: {
              trackId,
              rating: Math.max(1, Math.min(5, rating)), // Clamp to 1-5
              ratedAt: new Date().toISOString(),
              comment,
              syncStatus: 'local',
            },
          },
        })),

      removeRating: (trackId) =>
        set((state) => {
          const { [trackId]: _, ...rest } = state.ratings;
          return { ratings: rest };
        }),

      getRating: (trackId) => get().ratings[trackId],

      getAllRatings: () => Object.values(get().ratings),

      clearRatings: () => set({ ratings: {} }),
    }),
    {
      name: 'adamowo-ratings',
    }
  )
);

// ============================================================================
// SELECTORS (Performance optimization)
// ============================================================================

// Audio Engine Selectors
export const selectCurrentTrack = (state: AudioEngineStore) => state.currentTrack;
export const selectIsPlaying = (state: AudioEngineStore) => state.status === 'playing';
export const selectVolume = (state: AudioEngineStore) => state.volume;
export const selectProgress = (state: AudioEngineStore) =>
  state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

// Queue Selectors
export const selectCurrentQueueTrack = (state: PlaylistQueueStore) => {
  const { queue } = state;
  return queue.tracks[queue.currentIndex] || null;
};
export const selectQueueLength = (state: PlaylistQueueStore) => state.queue.tracks.length;
export const selectHasNext = (state: PlaylistQueueStore) => {
  const { currentIndex, tracks, repeat } = state.queue;
  return currentIndex < tracks.length - 1 || repeat === 'all';
};
export const selectHasPrevious = (state: PlaylistQueueStore) => {
  const { currentIndex, repeat } = state.queue;
  return currentIndex > 0 || repeat === 'all';
};

// Slideshow Selectors
export const selectCurrentSlide = (state: SlideshowStore) => state.items[state.currentIndex] || null;
export const selectSlideshowProgress = (state: SlideshowStore) =>
  state.items.length > 0 ? ((state.currentIndex + 1) / state.items.length) * 100 : 0;
