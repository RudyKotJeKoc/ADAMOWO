/**
 * Media Feature Module Exports
 *
 * Central export point for all multimedia components, services, and utilities
 */

// Components
export { AudioEngine } from './AudioEngine';
export { AudioVisualizer, VisualizerModeSwitcher } from './AudioVisualizer';
export { Slideshow } from './Slideshow';
export { TrackRatingCard, StarRatingInput, RatingStatistics, RatingsList } from './Rating';

// Services
export * from './PlaylistService';

// Theme Engine
export { ThemeEngine, getThemeEngine, THEMES } from './ThemeEngine';
export type { ColorPalette, AudioReactiveTheme } from './ThemeEngine';

// Types
export type {
  AudioTrack,
  AudioEngineConfig,
  AudioEngineState,
  AudioCache,
  Playlist,
  PlaylistQueue,
  PlaybackHistory,
  VisualizerMode,
  VisualizerConfig,
  VisualizerColorScheme,
  AudioAnalysisData,
  MediaItem,
  SlideshowConfig,
  SlideshowState,
  TrackRating,
  RatingStats,
  MediaManifest,
  ThemeConfig,
  AnimationConfig,
  MediaAvailability,
  CacheStrategy,
  AudioEngineEvent,
  PlaylistEvent,
  VisualizerEvent,
} from './media.schema';
