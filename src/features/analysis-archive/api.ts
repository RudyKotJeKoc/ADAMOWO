import { getEpisodes as fetchEpisodes, getLocalEpisodes as fetchLocalEpisodes } from '../../data/episodes';
import type {
  Episode as BaseEpisode,
  EpisodeFiltersMetadata as BaseEpisodeFiltersMetadata,
  EpisodeQuery as BaseEpisodeQuery,
  EpisodeQueryResult as BaseEpisodeQueryResult
} from '../../data/types';
import type { Episode, EpisodeCategory, EpisodeFiltersMetadata, EpisodeQuery, EpisodeQueryResult } from './data.schema';

/**
 * Valid category values for analysis archive episodes.
 * Represents all supported episode categories in the analysis archive feature.
 *
 * @internal
 */
const CATEGORY_VALUES: EpisodeCategory[] = [
  'AktDarowania',
  'SłużebnośćUwiązania',
  'BronNarcyza',
  'Sledztwo'
];

/**
 * Type guard that checks if a string value is a valid EpisodeCategory.
 * Used to safely narrow string types to the EpisodeCategory union type.
 *
 * @param value - String value to check
 * @returns True if value is a valid EpisodeCategory, false otherwise
 *
 * @internal
 */
function isEpisodeCategory(value: string): value is EpisodeCategory {
  return CATEGORY_VALUES.includes(value as EpisodeCategory);
}

/**
 * Adapts a base episode from the data layer to an analysis archive episode.
 * Validates the category and provides fallback values for required fields.
 * Logs a warning if an unknown category is encountered.
 *
 * @param episode - Base episode object from the data layer
 * @returns Adapted episode with validated category and guaranteed required fields
 *
 * @internal
 */
function adaptEpisode(episode: BaseEpisode): Episode {
  const safeCategory: EpisodeCategory = isEpisodeCategory(episode.category)
    ? episode.category
    : 'Sledztwo';

  if (!isEpisodeCategory(episode.category)) {
    console.warn('[analysis-archive] Unknown episode category received:', episode.category, '- using fallback:', safeCategory);
  }

  return {
    ...episode,
    slug: episode.slug ?? episode.id,
    category: safeCategory,
    tags: episode.tags ?? [],
    description: episode.description,
    durationSec: episode.durationSec,
    audioUrl: episode.audioUrl,
    coverUrl: episode.coverUrl,
    publishedAt: episode.publishedAt
  };
}

/**
 * Adapts base episode filter metadata to analysis archive filter metadata.
 * Filters out invalid categories that don't match the EpisodeCategory type.
 *
 * @param metadata - Base filter metadata from the data layer
 * @returns Adapted filter metadata with only valid episode categories
 *
 * @internal
 */
function adaptMetadata(metadata: BaseEpisodeFiltersMetadata): EpisodeFiltersMetadata {
  return {
    categories: metadata.categories
      .filter((category): category is { value: EpisodeCategory; count: number } => isEpisodeCategory(category.value))
      .map((category) => ({ value: category.value as EpisodeCategory, count: category.count })),
    tags: metadata.tags
  };
}

/**
 * Adapts a base query result to an analysis archive query result.
 * Maps all episodes and metadata to their analysis archive equivalents.
 *
 * @param result - Base query result from the data layer
 * @returns Adapted query result with validated episodes and metadata
 *
 * @internal
 */
function adaptQueryResult(result: BaseEpisodeQueryResult): EpisodeQueryResult {
  const episodes = result.episodes.map(adaptEpisode);

  return {
    episodes,
    total: result.total,
    page: result.page,
    pageSize: result.pageSize,
    metadata: adaptMetadata(result.metadata)
  };
}

/**
 * Converts an analysis archive query to a base episode query.
 * Removes the programId field which is not used in the base query.
 *
 * @param query - Analysis archive episode query
 * @returns Base episode query compatible with the data layer
 *
 * @internal
 */
function toBaseQuery(query: EpisodeQuery): BaseEpisodeQuery {
  const { categories, programId: _programId, ...rest } = query;
  void _programId;

  return {
    ...rest,
    categories: categories?.map((category) => category)
  };
}

/**
 * Queries episodes from the analysis archive with filtering, sorting, and pagination.
 * Automatically falls back to local dataset if the remote fetch fails.
 * Returns paginated results with metadata about available filters.
 *
 * @param query - Episode query parameters for filtering, sorting, and pagination
 * @returns Promise resolving to episode query result with paginated episodes and metadata
 *
 * @example
 * ```typescript
 * // Basic usage with defaults
 * const result = await getEpisodes();
 *
 * // Search with filters
 * const filtered = await getEpisodes({
 *   q: 'narcyz',
 *   categories: ['BronNarcyza'],
 *   tags: ['psychologia'],
 *   sort: 'newest',
 *   page: 1,
 *   pageSize: 20
 * });
 *
 * console.log(`Found ${filtered.total} episodes`);
 * console.log(`Showing ${filtered.episodes.length} episodes on page ${filtered.page}`);
 * ```
 */
export async function getEpisodes(query: EpisodeQuery = {}): Promise<EpisodeQueryResult> {
  const baseQuery = toBaseQuery(query);

  try {
    const result = await fetchEpisodes(baseQuery);
    return adaptQueryResult(result);
  } catch (error) {
    console.warn('[analysis-archive] Falling back to local dataset due to fetch failure.', error);
    const fallback = await fetchLocalEpisodes(baseQuery);
    return adaptQueryResult(fallback);
  }
}
