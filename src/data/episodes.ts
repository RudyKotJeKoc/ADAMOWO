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
 * Raw database row structure from Supabase episodes table.
 * Supports both snake_case and camelCase field names for compatibility.
 * @typedef {Object} EpisodeRow
 * @private
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
 * Raw database row structure for episode chapters within the episodes table.
 * Supports both snake_case and camelCase field names for compatibility.
 * @typedef {Object} EpisodeChapterRow
 * @private
 */
type EpisodeChapterRow = {
  title?: unknown;
  start_sec?: unknown;
  startSec?: unknown;
};

/**
 * Minimal database row structure for fetching episode metadata (categories and tags).
 * Used specifically for building filter metadata without loading full episode data.
 * @typedef {Object} EpisodeMetadataRow
 * @private
 */
type EpisodeMetadataRow = {
  category?: string | null;
  tags?: unknown;
};

/**
 * Default page number for pagination when not specified.
 * @constant {number}
 * @private
 */
const DEFAULT_PAGE = 1;

/**
 * Default number of episodes per page when not specified.
 * @constant {number}
 * @private
 */
const DEFAULT_PAGE_SIZE = 10;

/**
 * Maps an unknown database value to an array of EpisodeChapter objects.
 * Validates and parses chapter data, ensuring all required fields are present and valid.
 * Filters out invalid chapters that lack title or valid startSec.
 * @param {unknown} candidate - Raw chapter data from database (expected to be array)
 * @returns {EpisodeChapter[] | undefined} Validated chapters array, or undefined if invalid/empty
 * @private
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
 * Maps an unknown database value to an array of EpisodeResource objects.
 * Validates and parses resource data, ensuring all required fields (label, url) are strings.
 * Filters out invalid resources that lack required fields.
 * @param {unknown} candidate - Raw resource data from database (expected to be array)
 * @returns {EpisodeResource[] | undefined} Validated resources array, or undefined if invalid/empty
 * @private
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
 * Maps a database row to the Episode type with proper type validation and defaults.
 * Handles null values and field name variations (snake_case vs camelCase).
 * Ensures all required Episode fields have valid values with appropriate fallbacks.
 * @param {EpisodeRow} row - Raw database row
 * @returns {Episode} Fully validated and mapped episode object
 * @private
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
 * Cache for local episodes dataset to avoid re-parsing JSON on subsequent calls.
 * Initialized to null and populated on first access.
 * @type {Episode[] | null}
 * @private
 */
let cachedLocalEpisodes: Episode[] | null = null;

/**
 * Loads and parses the local episodes dataset from JSON file.
 * Uses caching to avoid re-parsing on subsequent calls.
 * Used as fallback when Supabase is not available.
 * @returns {Promise<Episode[]>} Array of all local episodes
 * @private
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
 * Normalizes a string for case-insensitive comparison.
 * Applies Unicode NFKD normalization and converts to lowercase.
 * @param {string} value - String to normalize
 * @returns {string} Normalized string in lowercase
 * @private
 */
function normalize(value: string): string {
  return value.normalize('NFKD').toLowerCase();
}

/**
 * Checks if an episode matches a search query string.
 * Performs case-insensitive search across title and description fields.
 * Returns true if query is empty/undefined or if found in either field.
 * @param {Episode} episode - Episode to test
 * @param {string} [query] - Search query string
 * @returns {boolean} True if episode matches query or query is empty
 * @private
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
 * Checks if an episode's category is in the provided categories filter.
 * Returns true if categories filter is empty/undefined or if episode's category is included.
 * @param {Episode} episode - Episode to test
 * @param {string[]} [categories] - Array of allowed category values
 * @returns {boolean} True if episode matches category filter or filter is empty
 * @private
 */
function matchesCategories(episode: Episode, categories?: string[]): boolean {
  if (!categories || categories.length === 0) {
    return true;
  }

  return categories.includes(episode.category);
}

/**
 * Checks if an episode has all of the provided tags (AND logic).
 * Returns true if tags filter is empty/undefined or if episode has all specified tags.
 * @param {Episode} episode - Episode to test
 * @param {string[]} [tags] - Array of required tags
 * @returns {boolean} True if episode has all tags or filter is empty
 * @private
 */
function matchesTags(episode: Episode, tags?: string[]): boolean {
  if (!tags || tags.length === 0) {
    return true;
  }

  return tags.every((tag) => episode.tags.includes(tag));
}

/**
 * Sorts an array of episodes according to the specified sort criteria.
 * Creates a shallow copy before sorting to avoid mutating the original array.
 * Supports sorting by publication date (newest/oldest) and duration (ascending/descending).
 * @param {Episode[]} data - Episodes to sort
 * @param {EpisodeSort} [sort='newest'] - Sort order: 'newest', 'oldest', 'durationAsc', or 'durationDesc'
 * @returns {Episode[]} New sorted array of episodes
 * @private
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
 * Extracts a page of items from an array using zero-based pagination logic.
 * Returns a slice of the array for the requested page and page size.
 * @template T
 * @param {T[]} data - Array to paginate
 * @param {number} page - Page number (1-based)
 * @param {number} pageSize - Number of items per page
 * @returns {T[]} Slice of items for the requested page
 * @private
 */
function paginate<T>(data: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return data.slice(start, end);
}

/**
 * Computes filter metadata (categories and tags with counts) from an array of episodes.
 * Aggregates unique categories and tags with their occurrence counts.
 * Tags are sorted alphabetically in the result.
 * @param {Episode[]} source - Episodes to analyze
 * @returns {EpisodeFiltersMetadata} Metadata object with categories and tags arrays
 * @private
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
 * Applies default values to an episode query for page, pageSize, and sort fields.
 * Validates that page and pageSize are positive numbers before using them.
 * @param {EpisodeQuery} [query={}] - User-provided query parameters
 * @returns {Required<Pick<EpisodeQuery, 'page' | 'pageSize' | 'sort'>> & EpisodeQuery} Query with defaults applied
 * @private
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
 * Fetches and filters episodes from the local JSON dataset.
 * Applies filtering, sorting, and pagination to the local episodes data.
 * Used as fallback when Supabase is not available.
 * @param {EpisodeQuery} [query={}] - Query parameters for filtering, sorting, and pagination
 * @returns {Promise<EpisodeQueryResult>} Query result with episodes, metadata, and pagination info
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
 * Escapes special characters in a string for use in SQL LIKE/ILIKE queries.
 * Escapes backslash, percent, and underscore characters.
 * @param {string} value - String to escape
 * @returns {string} Escaped string safe for LIKE/ILIKE queries
 * @private
 */
function escapeLikeValue(value: string): string {
  return value.replace(/[\\%_]/g, (match) => `\\${match}`);
}

/**
 * Fetches filter metadata (categories and tags) from Supabase episodes table.
 * Queries only category and tags fields to minimize data transfer.
 * Computes aggregated counts for all unique categories and tags.
 * @param {GenericSupabaseClient} client - Supabase client instance
 * @returns {Promise<EpisodeFiltersMetadata>} Metadata object with categories and tags arrays
 * @throws {Error} If Supabase query fails
 * @private
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
 * Fetches and filters episodes from Supabase with server-side filtering and pagination.
 * Builds optimized Supabase queries with filters for search, categories, tags, and sorting.
 * Performs pagination at the database level for efficient data transfer.
 * Fetches metadata in parallel with episode query for optimal performance.
 * @param {GenericSupabaseClient} client - Supabase client instance
 * @param {EpisodeQuery} [query={}] - Query parameters for filtering, sorting, and pagination
 * @returns {Promise<EpisodeQueryResult>} Query result with episodes, metadata, and pagination info
 * @throws {Error} If Supabase query fails
 * @private
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
 * Fetches episodes from Supabase or falls back to local dataset.
 * Automatically detects Supabase availability and uses appropriate data source.
 * Applies filtering, sorting, and pagination based on query parameters.
 * @param {EpisodeQuery} [query={}] - Query parameters for filtering, sorting, and pagination
 * @returns {Promise<EpisodeQueryResult>} Query result with episodes, metadata, and pagination info
 * @throws {Error} If Supabase query fails (when Supabase is available)
 */
export async function getEpisodes(query: EpisodeQuery = {}): Promise<EpisodeQueryResult> {
  const client = getSupabaseClient();

  if (!client) {
    return getLocalEpisodes(query);
  }

  return getSupabaseEpisodes(client, query);
}
