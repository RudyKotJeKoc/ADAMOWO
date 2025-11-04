/**
 * Media Module Type Definitions
 *
 * Comprehensive type system for multimedia audio/video/image management
 * Based on Daremon architecture with Adamowo integration
 */

// ============================================================================
// AUDIO ENGINE TYPES
// ============================================================================

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

export interface AudioEngineConfig {
  crossfadeDuration: number; // milliseconds
  preloadNextTrack: boolean;
  enableCaching: boolean;
  cacheSize: number; // max cached tracks
  volume: number; // 0-1
  enableVisualization: boolean;
}

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

export interface Playlist {
  id: string;
  name: string;
  tracks: AudioTrack[];
  createdAt: string;
  updatedAt: string;
  isDefault?: boolean;
}

export interface PlaylistQueue {
  currentIndex: number;
  tracks: AudioTrack[];
  history: AudioTrack[];
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
}

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

export type VisualizerMode = '2d-bars' | '2d-wave' | '2d-circular' | '3d-bars' | '3d-wave' | '3d-particles';

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

export interface VisualizerColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  gradient?: string[];
}

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

export interface SlideshowState {
  currentIndex: number;
  items: MediaItem[];
  isPlaying: boolean;
  isTransitioning: boolean;
}

// ============================================================================
// RATING SYSTEM TYPES
// ============================================================================

export interface TrackRating {
  trackId: string;
  rating: number; // 1-5 stars
  ratedAt: string;
  comment?: string;
  userId?: string; // for logged-in users
  syncStatus: 'local' | 'synced' | 'pending';
}

export interface RatingStats {
  trackId: string;
  averageRating: number;
  totalRatings: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>; // count per star level
}

// ============================================================================
// MEDIA MANIFEST TYPES
// ============================================================================

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

export interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto';
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  animations: AnimationConfig;
}

export interface AnimationConfig {
  enabled: boolean;
  respectsMotionPreference: boolean;
  intensity: 'low' | 'medium' | 'high';
  audioReactive: boolean; // animations react to audio levels
}

// ============================================================================
// PWA & OFFLINE TYPES
// ============================================================================

export interface MediaAvailability {
  trackId: string;
  isOnline: boolean;
  isCached: boolean;
  isDownloaded: boolean;
  cacheStatus: 'none' | 'partial' | 'complete';
  downloadProgress?: number; // 0-100 percentage
}

export interface CacheStrategy {
  type: 'network-first' | 'cache-first' | 'network-only' | 'cache-only' | 'stale-while-revalidate';
  maxAge: number; // milliseconds
  maxSize: number; // bytes
}

// ============================================================================
// EVENT TYPES
// ============================================================================

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

export type PlaylistEvent =
  | { type: 'trackAdded'; track: AudioTrack; position: number }
  | { type: 'trackRemoved'; trackId: string; position: number }
  | { type: 'trackMoved'; trackId: string; from: number; to: number }
  | { type: 'playlistCleared' }
  | { type: 'playlistLoaded'; playlist: Playlist }
  | { type: 'queueUpdated'; queue: PlaylistQueue };

export type VisualizerEvent =
  | { type: 'modeChanged'; mode: VisualizerMode }
  | { type: 'started' }
  | { type: 'stopped' }
  | { type: 'error'; error: Error };

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type AsyncResult<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };
