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
 * Audio engine store interface extending the base state with configuration and actions.
 * Manages the complete lifecycle of audio playback including transitions and error handling.
 *
 * @property status - Current playback status ('idle' | 'loading' | 'playing' | 'paused' | 'error')
 * @property currentTrack - Currently playing track, null if none
 * @property nextTrack - Next track queued for playback, null if none
 * @property currentTime - Current playback position in seconds
 * @property duration - Total track duration in seconds
 * @property volume - Volume level (0.0 to 1.0)
 * @property muted - Whether audio is muted
 * @property error - Error message if status is 'error', null otherwise
 * @property isTransitioning - Whether a crossfade transition is in progress
 * @property config - Audio engine configuration settings
 * @property setStatus - Sets the playback status
 * @property setCurrentTrack - Sets the currently playing track
 * @property setNextTrack - Sets the next track in queue
 * @property setCurrentTime - Updates the current playback position
 * @property setDuration - Sets the total track duration
 * @property setVolume - Sets the volume level (0.0 to 1.0)
 * @property setMuted - Sets the muted state
 * @property setError - Sets or clears the error message
 * @property setTransitioning - Sets the transition state
 * @property updateConfig - Partially updates the configuration
 * @property reset - Resets the store to default state
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
 * Default audio engine state.
 * Initializes the audio engine in idle state with no tracks loaded.
 *
 * @internal
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
 * Default audio engine configuration.
 * Configures crossfade duration, track preloading, caching, and visualization.
 *
 * @internal
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
 * Zustand store for audio engine state management.
 * Provides centralized control over audio playback with persistence for user preferences.
 * Volume, mute state, and configuration are persisted to localStorage.
 *
 * @example
 * ```typescript
 * // In a component:
 * const { currentTrack, status, setCurrentTrack, setStatus } = useAudioEngineStore();
 *
 * // Start playing a track
 * const playTrack = (track: AudioTrack) => {
 *   setCurrentTrack(track);
 *   setStatus('playing');
 * };
 *
 * // Update volume
 * const { setVolume, volume } = useAudioEngineStore();
 * setVolume(0.5); // Set to 50%
 *
 * // Configure crossfade
 * const { updateConfig } = useAudioEngineStore();
 * updateConfig({ crossfadeDuration: 5000 }); // 5 second crossfade
 * ```
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
 * Visualizer store interface for managing audio visualization settings and state.
 * Controls the visual representation of audio frequency data.
 *
 * @property config - Visualizer configuration including mode, FFT settings, and colors
 * @property isActive - Whether the visualizer is currently active
 * @property setMode - Sets the visualization mode
 * @property setActive - Enables or disables the visualizer
 * @property updateConfig - Partially updates the configuration
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
 * Default visualizer configuration.
 * Sets up 2D bar visualization with amber color scheme matching the brand.
 *
 * @internal
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
 * Zustand store for audio visualizer settings.
 * Manages visualization mode, activity state, and configuration with localStorage persistence.
 *
 * @example
 * ```typescript
 * // In a component:
 * const { config, isActive, setMode, updateConfig } = useVisualizerStore();
 *
 * // Change visualization mode
 * setMode('3d-waveform');
 *
 * // Update FFT size for more detail
 * updateConfig({ fftSize: 512 });
 *
 * // Customize colors
 * updateConfig({
 *   colorScheme: {
 *     ...config.colorScheme,
 *     primary: '#00ff00'
 *   }
 * });
 * ```
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
 * Playlist queue store interface for managing track playback order and history.
 * Handles queue navigation, shuffle, repeat modes, and playback history.
 *
 * @property queue - Complete queue state including tracks, index, and playback modes
 * @property setQueue - Replaces the entire queue with new tracks
 * @property addToQueue - Appends a track to the end of the queue
 * @property removeFromQueue - Removes a track by ID from the queue
 * @property clearQueue - Removes all tracks from the queue
 * @property next - Advances to the next track respecting repeat settings
 * @property previous - Goes back to the previous track respecting repeat settings
 * @property jumpTo - Jumps to a specific track index in the queue
 * @property toggleShuffle - Toggles shuffle mode on/off
 * @property setRepeat - Sets the repeat mode ('none' | 'one' | 'all')
 * @property addToHistory - Adds a track to playback history (max 50 tracks)
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
 * Default playlist queue state.
 * Initializes an empty queue with no shuffle or repeat.
 *
 * @internal
 */
const defaultQueue: PlaylistQueue = {
  currentIndex: 0,
  tracks: [],
  history: [],
  shuffle: false,
  repeat: 'none',
};

/**
 * Zustand store for playlist queue management.
 * Handles track ordering, navigation, shuffle, repeat modes, and playback history
 * with localStorage persistence.
 *
 * @example
 * ```typescript
 * // In a component:
 * const { queue, setQueue, next, toggleShuffle } = usePlaylistQueueStore();
 *
 * // Load a playlist
 * const tracks: AudioTrack[] = [...];
 * setQueue(tracks);
 *
 * // Navigate playback
 * next(); // Move to next track
 *
 * // Enable shuffle and repeat
 * toggleShuffle();
 * setRepeat('all');
 *
 * // Jump to specific track
 * jumpTo(5); // Play track at index 5
 *
 * // Check current track
 * const currentTrack = queue.tracks[queue.currentIndex];
 * ```
 */
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

/**
 * Slideshow store interface for managing image/content slideshow state and playback.
 * Controls slideshow navigation, auto-play, transitions, and configuration.
 *
 * @property currentIndex - Index of the currently displayed slide
 * @property items - Array of slideshow items (images, content, etc.)
 * @property isPlaying - Whether the slideshow is auto-playing
 * @property isTransitioning - Whether a slide transition is in progress
 * @property config - Slideshow configuration including timing and transition effects
 * @property setItems - Replaces all slideshow items and resets to first slide
 * @property setCurrentIndex - Jumps to a specific slide index
 * @property setPlaying - Starts or stops auto-play
 * @property setTransitioning - Sets the transition state
 * @property next - Advances to the next slide respecting loop settings
 * @property previous - Goes back to the previous slide respecting loop settings
 * @property updateConfig - Partially updates the configuration
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
 * Default slideshow state.
 * Initializes an empty slideshow that is not playing.
 *
 * @internal
 */
const defaultSlideshowState: SlideshowState = {
  currentIndex: 0,
  items: [],
  isPlaying: false,
  isTransitioning: false,
};

/**
 * Default slideshow configuration.
 * Sets up auto-play with 5-second intervals and fade transitions.
 *
 * @internal
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
 * Zustand store for slideshow state management.
 * Manages slideshow playback, navigation, and configuration with localStorage persistence
 * for user preferences.
 *
 * @example
 * ```typescript
 * // In a component:
 * const { items, currentIndex, setItems, next, setPlaying } = useSlideshowStore();
 *
 * // Load slideshow items
 * const slides = [
 *   { id: '1', url: '/images/slide1.jpg', caption: 'First slide' },
 *   { id: '2', url: '/images/slide2.jpg', caption: 'Second slide' }
 * ];
 * setItems(slides);
 *
 * // Start auto-play
 * setPlaying(true);
 *
 * // Navigate manually
 * next();
 *
 * // Configure slideshow
 * updateConfig({ interval: 3000, transition: 'slide' });
 * ```
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
 * Rating store interface for managing user track ratings and comments.
 * Stores ratings locally with sync status for future backend integration.
 *
 * @property ratings - Record mapping track IDs to their ratings
 * @property setRating - Sets or updates a rating for a track (1-5 stars)
 * @property removeRating - Removes a rating for a track
 * @property getRating - Retrieves the rating for a specific track
 * @property getAllRatings - Retrieves all ratings as an array
 * @property clearRatings - Removes all ratings
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
 * Zustand store for track rating management.
 * Stores user ratings (1-5 stars) and optional comments with localStorage persistence.
 * Ratings are clamped to 1-5 range and include sync status for future backend integration.
 *
 * @example
 * ```typescript
 * // In a component:
 * const { setRating, getRating, getAllRatings } = useRatingStore();
 *
 * // Rate a track
 * setRating('track-123', 5, 'Amazing track!');
 *
 * // Get a specific rating
 * const rating = getRating('track-123');
 * if (rating) {
 *   console.log(`Rating: ${rating.rating}/5 - ${rating.comment}`);
 * }
 *
 * // Get all ratings
 * const allRatings = getAllRatings();
 * const averageRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
 *
 * // Remove a rating
 * removeRating('track-123');
 * ```
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

/**
 * Selects the currently playing track from the audio engine store.
 *
 * @param state - Audio engine store state
 * @returns Currently playing track, or null if none
 */
export const selectCurrentTrack = (state: AudioEngineStore) => state.currentTrack;

/**
 * Selects whether audio is currently playing.
 *
 * @param state - Audio engine store state
 * @returns true if status is 'playing', false otherwise
 */
export const selectIsPlaying = (state: AudioEngineStore) => state.status === 'playing';

/**
 * Selects the current volume level.
 *
 * @param state - Audio engine store state
 * @returns Volume level (0.0 to 1.0)
 */
export const selectVolume = (state: AudioEngineStore) => state.volume;

/**
 * Selects the playback progress as a percentage.
 *
 * @param state - Audio engine store state
 * @returns Progress percentage (0-100), or 0 if duration is unknown
 */
export const selectProgress = (state: AudioEngineStore) =>
  state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

/**
 * Selects the current track from the playlist queue.
 *
 * @param state - Playlist queue store state
 * @returns Current track from queue, or null if queue is empty
 */
export const selectCurrentQueueTrack = (state: PlaylistQueueStore) => {
  const { queue } = state;
  return queue.tracks[queue.currentIndex] || null;
};

/**
 * Selects the total number of tracks in the queue.
 *
 * @param state - Playlist queue store state
 * @returns Number of tracks in queue
 */
export const selectQueueLength = (state: PlaylistQueueStore) => state.queue.tracks.length;

/**
 * Selects whether there is a next track available.
 * Considers repeat mode when determining availability.
 *
 * @param state - Playlist queue store state
 * @returns true if next track is available (including when repeat is 'all')
 */
export const selectHasNext = (state: PlaylistQueueStore) => {
  const { currentIndex, tracks, repeat } = state.queue;
  return currentIndex < tracks.length - 1 || repeat === 'all';
};

/**
 * Selects whether there is a previous track available.
 * Considers repeat mode when determining availability.
 *
 * @param state - Playlist queue store state
 * @returns true if previous track is available (including when repeat is 'all')
 */
export const selectHasPrevious = (state: PlaylistQueueStore) => {
  const { currentIndex, repeat } = state.queue;
  return currentIndex > 0 || repeat === 'all';
};

/**
 * Selects the current slide from the slideshow.
 *
 * @param state - Slideshow store state
 * @returns Current slide item, or null if slideshow is empty
 */
export const selectCurrentSlide = (state: SlideshowStore) => state.items[state.currentIndex] || null;

/**
 * Selects the slideshow progress as a percentage.
 *
 * @param state - Slideshow store state
 * @returns Progress percentage (0-100), or 0 if slideshow is empty
 */
export const selectSlideshowProgress = (state: SlideshowStore) =>
  state.items.length > 0 ? ((state.currentIndex + 1) / state.items.length) * 100 : 0;
