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

type EpisodeChapterRow = {
  title?: unknown;
  start_sec?: unknown;
  startSec?: unknown;
};

type EpisodeMetadataRow = {
  category?: string | null;
  tags?: unknown;
};

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

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

let cachedLocalEpisodes: Episode[] | null = null;

async function loadLocalEpisodesDataset(): Promise<Episode[]> {
  if (cachedLocalEpisodes) {
    return cachedLocalEpisodes;
  }

  const module = await import('../features/analysis-archive/data.local.json');
  cachedLocalEpisodes = (module.default as EpisodeRow[]).map(mapEpisodeRow);
  return cachedLocalEpisodes;
}

function normalize(value: string): string {
  return value.normalize('NFKD').toLowerCase();
}

function matchesQuery(episode: Episode, query?: string): boolean {
  if (!query) {
    return true;
  }

  const normalizedQuery = normalize(query);
  return (
    normalize(episode.title).includes(normalizedQuery) || normalize(episode.description).includes(normalizedQuery)
  );
}

function matchesCategories(episode: Episode, categories?: string[]): boolean {
  if (!categories || categories.length === 0) {
    return true;
  }

  return categories.includes(episode.category);
}

function matchesTags(episode: Episode, tags?: string[]): boolean {
  if (!tags || tags.length === 0) {
    return true;
  }

  return tags.every((tag) => episode.tags.includes(tag));
}

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

function paginate<T>(data: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return data.slice(start, end);
}

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

function withDefaults(query: EpisodeQuery = {}): Required<Pick<EpisodeQuery, 'page' | 'pageSize' | 'sort'>> & EpisodeQuery {
  return {
    page: query.page && query.page > 0 ? query.page : DEFAULT_PAGE,
    pageSize: query.pageSize && query.pageSize > 0 ? query.pageSize : DEFAULT_PAGE_SIZE,
    sort: query.sort ?? 'newest',
    ...query
  };
}

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

function escapeLikeValue(value: string): string {
  return value.replace(/[\\%_]/g, (match) => `\\${match}`);
}

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

export async function getEpisodes(query: EpisodeQuery = {}): Promise<EpisodeQueryResult> {
  const client = getSupabaseClient();

  if (!client) {
    return getLocalEpisodes(query);
  }

  return getSupabaseEpisodes(client, query);
}
