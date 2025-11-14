/**
 * Represents a single item in the playlist.
 *
 * @property id - Unique identifier for the playlist item
 * @property title - Title of the track
 * @property artist - Optional artist name
 * @property url - URL to the audio file
 * @property coverUrl - Optional URL to the cover image
 * @property position - Position in the playlist (0-indexed)
 */
export type PlaylistItem = {
  id: string;
  title: string;
  artist?: string;
  url: string;
  coverUrl?: string;
  position: number;
};

/**
 * Represents the currently playing track information.
 *
 * @property title - Title of the currently playing track
 * @property artist - Optional artist name
 * @property track - Optional track identifier
 * @property coverUrl - Optional URL to the cover image
 * @property startedAt - ISO 8601 timestamp when the track started playing
 * @property duration - Optional duration in seconds
 */
export type NowPlaying = {
  title: string;
  artist?: string;
  track?: string;
  coverUrl?: string;
  startedAt: string;
  duration?: number;
};

/**
 * Represents a chapter or segment within an episode.
 *
 * @property title - Title of the chapter
 * @property startSec - Starting time of the chapter in seconds
 */
export type EpisodeChapter = {
  title: string;
  startSec: number;
};

/**
 * Represents an external resource or reference associated with an episode.
 *
 * @property label - Display label for the resource
 * @property url - URL to the resource
 */
export type EpisodeResource = {
  label: string;
  url: string;
};

/**
 * Represents a complete episode with all its metadata.
 *
 * @property id - Unique identifier for the episode
 * @property title - Episode title
 * @property category - Category classification of the episode
 * @property tags - Array of tags for categorization and search
 * @property description - Detailed description of the episode
 * @property durationSec - Duration in seconds
 * @property audioUrl - URL to the audio file
 * @property coverUrl - Optional URL to the episode cover image
 * @property publishedAt - ISO 8601 timestamp when the episode was published
 * @property chapters - Optional array of chapter markers
 * @property resources - Optional array of related resources
 * @property slug - Optional URL-friendly identifier
 */
export type Episode = {
  id: string;
  title: string;
  category: string;
  tags: string[];
  description: string;
  durationSec: number;
  audioUrl: string;
  coverUrl?: string;
  publishedAt: string;
  chapters?: EpisodeChapter[];
  resources?: EpisodeResource[];
  slug?: string;
};

/**
 * Sorting options for episode queries.
 *
 * - 'newest': Sort by publication date (newest first)
 * - 'oldest': Sort by publication date (oldest first)
 * - 'durationAsc': Sort by duration (shortest first)
 * - 'durationDesc': Sort by duration (longest first)
 */
export type EpisodeSort = 'newest' | 'oldest' | 'durationAsc' | 'durationDesc';

/**
 * Query parameters for filtering and searching episodes.
 *
 * @property q - Optional search query string
 * @property categories - Optional array of categories to filter by
 * @property tags - Optional array of tags to filter by
 * @property sort - Optional sort order (defaults to 'newest')
 * @property page - Optional page number for pagination (1-indexed)
 * @property pageSize - Optional number of results per page
 */
export type EpisodeQuery = {
  q?: string;
  categories?: string[];
  tags?: string[];
  sort?: EpisodeSort;
  page?: number;
  pageSize?: number;
};

/**
 * Metadata about available filter options and their counts.
 *
 * @property categories - Available categories with episode counts
 * @property tags - Available tags with episode counts
 */
export type EpisodeFiltersMetadata = {
  categories: { value: string; count: number }[];
  tags: { value: string; count: number }[];
};

/**
 * Result of an episode query including episodes and pagination metadata.
 *
 * @property episodes - Array of episodes matching the query
 * @property total - Total number of episodes matching the query (across all pages)
 * @property page - Current page number (1-indexed)
 * @property pageSize - Number of results per page
 * @property metadata - Filter metadata including available categories and tags with counts
 */
export type EpisodeQueryResult = {
  episodes: Episode[];
  total: number;
  page: number;
  pageSize: number;
  metadata: EpisodeFiltersMetadata;
};
