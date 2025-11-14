/**
 * Media Module Type Definitions
 *
 * Comprehensive type system for multimedia audio/video/image management
 * Based on Daremon architecture with Adamowo integration
 */

// ============================================================================
// AUDIO ENGINE TYPES
// ============================================================================

/**
 * Represents a single audio track with metadata and accessibility features.
 *
 * @property id - Unique identifier for the track
 * @property title - Display title of the track
 * @property artist - Artist or creator name
 * @property album - Album name (optional)
 * @property url - URL to the audio file
 * @property coverUrl - URL to album/track artwork (optional)
 * @property duration - Track duration in seconds (optional)
 * @property genre - Musical or content genre (optional)
 * @property category - Content category for organization (optional)
 * @property mood - Array of mood tags for emotional context (optional)
 * @property therapeuticTags - Tags for therapeutic/wellness applications (optional)
 * @property educationalContext - Educational metadata and localization (optional)
 * @property accessibility - Accessibility features and content warnings (optional)
 */
export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  url: string;
  coverUrl?: string;
  duration?: number;
  genre?: string;
  category?: string;
  mood?: string[];
  therapeuticTags?: string[];
  educationalContext?: {
    relatedTopics?: string[];
    message?: string;
    languageKeys?: Record<string, string>;
  };
  accessibility?: {
    hasLyrics?: boolean;
    hasSignLanguage?: boolean;
    triggerWarnings?: string[];
  };
}

/**
 * Configuration options for the audio engine.
 *
 * @property crossfadeDuration - Duration of crossfade transitions in milliseconds
 * @property preloadNextTrack - Whether to preload the next track in queue
 * @property enableCaching - Enable audio buffer caching for faster playback
 * @property cacheSize - Maximum number of tracks to keep in cache
 * @property volume - Default volume level (0-1)
 * @property enableVisualization - Enable audio analysis for visualizations
 */
export interface AudioEngineConfig {
  crossfadeDuration: number; // milliseconds
  preloadNextTrack: boolean;
  enableCaching: boolean;
  cacheSize: number; // max cached tracks
  volume: number; // 0-1
  enableVisualization: boolean;
}

/**
 * Current state of the audio engine and active playback.
 *
 * @property status - Current playback status
 * @property currentTrack - Currently playing or loaded track (null if none)
 * @property nextTrack - Next queued track for preloading (null if none)
 * @property currentTime - Current playback position in seconds
 * @property duration - Total duration of current track in seconds
 * @property volume - Current volume level (0-1)
 * @property muted - Whether audio is muted
 * @property error - Error message if status is 'error' (null otherwise)
 * @property isTransitioning - True if crossfade is currently in progress
 */
export interface AudioEngineState {
  status: 'idle' | 'loading' | 'playing' | 'paused' | 'error' | 'buffering';
  currentTrack: AudioTrack | null;
  nextTrack: AudioTrack | null;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  error: string | null;
  isTransitioning: boolean; // crossfade in progress
}

/**
 * Cached audio buffer data with usage statistics.
 *
 * @property trackId - ID of the cached track
 * @property buffer - Decoded audio buffer ready for playback
 * @property cachedAt - Timestamp when track was cached (milliseconds since epoch)
 * @property accessCount - Number of times this cached track has been accessed
 * @property lastAccessed - Timestamp of most recent access (milliseconds since epoch)
 */
export interface AudioCache {
  trackId: string;
  buffer: AudioBuffer;
  cachedAt: number;
  accessCount: number;
  lastAccessed: number;
}

// ============================================================================
// PLAYLIST MANAGEMENT TYPES
// ============================================================================

/**
 * A collection of audio tracks with metadata.
 *
 * @property id - Unique identifier for the playlist
 * @property name - Display name of the playlist
 * @property tracks - Array of tracks in the playlist
 * @property createdAt - ISO 8601 timestamp of creation
 * @property updatedAt - ISO 8601 timestamp of last modification
 * @property isDefault - Whether this is a default system playlist (optional)
 */
export interface Playlist {
  id: string;
  name: string;
  tracks: AudioTrack[];
  createdAt: string;
  updatedAt: string;
  isDefault?: boolean;
}

/**
 * Playback queue with navigation and repeat settings.
 *
 * @property currentIndex - Index of currently playing track in tracks array
 * @property tracks - Ordered array of tracks in the queue
 * @property history - Array of previously played tracks in session
 * @property shuffle - Whether shuffle mode is enabled
 * @property repeat - Repeat mode ('none', 'one' track, or 'all' tracks)
 */
export interface PlaylistQueue {
  currentIndex: number;
  tracks: AudioTrack[];
  history: AudioTrack[];
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
}

/**
 * Record of a single playback session for analytics and history.
 *
 * @property trackId - ID of the track that was played
 * @property playedAt - ISO 8601 timestamp when playback started
 * @property duration - How long the track was played in seconds
 * @property completed - Whether the track was played to completion
 * @property skipReason - Reason for skipping if not completed (optional)
 */
export interface PlaybackHistory {
  trackId: string;
  playedAt: string;
  duration: number; // how long it was played
  completed: boolean; // finished or skipped
  skipReason?: 'user' | 'error' | 'auto';
}

// ============================================================================
// VISUALIZER TYPES
// ============================================================================

/**
 * Available visualization rendering modes for audio analysis.
 * Supports 2D canvas and 3D WebGL rendering styles.
 */
export type VisualizerMode = '2d-bars' | '2d-wave' | '2d-circular' | '3d-bars' | '3d-wave' | '3d-particles';

/**
 * Configuration for audio visualization rendering and analysis.
 *
 * @property mode - Visualization rendering mode
 * @property fftSize - FFT size for frequency analysis (must be power of 2)
 * @property smoothingTimeConstant - Temporal smoothing for analysis data (0-1)
 * @property minDecibels - Minimum decibel value for frequency data scaling
 * @property maxDecibels - Maximum decibel value for frequency data scaling
 * @property colorScheme - Color palette for visualization rendering
 * @property responsive - Whether visualization adapts to container size
 * @property particleCount - Number of particles for 3d-particles mode (optional)
 */
export interface VisualizerConfig {
  mode: VisualizerMode;
  fftSize: 32 | 64 | 128 | 256 | 512 | 1024 | 2048;
  smoothingTimeConstant: number; // 0-1
  minDecibels: number;
  maxDecibels: number;
  colorScheme: VisualizerColorScheme;
  responsive: boolean;
  particleCount?: number; // for 3d-particles mode
}

/**
 * Color scheme for visualization rendering.
 *
 * @property primary - Primary color for main visualization elements
 * @property secondary - Secondary color for supporting visual elements
 * @property accent - Accent color for highlights and peaks
 * @property background - Background color for the visualization canvas
 * @property gradient - Optional array of colors for gradient rendering
 */
export interface VisualizerColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  gradient?: string[];
}

/**
 * Real-time audio frequency and waveform analysis data.
 *
 * @property frequencyData - Raw frequency domain data from FFT analysis
 * @property timeDomainData - Raw time domain waveform data
 * @property averageFrequency - Average frequency value across spectrum (0-255)
 * @property peakFrequency - Highest frequency value in current frame (0-255)
 * @property bassLevel - Normalized bass frequency level (0-1)
 * @property midLevel - Normalized mid-range frequency level (0-1)
 * @property trebleLevel - Normalized treble frequency level (0-1)
 */
export interface AudioAnalysisData {
  frequencyData: Uint8Array;
  timeDomainData: Uint8Array;
  averageFrequency: number;
  peakFrequency: number;
  bassLevel: number; // 0-1
  midLevel: number; // 0-1
  trebleLevel: number; // 0-1
}

// ============================================================================
// SLIDESHOW TYPES
// ============================================================================

/**
 * Represents a media item (image or video) for slideshow display.
 *
 * @property id - Unique identifier for the media item
 * @property type - Media type ('image' or 'video')
 * @property url - URL to the media file
 * @property thumbnailUrl - URL to thumbnail preview (optional)
 * @property title - Display title (optional)
 * @property description - Description or caption (optional)
 * @property duration - Video duration or image display time in seconds (optional)
 * @property tags - Array of tags for categorization (optional)
 * @property createdAt - ISO 8601 timestamp of creation
 */
export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  duration?: number; // for videos or display time for images
  tags?: string[];
  createdAt: string;
}

/**
 * Configuration for slideshow playback and transitions.
 *
 * @property autoPlay - Whether slideshow plays automatically
 * @property interval - Time between slides in milliseconds
 * @property transition - Transition effect between slides
 * @property transitionDuration - Duration of transition animation in milliseconds
 * @property shuffle - Whether to randomize slide order
 * @property loop - Whether to loop back to start after last slide
 * @property showControls - Whether to display playback controls
 * @property showProgress - Whether to display progress indicator
 */
export interface SlideshowConfig {
  autoPlay: boolean;
  interval: number; // milliseconds between slides
  transition: 'fade' | 'slide' | 'zoom' | 'none';
  transitionDuration: number; // milliseconds
  shuffle: boolean;
  loop: boolean;
  showControls: boolean;
  showProgress: boolean;
}

/**
 * Current state of slideshow playback.
 *
 * @property currentIndex - Index of currently displayed item
 * @property items - Array of media items in the slideshow
 * @property isPlaying - Whether slideshow is currently playing
 * @property isTransitioning - Whether transition animation is in progress
 */
export interface SlideshowState {
  currentIndex: number;
  items: MediaItem[];
  isPlaying: boolean;
  isTransitioning: boolean;
}

// ============================================================================
// RATING SYSTEM TYPES
// ============================================================================

/**
 * User rating for a specific track.
 *
 * @property trackId - ID of the rated track
 * @property rating - Star rating (1-5)
 * @property ratedAt - ISO 8601 timestamp when rating was given
 * @property comment - Optional text comment (optional)
 * @property userId - ID of user who rated (for logged-in users, optional)
 * @property syncStatus - Synchronization status with remote database
 */
export interface TrackRating {
  trackId: string;
  rating: number; // 1-5 stars
  ratedAt: string;
  comment?: string;
  userId?: string; // for logged-in users
  syncStatus: 'local' | 'synced' | 'pending';
}

/**
 * Aggregated rating statistics for a track.
 *
 * @property trackId - ID of the track
 * @property averageRating - Average rating value (1-5)
 * @property totalRatings - Total number of ratings received
 * @property distribution - Count of ratings at each star level (1-5)
 */
export interface RatingStats {
  trackId: string;
  averageRating: number;
  totalRatings: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>; // count per star level
}

// ============================================================================
// MEDIA MANIFEST TYPES
// ============================================================================

/**
 * Manifest describing all available media files and metadata.
 *
 * @property version - Manifest format version
 * @property generatedAt - ISO 8601 timestamp when manifest was generated
 * @property images - Array of available image media items
 * @property videos - Array of available video media items
 * @property audio - Array of available audio tracks
 * @property totalSize - Combined size of all media files in bytes (optional)
 * @property checksums - Map of file URLs to their checksums for integrity verification (optional)
 */
export interface MediaManifest {
  version: string;
  generatedAt: string;
  images: MediaItem[];
  videos: MediaItem[];
  audio: AudioTrack[];
  totalSize?: number; // bytes
  checksums?: Record<string, string>;
}

// ============================================================================
// THEME & ANIMATIONS TYPES
// ============================================================================

/**
 * Theme configuration for UI appearance and animations.
 *
 * @property mode - Theme mode ('light', 'dark', or 'auto' based on system)
 * @property accentColor - Primary accent color for interactive elements
 * @property backgroundColor - Background color for UI surfaces
 * @property textColor - Text color for readability
 * @property animations - Animation behavior configuration
 */
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto';
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  animations: AnimationConfig;
}

/**
 * Configuration for animation behavior and accessibility.
 *
 * @property enabled - Whether animations are enabled globally
 * @property respectsMotionPreference - Whether to honor prefers-reduced-motion
 * @property intensity - Animation intensity level
 * @property audioReactive - Whether animations respond to audio levels
 */
export interface AnimationConfig {
  enabled: boolean;
  respectsMotionPreference: boolean;
  intensity: 'low' | 'medium' | 'high';
  audioReactive: boolean; // animations react to audio levels
}

// ============================================================================
// PWA & OFFLINE TYPES
// ============================================================================

/**
 * Availability status of media for offline playback.
 *
 * @property trackId - ID of the track being checked
 * @property isOnline - Whether track is accessible via network
 * @property isCached - Whether track is cached in service worker
 * @property isDownloaded - Whether track is permanently downloaded
 * @property cacheStatus - Overall cache status
 * @property downloadProgress - Download completion percentage (0-100, optional)
 */
export interface MediaAvailability {
  trackId: string;
  isOnline: boolean;
  isCached: boolean;
  isDownloaded: boolean;
  cacheStatus: 'none' | 'partial' | 'complete';
  downloadProgress?: number; // 0-100 percentage
}

/**
 * Caching strategy for media resource management.
 *
 * @property type - Cache strategy type (network-first, cache-first, etc.)
 * @property maxAge - Maximum age for cached items in milliseconds
 * @property maxSize - Maximum total cache size in bytes
 */
export interface CacheStrategy {
  type: 'network-first' | 'cache-first' | 'network-only' | 'cache-only' | 'stale-while-revalidate';
  maxAge: number; // milliseconds
  maxSize: number; // bytes
}

// ============================================================================
// EVENT TYPES
// ============================================================================

/**
 * Discriminated union of all possible audio engine events.
 * Used for type-safe event handling and state updates.
 */
export type AudioEngineEvent =
  | { type: 'trackStart'; track: AudioTrack }
  | { type: 'trackEnd'; track: AudioTrack }
  | { type: 'trackChange'; from: AudioTrack | null; to: AudioTrack }
  | { type: 'play' }
  | { type: 'pause' }
  | { type: 'stop' }
  | { type: 'error'; error: Error; track?: AudioTrack }
  | { type: 'volumeChange'; volume: number }
  | { type: 'timeUpdate'; currentTime: number; duration: number }
  | { type: 'bufferProgress'; progress: number }
  | { type: 'crossfadeStart'; from: AudioTrack; to: AudioTrack }
  | { type: 'crossfadeEnd'; track: AudioTrack };

/**
 * Discriminated union of all possible playlist events.
 * Used for tracking playlist modifications and queue updates.
 */
export type PlaylistEvent =
  | { type: 'trackAdded'; track: AudioTrack; position: number }
  | { type: 'trackRemoved'; trackId: string; position: number }
  | { type: 'trackMoved'; trackId: string; from: number; to: number }
  | { type: 'playlistCleared' }
  | { type: 'playlistLoaded'; playlist: Playlist }
  | { type: 'queueUpdated'; queue: PlaylistQueue };

/**
 * Discriminated union of all possible visualizer events.
 * Used for tracking visualizer state changes and errors.
 */
export type VisualizerEvent =
  | { type: 'modeChanged'; mode: VisualizerMode }
  | { type: 'started' }
  | { type: 'stopped' }
  | { type: 'error'; error: Error };

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Utility type for making all properties in T deeply optional.
 * Recursively applies Partial to nested object properties.
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Discriminated union representing the state of an async operation.
 * Provides type-safe handling of loading, success, and error states.
 *
 * @example
 * ```typescript
 * let result: AsyncResult<AudioTrack[]>;
 *
 * if (result.status === 'success') {
 *   console.log(result.data); // TypeScript knows data exists
 * }
 * ```
 */
export type AsyncResult<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };
