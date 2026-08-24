
import type { ProgramId } from '../studio/studio.schema';

import type {
  Episode as BaseEpisode,
  EpisodeFiltersMetadata as BaseEpisodeFiltersMetadata,
  EpisodeQuery as BaseEpisodeQuery,
  EpisodeQueryResult as BaseEpisodeQueryResult,
  EpisodeResource,
  EpisodeSort as BaseEpisodeSort
} from '../../data/types';


/**
 * Represents a chapter or segment within an episode.
 *
 * @property title - Title of the chapter
 * @property startSec - Starting time of the chapter in seconds
 */
export type Chapter = {
  title: string;
  startSec: number;
};

/**
 * Category classification for analysis archive episodes.
 *
 * - 'AktDarowania': Episode about the Act of Donation
 * - 'SłużebnośćUwiązania': Episode about Servitude and Entanglement
 * - 'BronNarcyza': Episode about Narcissist's Weapon
 * - 'Sledztwo': Episode about Investigation
 */
export type EpisodeCategory =
  | 'AktDarowania'
  | 'SłużebnośćUwiązania'
  | 'BronNarcyza'
  | 'Sledztwo';

/**
 * Sorting options for episode queries.
 * Re-exported from base types for consistency.
 *
 * - 'newest': Sort by publication date (newest first)
 * - 'oldest': Sort by publication date (oldest first)
 * - 'durationAsc': Sort by duration (shortest first)
 * - 'durationDesc': Sort by duration (longest first)
 */
export type EpisodeSort = BaseEpisodeSort;

/**
 * Represents a complete episode in the analysis archive with all its metadata.
 * Extends the base Episode type with strict typing for category and guaranteed required fields.
 *
 * @property id - Unique identifier for the episode
 * @property title - Episode title
 * @property slug - URL-friendly identifier (guaranteed to be present)
 * @property category - Category classification (strictly typed to EpisodeCategory)
 * @property tags - Array of tags for categorization and search
 * @property description - Detailed description of the episode
 * @property durationSec - Duration in seconds
 * @property audioUrl - URL to the audio file
 * @property coverUrl - Optional URL to the episode cover image
 * @property publishedAt - ISO 8601 timestamp when the episode was published
 * @property programId - Optional program/show identifier
 * @property chapters - Optional array of chapter markers
 * @property resources - Optional array of external resources or references
 */
export type Episode = Omit<BaseEpisode, 'category' | 'slug' | 'resources' | 'chapters'> & {
  slug: string;
  category: EpisodeCategory;

  tags: string[];
  description: string;
  durationSec: number;
  audioUrl: string;
  coverUrl?: string;
  publishedAt: string;
  programId?: ProgramId;
  chapters?: Chapter[];
  resources?: EpisodeResource[];
};

/**
 * Query parameters for filtering and searching analysis archive episodes.
 * Extends the base query with strict typing for categories and program filtering.
 *
 * @property q - Optional search query string (searches in title and description)
 * @property categories - Optional array of episode categories to filter by (strictly typed)
 * @property tags - Optional array of tags to filter by (episode must have all specified tags)
 * @property sort - Optional sort order (defaults to 'newest')
 * @property page - Optional page number for pagination (1-indexed, defaults to 1)
 * @property pageSize - Optional number of results per page (defaults to 10)
 * @property programId - Optional program identifier to filter episodes by show
 */
export type EpisodeQuery = Omit<BaseEpisodeQuery, 'categories'> & {
  categories?: EpisodeCategory[];

  tags?: string[];
  sort?: EpisodeSort;
  page?: number;
  pageSize?: number;
  programId?: ProgramId;
};

/**
 * Metadata about available filter options and their counts.
 * Used to display filter UI with episode counts for each option.
 *
 * @property categories - Available categories with episode counts (strictly typed to EpisodeCategory)
 * @property tags - Available tags with episode counts (re-exported from base metadata)
 */
export type EpisodeFiltersMetadata = {
  categories: { value: EpisodeCategory; count: number }[];
  tags: BaseEpisodeFiltersMetadata['tags'];
};

/**
 * Result of an episode query including episodes and pagination metadata.
 * Extends the base query result with strict typing for episodes and metadata.
 *
 * @property episodes - Array of episodes matching the query (with strict EpisodeCategory typing)
 * @property total - Total number of episodes matching the query (across all pages)
 * @property page - Current page number (1-indexed)
 * @property pageSize - Number of results per page
 * @property metadata - Filter metadata including available categories and tags with counts
 */
export type EpisodeQueryResult = Omit<BaseEpisodeQueryResult, 'episodes' | 'metadata'> & {
  episodes: Episode[];
  metadata: EpisodeFiltersMetadata;
};
