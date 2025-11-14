import { getSupabaseClient, type GenericSupabaseClient } from '../lib/supabaseClient';
import type {
  Episode,
  EpisodeFiltersMetadata,
  EpisodeQuery,
  EpisodeQueryResult,
  EpisodeSort,
  EpisodeChapter,
  EpisodeResource
} from './types';

/**
 * Internal database row type for episodes table.
 * Supports both snake_case and camelCase property names for flexibility.
 *
 * @property id - Unique identifier for the episode
 * @property title - Episode title
 * @property category - Category classification of the episode
 * @property tags - Raw tags data (can be any type from database)
 * @property description - Optional episode description
 * @property duration_sec - Optional duration in seconds (snake_case)
 * @property durationSec - Optional duration in seconds (camelCase)
 * @property audio_url - Optional URL to audio file (snake_case)
 * @property audioUrl - Optional URL to audio file (camelCase)
 * @property cover_url - Optional URL to cover image (snake_case)
 * @property coverUrl - Optional URL to cover image (camelCase)
 * @property published_at - Optional publication timestamp (snake_case)
 * @property publishedAt - Optional publication timestamp (camelCase)
 * @property chapters - Raw chapters data (can be any type from database)
 * @property resources - Raw resources data (can be any type from database)
 * @property slug - Optional URL-friendly identifier
 *
 * @internal
 */
type EpisodeRow = {
  id: string;
  title: string;
  category: string;
  tags?: unknown;
  description?: string | null;
  duration_sec?: number | null;
  durationSec?: number | null;
  audio_url?: string | null;
  audioUrl?: string | null;
  cover_url?: string | null;
  coverUrl?: string | null;
  published_at?: string | null;
  publishedAt?: string | null;
  chapters?: unknown;
  resources?: unknown;
  slug?: string | null;
};

/**
 * Internal database row type for episode chapters.
 * Supports both snake_case and camelCase property names for flexibility.
 *
 * @property title - Chapter title (can be any type from database)
 * @property start_sec - Starting time in seconds (snake_case, can be any type)
 * @property startSec - Starting time in seconds (camelCase, can be any type)
 *
 * @internal
 */
type EpisodeChapterRow = {
  title?: unknown;
  start_sec?: unknown;
  startSec?: unknown;
};

/**
 * Internal database row type for episode metadata queries.
 * Used when fetching only category and tags data for filter metadata.
 *
 * @property category - Optional category classification
 * @property tags - Raw tags data (can be any type from database)
 *
 * @internal
 */
type EpisodeMetadataRow = {
  category?: string | null;
  tags?: unknown;
};

/**
 * Default page number for pagination when not specified in query.
 */
const DEFAULT_PAGE = 1;

/**
 * Default page size for pagination when not specified in query.
 */
const DEFAULT_PAGE_SIZE = 10;

/**
 * Cache for local episodes dataset to avoid re-parsing the JSON file.
 * Null when not yet loaded, Episode array after first load.
 *
 * @internal
 */
let cachedLocalEpisodes: Episode[] | null = null;

/**
 * Maps raw chapter data from database to typed EpisodeChapter array.
 * Validates that each chapter has a valid title string and numeric start time.
 * Filters out invalid chapters and returns undefined if no valid chapters exist.
 *
 * @param candidate - Raw chapter data from database (expected to be array)
 * @returns Array of valid EpisodeChapter objects, or undefined if none are valid
 *
 * @internal
 */
function mapChapters(candidate: unknown): EpisodeChapter[] | undefined {
  if (!Array.isArray(candidate)) {
    return undefined;
  }

  const mapped: EpisodeChapter[] = [];

  for (const item of candidate) {
    const chapter = item as EpisodeChapterRow;
    const title = typeof chapter.title === 'string' ? chapter.title.trim() : undefined;
    const start =
      typeof chapter.startSec === 'number'
        ? chapter.startSec
        : typeof chapter.start_sec === 'number'
        ? chapter.start_sec
        : typeof chapter.start_sec === 'string'
        ? Number.parseFloat(chapter.start_sec)
        : undefined;

    if (title && Number.isFinite(start)) {
      mapped.push({ title, startSec: Number(start) });
    }
  }

  return mapped.length > 0 ? mapped : undefined;
}

/**
 * Maps raw resource data from database to typed EpisodeResource array.
 * Validates that each resource has both a valid label and URL string.
 * Filters out invalid resources and returns undefined if no valid resources exist.
 *
 * @param candidate - Raw resource data from database (expected to be array)
 * @returns Array of valid EpisodeResource objects, or undefined if none are valid
 *
 * @internal
 */
function mapResources(candidate: unknown): EpisodeResource[] | undefined {
  if (!Array.isArray(candidate)) {
    return undefined;
  }

  const mapped: EpisodeResource[] = [];

  for (const item of candidate) {
    if (!item || typeof item !== 'object') {
      continue;
    }

    const record = item as { label?: unknown; url?: unknown };
    if (typeof record.label === 'string' && typeof record.url === 'string') {
      mapped.push({ label: record.label, url: record.url });
    }
  }

  return mapped.length > 0 ? mapped : undefined;
}

/**
 * Maps a database episode row to a typed Episode object.
 * Handles both snake_case and camelCase property names.
 * Provides fallback values for all required fields and validates data types.
 *
 * @param row - Database row to map
 * @returns Mapped Episode object with all required fields populated
 *
 * @internal
 */
function mapEpisodeRow(row: EpisodeRow): Episode {
  const tagsArray = Array.isArray(row.tags)
    ? (row.tags as unknown[]).filter((tag): tag is string => typeof tag === 'string')
    : [];

  const duration =
    typeof row.durationSec === 'number'
      ? row.durationSec
      : typeof row.duration_sec === 'number'
      ? row.duration_sec
      : 0;

  const audioUrl = typeof row.audioUrl === 'string' ? row.audioUrl : row.audio_url ?? '';

  const publishedAt =
    typeof row.publishedAt === 'string'
      ? row.publishedAt
      : typeof row.published_at === 'string'
      ? row.published_at
      : new Date(0).toISOString();

  const coverUrl =
    typeof row.coverUrl === 'string'
      ? row.coverUrl
      : typeof row.cover_url === 'string'
      ? row.cover_url
      : undefined;

  return {
    id: row.id,
    title: row.title,
    category: row.category,
    tags: tagsArray,
    description: row.description ?? '',
    durationSec: duration,
    audioUrl,
    coverUrl,
    publishedAt,
    chapters: mapChapters(row.chapters),
    resources: mapResources(row.resources),
    slug: typeof row.slug === 'string' ? row.slug : undefined
  };
}

/**
 * Loads the local episodes dataset from JSON file.
 * Uses caching to avoid re-parsing the file on subsequent calls.
 * The dataset is stored in the analysis-archive feature directory.
 *
 * @returns Promise resolving to array of Episode objects
 *
 * @internal
 */
async function loadLocalEpisodesDataset(): Promise<Episode[]> {
  if (cachedLocalEpisodes) {
    return cachedLocalEpisodes;
  }

  const module = await import('../features/analysis-archive/data.local.json');
  cachedLocalEpisodes = (module.default as EpisodeRow[]).map(mapEpisodeRow);
  return cachedLocalEpisodes;
}

/**
 * Normalizes a string for case-insensitive and accent-insensitive comparison.
 * Uses Unicode NFKD normalization and converts to lowercase.
 *
 * @param value - String to normalize
 * @returns Normalized string in lowercase
 *
 * @internal
 */
function normalize(value: string): string {
  return value.normalize('NFKD').toLowerCase();
}

/**
 * Checks if an episode matches a search query.
 * Searches in both title and description fields.
 * Uses normalized (case and accent insensitive) string comparison.
 *
 * @param episode - Episode to check
 * @param query - Optional search query string
 * @returns True if episode matches query or query is empty/undefined
 *
 * @internal
 */
function matchesQuery(episode: Episode, query?: string): boolean {
  if (!query) {
    return true;
  }

  const normalizedQuery = normalize(query);
  return (
    normalize(episode.title).includes(normalizedQuery) || normalize(episode.description).includes(normalizedQuery)
  );
}

/**
 * Checks if an episode matches category filters.
 * Episode must be in one of the specified categories.
 *
 * @param episode - Episode to check
 * @param categories - Optional array of category filters
 * @returns True if episode category is in filter array or filter is empty/undefined
 *
 * @internal
 */
function matchesCategories(episode: Episode, categories?: string[]): boolean {
  if (!categories || categories.length === 0) {
    return true;
  }

  return categories.includes(episode.category);
}

/**
 * Checks if an episode matches tag filters.
 * Episode must have ALL specified tags (AND operation).
 *
 * @param episode - Episode to check
 * @param tags - Optional array of tag filters
 * @returns True if episode has all specified tags or filter is empty/undefined
 *
 * @internal
 */
function matchesTags(episode: Episode, tags?: string[]): boolean {
  if (!tags || tags.length === 0) {
    return true;
  }

  return tags.every((tag) => episode.tags.includes(tag));
}

/**
 * Sorts an array of episodes according to specified sort order.
 * Creates a new sorted array without modifying the original.
 *
 * @param data - Array of episodes to sort
 * @param sort - Sort order (defaults to 'newest')
 * @returns New sorted array of episodes
 *
 * @internal
 */
function sortEpisodes(data: Episode[], sort: EpisodeSort = 'newest'): Episode[] {
  const sorted = [...data];

  switch (sort) {
    case 'oldest':
      sorted.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
      break;
    case 'durationAsc':
      sorted.sort((a, b) => a.durationSec - b.durationSec);
      break;
    case 'durationDesc':
      sorted.sort((a, b) => b.durationSec - a.durationSec);
      break;
    case 'newest':
    default:
      sorted.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      break;
  }

  return sorted;
}

/**
 * Paginates an array of data.
 * Extracts a slice of the array based on page number and page size.
 *
 * @param data - Array to paginate
 * @param page - Page number (1-indexed)
 * @param pageSize - Number of items per page
 * @returns Slice of the array for the specified page
 *
 * @internal
 */
function paginate<T>(data: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return data.slice(start, end);
}

/**
 * Computes filter metadata from an array of episodes.
 * Counts occurrences of each category and tag across all episodes.
 * Tags are sorted alphabetically in the result.
 *
 * @param source - Array of episodes to analyze
 * @returns Metadata object with category and tag counts
 *
 * @internal
 */
function computeMetadata(source: Episode[]): EpisodeFiltersMetadata {
  const categoryMap = new Map<string, number>();
  const tagMap = new Map<string, number>();

  for (const episode of source) {
    categoryMap.set(episode.category, (categoryMap.get(episode.category) ?? 0) + 1);

    for (const tag of episode.tags) {
      tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
    }
  }

  return {
    categories: Array.from(categoryMap.entries()).map(([value, count]) => ({ value, count })),
    tags: Array.from(tagMap.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => a.value.localeCompare(b.value))
  };
}

/**
 * Enriches a query object with default values for pagination and sorting.
 * Validates that page and pageSize are positive numbers.
 *
 * @param query - Episode query with optional parameters
 * @returns Query object with page, pageSize, and sort guaranteed to be present
 *
 * @internal
 */
function withDefaults(query: EpisodeQuery = {}): Required<Pick<EpisodeQuery, 'page' | 'pageSize' | 'sort'>> & EpisodeQuery {
  return {
    page: query.page && query.page > 0 ? query.page : DEFAULT_PAGE,
    pageSize: query.pageSize && query.pageSize > 0 ? query.pageSize : DEFAULT_PAGE_SIZE,
    sort: query.sort ?? 'newest',
    ...query
  };
}

/**
 * Queries episodes from local JSON dataset.
 * Used when Supabase client is not available (e.g., in development or offline mode).
 * Performs client-side filtering, sorting, and pagination.
 *
 * @param query - Episode query parameters for filtering, sorting, and pagination
 * @returns Promise resolving to episode query result with paginated episodes and metadata
 *
 * @example
 * ```typescript
 * const result = await getLocalEpisodes({
 *   q: 'introduction',
 *   categories: ['podcast'],
 *   page: 1,
 *   pageSize: 10,
 *   sort: 'newest'
 * });
 * console.log(`Found ${result.total} episodes, showing page ${result.page}`);
 * ```
 */
export async function getLocalEpisodes(query: EpisodeQuery = {}): Promise<EpisodeQueryResult> {
  const { q, categories, tags, sort, page, pageSize } = withDefaults(query);
  const dataset = await loadLocalEpisodesDataset();
  const metadata = computeMetadata(dataset);

  const filtered = dataset.filter(
    (episode) => matchesQuery(episode, q) && matchesCategories(episode, categories) && matchesTags(episode, tags)
  );

  const sorted = sortEpisodes(filtered, sort);
  const paged = paginate(sorted, page, pageSize);

  return {
    episodes: paged,
    total: filtered.length,
    page,
    pageSize,
    metadata
  };
}

/**
 * Escapes special characters in SQL LIKE pattern values.
 * Escapes backslash, percent, and underscore characters.
 *
 * @param value - String to escape
 * @returns Escaped string safe for use in SQL LIKE patterns
 *
 * @internal
 */
function escapeLikeValue(value: string): string {
  return value.replace(/[\\%_]/g, (match) => `\\${match}`);
}

/**
 * Fetches filter metadata from Supabase database.
 * Retrieves all category and tag values to compute available filters and their counts.
 *
 * @param client - Supabase client instance
 * @returns Promise resolving to filter metadata with category and tag counts
 * @throws Error if database query fails
 *
 * @internal
 */
async function getSupabaseMetadata(client: GenericSupabaseClient): Promise<EpisodeFiltersMetadata> {
  const { data, error } = await client.from('episodes').select('category,tags');

  if (error) {
    throw error;
  }

  const rows = Array.isArray(data) ? (data as EpisodeMetadataRow[]) : [];
  const metadataEpisodes: Episode[] = rows.map((row, index) =>
    mapEpisodeRow({
      id: `metadata-${index}`,
      title: '',
      category: row.category ?? '',
      tags: row.tags,
      description: '',
      duration_sec: 0,
      audio_url: '',
      published_at: new Date(0).toISOString()
    })
  );

  return computeMetadata(metadataEpisodes);
}

/**
 * Queries episodes from Supabase database.
 * Performs server-side filtering, sorting, and pagination for optimal performance.
 * Fetches metadata in parallel with the episode query.
 *
 * @param client - Supabase client instance
 * @param query - Episode query parameters for filtering, sorting, and pagination
 * @returns Promise resolving to episode query result with paginated episodes and metadata
 * @throws Error if database query fails
 *
 * @internal
 */
async function getSupabaseEpisodes(
  client: GenericSupabaseClient,
  query: EpisodeQuery = {}
): Promise<EpisodeQueryResult> {
  const { q, categories, tags, sort, page, pageSize } = withDefaults(query);

  let builder = client.from('episodes').select('*', { count: 'exact' });

  if (q && q.trim().length > 0) {
    const escaped = escapeLikeValue(q.trim());
    builder = builder.or(`title.ilike.%${escaped}%,description.ilike.%${escaped}%`);
  }

  if (categories && categories.length > 0) {
    builder = builder.in('category', categories);
  }

  if (tags && tags.length > 0) {
    builder = builder.contains('tags', tags);
  }

  switch (sort) {
    case 'oldest':
      builder = builder.order('published_at', { ascending: true });
      break;
    case 'durationAsc':
      builder = builder.order('duration_sec', { ascending: true });
      break;
    case 'durationDesc':
      builder = builder.order('duration_sec', { ascending: false });
      break;
    case 'newest':
    default:
      builder = builder.order('published_at', { ascending: false });
      break;
  }

  const rangeStart = (page - 1) * pageSize;
  const rangeEnd = rangeStart + pageSize - 1;
  const queryPromise = builder.range(rangeStart, rangeEnd);

  const [result, metadata] = await Promise.all([queryPromise, getSupabaseMetadata(client)]);

  if (result.error) {
    throw result.error;
  }

  const data = Array.isArray(result.data) ? (result.data as EpisodeRow[]) : [];

  return {
    episodes: data.map(mapEpisodeRow),
    total: result.count ?? 0,
    page,
    pageSize,
    metadata
  };
}

/**
 * Queries episodes with filtering, sorting, and pagination.
 * Automatically uses Supabase database if available, otherwise falls back to local dataset.
 * Returns paginated results with metadata about available filters.
 *
 * @param query - Episode query parameters for filtering, sorting, and pagination
 * @returns Promise resolving to episode query result with paginated episodes and metadata
 * @throws Error if database query fails (when Supabase is available)
 *
 * @example
 * ```typescript
 * // Basic usage with defaults
 * const result = await getEpisodes();
 *
 * // Search with filters
 * const filtered = await getEpisodes({
 *   q: 'meditation',
 *   categories: ['mindfulness'],
 *   tags: ['beginner'],
 *   sort: 'newest',
 *   page: 1,
 *   pageSize: 20
 * });
 *
 * console.log(`Found ${filtered.total} episodes`);
 * console.log(`Available categories:`, filtered.metadata.categories);
 * ```
 */
export async function getEpisodes(query: EpisodeQuery = {}): Promise<EpisodeQueryResult> {
  const client = getSupabaseClient();

  if (!client) {
    return getLocalEpisodes(query);
  }

  return getSupabaseEpisodes(client, query);
}
