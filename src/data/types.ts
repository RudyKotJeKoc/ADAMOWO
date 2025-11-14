/**
 * Represents a single item in the music playlist.
 * @typedef {Object} PlaylistItem
 * @property {string} id - Unique playlist item identifier
 * @property {string} title - Track title
 * @property {string} [artist] - Artist name
 * @property {string} url - URL to the audio file
 * @property {string} [coverUrl] - URL to the cover image
 * @property {number} position - Position in the playlist (for ordering)
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
 * @typedef {Object} NowPlaying
 * @property {string} title - Track or show title
 * @property {string} [artist] - Artist or presenter name
 * @property {string} [track] - Specific track name (if different from title)
 * @property {string} [coverUrl] - URL to the cover image
 * @property {string} startedAt - ISO timestamp when the track started playing
 * @property {number} [duration] - Track duration in seconds
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
 * Represents a chapter marker within an episode.
 * @typedef {Object} EpisodeChapter
 * @property {string} title - Chapter title or description
 * @property {number} startSec - Start time in seconds from episode beginning
 */
export type EpisodeChapter = {
  title: string;
  startSec: number;
};

/**
 * Represents an external resource link associated with an episode.
 * @typedef {Object} EpisodeResource
 * @property {string} label - Display label for the resource link
 * @property {string} url - URL to the external resource
 */
export type EpisodeResource = {
  label: string;
  url: string;
};

/**
 * Complete episode data structure with metadata, content, and references.
 * @typedef {Object} Episode
 * @property {string} id - Unique episode identifier
 * @property {string} title - Episode title
 * @property {string} category - Primary category (e.g., 'analysis', 'education')
 * @property {string[]} tags - Array of topic tags for filtering
 * @property {string} description - Episode description or summary
 * @property {number} durationSec - Episode duration in seconds
 * @property {string} audioUrl - URL to the audio file
 * @property {string} [coverUrl] - URL to the cover image
 * @property {string} publishedAt - ISO timestamp of publication date
 * @property {EpisodeChapter[]} [chapters] - Optional chapter markers
 * @property {EpisodeResource[]} [resources] - Optional external resource links
 * @property {string} [slug] - URL-friendly slug for routing
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
 * Sort order options for episode queries.
 * @typedef {'newest'|'oldest'|'durationAsc'|'durationDesc'} EpisodeSort
 */
export type EpisodeSort = 'newest' | 'oldest' | 'durationAsc' | 'durationDesc';

/**
 * Query parameters for filtering and paginating episodes.
 * @typedef {Object} EpisodeQuery
 * @property {string} [q] - Text search query (searches title, description, tags)
 * @property {string[]} [categories] - Filter by categories
 * @property {string[]} [tags] - Filter by tags (all must match)
 * @property {EpisodeSort} [sort] - Sort order (default: 'newest')
 * @property {number} [page] - Page number (1-indexed, default: 1)
 * @property {number} [pageSize] - Number of items per page (default: 10)
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
 * Metadata about available filter options with counts.
 * @typedef {Object} EpisodeFiltersMetadata
 * @property {Array<{value: string, count: number}>} categories - Available categories with episode counts
 * @property {Array<{value: string, count: number}>} tags - Available tags with episode counts
 */
export type EpisodeFiltersMetadata = {
  categories: { value: string; count: number }[];
  tags: { value: string; count: number }[];
};

/**
 * Paginated query result containing episodes and metadata.
 * @typedef {Object} EpisodeQueryResult
 * @property {Episode[]} episodes - Array of matching episodes
 * @property {number} total - Total number of matching episodes (across all pages)
 * @property {number} page - Current page number (1-indexed)
 * @property {number} pageSize - Number of items per page
 * @property {EpisodeFiltersMetadata} metadata - Available filter options with counts
 */
export type EpisodeQueryResult = {
  episodes: Episode[];
  total: number;
  page: number;
  pageSize: number;
  metadata: EpisodeFiltersMetadata;
};
