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

/**
 * Extended audio engine store interface combining state and actions.
 * @interface AudioEngineStore
 * @extends AudioEngineState
 * @property {AudioEngineConfig} config - Audio engine configuration settings
 * @property {function(AudioEngineState['status']): void} setStatus - Updates player status
 * @property {function(AudioTrack | null): void} setCurrentTrack - Sets the currently playing track
 * @property {function(AudioTrack | null): void} setNextTrack - Sets the next track to be played
 * @property {function(number): void} setCurrentTime - Updates current playback time in seconds
 * @property {function(number): void} setDuration - Sets total track duration in seconds
 * @property {function(number): void} setVolume - Sets volume level (0 to 1)
 * @property {function(boolean): void} setMuted - Sets muted state
 * @property {function(string | null): void} setError - Sets error message or clears it
 * @property {function(boolean): void} setTransitioning - Sets transition state during crossfade
 * @property {function(Partial<AudioEngineConfig>): void} updateConfig - Partially updates configuration
 * @property {function(): void} reset - Resets state to default values
 */
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

/**
 * Default initial state for the audio engine.
 * @constant {AudioEngineState}
 * @private
 */
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

/**
 * Default configuration for the audio engine.
 * @constant {AudioEngineConfig}
 * @private
 */
const defaultAudioEngineConfig: AudioEngineConfig = {
  crossfadeDuration: 3000, // 3 seconds
  preloadNextTrack: true,
  enableCaching: true,
  cacheSize: 10, // cache up to 10 tracks
  volume: 0.8,
  enableVisualization: true,
};

/**
 * Zustand store hook for audio engine state management.
 * Manages playback state, track information, volume, and audio configuration.
 * Persists volume, muted state, and config to localStorage.
 * @hook
 * @returns {AudioEngineStore} Audio engine state and actions
 * @example
 * const { status, currentTrack, setVolume, updateConfig } = useAudioEngineStore();
 *
 * // Update volume
 * setVolume(0.5);
 *
 * // Enable crossfade
 * updateConfig({ crossfadeDuration: 5000 });
 */
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

/**
 * Audio visualizer store interface for managing visualization state and configuration.
 * @interface VisualizerStore
 * @property {VisualizerConfig} config - Visualizer configuration settings
 * @property {boolean} isActive - Whether the visualizer is currently active
 * @property {function(VisualizerMode): void} setMode - Sets visualization mode
 * @property {function(boolean): void} setActive - Activates or deactivates the visualizer
 * @property {function(Partial<VisualizerConfig>): void} updateConfig - Partially updates configuration
 */
interface VisualizerStore {
  config: VisualizerConfig;
  isActive: boolean;
  // Actions
  setMode: (mode: VisualizerMode) => void;
  setActive: (active: boolean) => void;
  updateConfig: (config: Partial<VisualizerConfig>) => void;
}

/**
 * Default configuration for the audio visualizer.
 * @constant {VisualizerConfig}
 * @private
 */
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

/**
 * Zustand store hook for audio visualizer state management.
 * Manages visualizer mode, configuration, and active state.
 * Persists all settings to localStorage.
 * @hook
 * @returns {VisualizerStore} Visualizer state and actions
 * @example
 * const { config, isActive, setMode, updateConfig } = useVisualizerStore();
 *
 * // Change visualization mode
 * setMode('3d-spectrum');
 *
 * // Update color scheme
 * updateConfig({
 *   colorScheme: {
 *     primary: '#3b82f6',
 *     secondary: '#2563eb',
 *     accent: '#60a5fa',
 *     background: '#1e293b',
 *     gradient: ['#3b82f6', '#2563eb', '#1d4ed8']
 *   }
 * });
 */
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

/**
 * Playlist queue store interface for managing playback queue and navigation.
 * @interface PlaylistQueueStore
 * @property {PlaylistQueue} queue - Current playlist queue state
 * @property {function(AudioTrack[]): void} setQueue - Replaces entire queue with new tracks
 * @property {function(AudioTrack): void} addToQueue - Adds a track to the end of the queue
 * @property {function(string): void} removeFromQueue - Removes a track by ID from the queue
 * @property {function(): void} clearQueue - Clears all tracks from the queue
 * @property {function(): void} next - Advances to the next track in the queue
 * @property {function(): void} previous - Goes back to the previous track in the queue
 * @property {function(number): void} jumpTo - Jumps to a specific track index in the queue
 * @property {function(): void} toggleShuffle - Toggles shuffle mode on/off
 * @property {function(PlaylistQueue['repeat']): void} setRepeat - Sets repeat mode (none, one, all)
 * @property {function(AudioTrack): void} addToHistory - Adds a track to playback history
 */
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

/**
 * Default initial state for the playlist queue.
 * @constant {PlaylistQueue}
 * @private
 */
const defaultQueue: PlaylistQueue = {
  currentIndex: 0,
  tracks: [],
  history: [],
  shuffle: false,
  repeat: 'none',
};

/**
 * Zustand store hook for playlist queue management.
 * Manages the playback queue, navigation, shuffle, repeat, and playback history.
 * Persists entire queue state to localStorage.
 * @hook
 * @returns {PlaylistQueueStore} Playlist queue state and actions
 * @example
 * const { queue, next, previous, addToQueue, setRepeat } = usePlaylistQueueStore();
 *
 * // Add a track to the queue
 * addToQueue({
 *   id: '123',
 *   title: 'My Song',
 *   artist: 'Artist Name',
 *   url: '/music/song.mp3'
 * });
 *
 * // Navigate to next track
 * next();
 *
 * // Enable repeat all
 * setRepeat('all');
 */
export const usePlaylistQueueStore = create<PlaylistQueueStore>()(
  persist(
    (set) => ({
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

/**
 * Slideshow store interface for managing image slideshow state and configuration.
 * @interface SlideshowStore
 * @extends SlideshowState
 * @property {SlideshowConfig} config - Slideshow configuration settings
 * @property {function(SlideshowState['items']): void} setItems - Sets slideshow items
 * @property {function(number): void} setCurrentIndex - Sets current slide index
 * @property {function(boolean): void} setPlaying - Sets playing state
 * @property {function(boolean): void} setTransitioning - Sets transition state
 * @property {function(): void} next - Advances to next slide
 * @property {function(): void} previous - Goes back to previous slide
 * @property {function(Partial<SlideshowConfig>): void} updateConfig - Partially updates configuration
 */
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

/**
 * Default initial state for the slideshow.
 * @constant {SlideshowState}
 * @private
 */
const defaultSlideshowState: SlideshowState = {
  currentIndex: 0,
  items: [],
  isPlaying: false,
  isTransitioning: false,
};

/**
 * Default configuration for the slideshow.
 * @constant {SlideshowConfig}
 * @private
 */
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

/**
 * Zustand store hook for slideshow management.
 * Manages slideshow items, navigation, transitions, and configuration.
 * Persists only config to localStorage.
 * @hook
 * @returns {SlideshowStore} Slideshow state and actions
 * @example
 * const { items, currentIndex, next, setPlaying, updateConfig } = useSlideshowStore();
 *
 * // Set slideshow items
 * setItems([
 *   { id: '1', url: '/images/slide1.jpg', alt: 'First slide' },
 *   { id: '2', url: '/images/slide2.jpg', alt: 'Second slide' }
 * ]);
 *
 * // Navigate to next slide
 * next();
 *
 * // Configure slideshow
 * updateConfig({ interval: 3000, transition: 'slide' });
 */
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

/**
 * Track rating store interface for managing user ratings and feedback.
 * @interface RatingStore
 * @property {Record<string, TrackRating>} ratings - Map of track IDs to rating objects
 * @property {function(string, number, string?): void} setRating - Sets or updates a track rating
 * @property {function(string): void} removeRating - Removes a rating for a track
 * @property {function(string): TrackRating | undefined} getRating - Gets rating for a specific track
 * @property {function(): TrackRating[]} getAllRatings - Gets all ratings as an array
 * @property {function(): void} clearRatings - Clears all ratings
 */
interface RatingStore {
  ratings: Record<string, TrackRating>; // trackId -> rating
  // Actions
  setRating: (trackId: string, rating: number, comment?: string) => void;
  removeRating: (trackId: string) => void;
  getRating: (trackId: string) => TrackRating | undefined;
  getAllRatings: () => TrackRating[];
  clearRatings: () => void;
}

/**
 * Zustand store hook for track rating management.
 * Manages user ratings and comments for tracks with persistence.
 * Ratings are clamped to 1-5 range.
 * Persists all ratings to localStorage.
 * @hook
 * @returns {RatingStore} Rating state and actions
 * @example
 * const { ratings, setRating, getRating, removeRating } = useRatingStore();
 *
 * // Rate a track
 * setRating('track-123', 5, 'Amazing song!');
 *
 * // Get a rating
 * const trackRating = getRating('track-123');
 *
 * // Remove a rating
 * removeRating('track-123');
 */
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
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [trackId]: _removed, ...rest } = state.ratings;
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

/**
 * Selects the currently playing track from audio engine state.
 * @param {AudioEngineStore} state - Audio engine store state
 * @returns {AudioTrack | null} Current track or null
 */
export const selectCurrentTrack = (state: AudioEngineStore) => state.currentTrack;

/**
 * Determines if audio is currently playing.
 * @param {AudioEngineStore} state - Audio engine store state
 * @returns {boolean} True if status is 'playing'
 */
export const selectIsPlaying = (state: AudioEngineStore) => state.status === 'playing';

/**
 * Selects the current volume level.
 * @param {AudioEngineStore} state - Audio engine store state
 * @returns {number} Volume level (0 to 1)
 */
export const selectVolume = (state: AudioEngineStore) => state.volume;

/**
 * Calculates playback progress as a percentage.
 * @param {AudioEngineStore} state - Audio engine store state
 * @returns {number} Progress percentage (0 to 100)
 */
export const selectProgress = (state: AudioEngineStore) =>
  state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

// Queue Selectors

/**
 * Selects the current track from the playlist queue.
 * @param {PlaylistQueueStore} state - Playlist queue store state
 * @returns {AudioTrack | null} Current queue track or null
 */
export const selectCurrentQueueTrack = (state: PlaylistQueueStore) => {
  const { queue } = state;
  return queue.tracks[queue.currentIndex] || null;
};

/**
 * Gets the total number of tracks in the queue.
 * @param {PlaylistQueueStore} state - Playlist queue store state
 * @returns {number} Number of tracks in queue
 */
export const selectQueueLength = (state: PlaylistQueueStore) => state.queue.tracks.length;

/**
 * Determines if there is a next track available in the queue.
 * @param {PlaylistQueueStore} state - Playlist queue store state
 * @returns {boolean} True if next track is available
 */
export const selectHasNext = (state: PlaylistQueueStore) => {
  const { currentIndex, tracks, repeat } = state.queue;
  return currentIndex < tracks.length - 1 || repeat === 'all';
};

/**
 * Determines if there is a previous track available in the queue.
 * @param {PlaylistQueueStore} state - Playlist queue store state
 * @returns {boolean} True if previous track is available
 */
export const selectHasPrevious = (state: PlaylistQueueStore) => {
  const { currentIndex, repeat } = state.queue;
  return currentIndex > 0 || repeat === 'all';
};

// Slideshow Selectors

/**
 * Selects the current slide from the slideshow.
 * @param {SlideshowStore} state - Slideshow store state
 * @returns {SlideshowItem | null} Current slide or null
 */
export const selectCurrentSlide = (state: SlideshowStore) =>
  state.items[state.currentIndex] || null;

/**
 * Calculates slideshow progress as a percentage.
 * @param {SlideshowStore} state - Slideshow store state
 * @returns {number} Progress percentage (0 to 100)
 */
export const selectSlideshowProgress = (state: SlideshowStore) =>
  state.items.length > 0 ? ((state.currentIndex + 1) / state.items.length) * 100 : 0;
