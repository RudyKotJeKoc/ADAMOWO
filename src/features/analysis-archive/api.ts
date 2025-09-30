import localEpisodes from './data.local.json';
import type {
  Episode,
  EpisodeCategory,
  EpisodeFiltersMetadata,
  EpisodeQuery,
  EpisodeQueryResult,
  EpisodeSort
} from './data.schema';

const LOCAL_EPISODES: Episode[] = (localEpisodes as Episode[]).map((episode) => ({
  ...episode,
  tags: episode.tags ?? []
}));

type SupabaseQueryResult = {
  data: unknown;
  error: unknown;
  count: number | null;
};

type SupabaseQueryBuilder = {
  select: (...args: unknown[]) => SupabaseQueryBuilderPromise;
  in: (...args: unknown[]) => SupabaseQueryBuilder;
  contains: (...args: unknown[]) => SupabaseQueryBuilder;
  eq: (...args: unknown[]) => SupabaseQueryBuilder;
  order: (...args: unknown[]) => SupabaseQueryBuilder;
  range: (...args: unknown[]) => SupabaseQueryBuilder;
};

type SupabaseQueryBuilderPromise = SupabaseQueryBuilder & PromiseLike<SupabaseQueryResult>;

type SupabaseClient = {
  from: (table: string) => SupabaseQueryBuilder;
};

type CreateClientFn = (url: string, key: string, options?: Record<string, unknown>) => SupabaseClient;

function getSupabaseConfig(): { url: string; key: string } | null {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON;

  if (typeof url === 'string' && url.length > 0 && typeof key === 'string' && key.length > 0) {
    return { url, key };
  }

  return null;
}

let cachedClient: SupabaseClient | null = null;
let createClientFactory: CreateClientFn | null = null;
let supabaseAttempted = false;

async function getSupabaseClient(): Promise<SupabaseClient | null> {
  const config = getSupabaseConfig();

  if (!config) {
    cachedClient = null;
    return null;
  }

  if (cachedClient) {
    return cachedClient;
  }

  if (!createClientFactory && !supabaseAttempted) {
    supabaseAttempted = true;
    try {
      const module = await import('@supabase/supabase-js');
      createClientFactory = (module as { createClient: CreateClientFn }).createClient;
    } catch (error) {
      console.warn('[analysis-archive] Supabase client not available, using local data.', error);
      return null;
    }
  }

  if (!createClientFactory) {
    return null;
  }

  cachedClient = createClientFactory(config.url, config.key, {
    auth: { persistSession: false }
  });

  return cachedClient;
}

function normalize(value: string): string {
  return value.normalize('NFKD').toLowerCase();
}

function matchesQuery(episode: Episode, query: string): boolean {
  const normalizedQuery = normalize(query);
  const title = normalize(episode.title);
  const description = normalize(episode.description);

  return title.includes(normalizedQuery) || description.includes(normalizedQuery);
}

function filterByCategories(episode: Episode, categories?: EpisodeCategory[]): boolean {
  if (!categories || categories.length === 0) {
    return true;
  }

  return categories.includes(episode.category);
}

function filterByTags(episode: Episode, tags?: string[]): boolean {
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
  const categoryMap = new Map<EpisodeCategory, number>();
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

function getDefaultedQuery(query: EpisodeQuery = {}): Required<Pick<EpisodeQuery, 'page' | 'pageSize' | 'sort'>> & EpisodeQuery {
  return {
    page: query.page && query.page > 0 ? query.page : 1,
    pageSize: query.pageSize && query.pageSize > 0 ? query.pageSize : 10,
    sort: query.sort ?? 'newest',
    ...query
  };
}

function filterByProgram(episode: Episode, programId?: EpisodeQuery['programId']): boolean {
  if (!programId) {
    return true;
  }

  return episode.programId === programId;
}

function getLocalEpisodes(query: EpisodeQuery = {}): EpisodeQueryResult {
  const { q, categories, tags, sort, page, pageSize, programId } = getDefaultedQuery(query);

  const metadata = computeMetadata(LOCAL_EPISODES);

  const filtered = LOCAL_EPISODES.filter((episode) => {
    const matchesSearch = q ? matchesQuery(episode, q) : true;
    return (
      matchesSearch &&
      filterByCategories(episode, categories) &&
      filterByTags(episode, tags) &&
      filterByProgram(episode, programId)
    );
  });

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

async function getSupabaseMetadata(client: SupabaseClient): Promise<EpisodeFiltersMetadata> {
  const { data, error } = await client.from('episodes').select('category,tags');

  if (error) {
    throw error;
  }

  const mapped: Episode[] = (data ?? []).map((item) => ({
    id: '',
    title: '',
    slug: '',
    category: item.category as EpisodeCategory,
    tags: (item.tags as string[]) ?? [],
    description: '',
    durationSec: 0,
    audioUrl: '',
    publishedAt: new Date().toISOString()
  }));

  return computeMetadata(mapped);
}

async function getSupabaseEpisodes(client: SupabaseClient, query: EpisodeQuery = {}): Promise<EpisodeQueryResult> {
  const { q, categories, tags, sort, page, pageSize, programId } = getDefaultedQuery(query);

  let builder = client.from('episodes').select('*', { count: 'exact' });

  if (q) {
    const escaped = escapeLikeValue(q.trim());
    builder = builder.or(`title.ilike.%${escaped}%,description.ilike.%${escaped}%`);
  }

  if (categories && categories.length > 0) {
    builder = builder.in('category', categories);
  }

  if (tags && tags.length > 0) {
    builder = builder.contains('tags', tags);
  }

  if (programId) {
    builder = builder.eq('program_id', programId);
  }

  switch (sort) {
    case 'oldest':
      builder = builder.order('publishedAt', { ascending: true });
      break;
    case 'durationAsc':
      builder = builder.order('durationSec', { ascending: true });
      break;
    case 'durationDesc':
      builder = builder.order('durationSec', { ascending: false });
      break;
    case 'newest':
    default:
      builder = builder.order('publishedAt', { ascending: false });
      break;
  }

  const rangeStart = (page - 1) * pageSize;
  const rangeEnd = rangeStart + pageSize - 1;
  builder = builder.range(rangeStart, rangeEnd);

  const [{ data, error, count }, metadata] = await Promise.all([
    builder,
    getSupabaseMetadata(client)
  ]);

  if (error) {
    throw error;
  }

  return {
    episodes: (data as Episode[]) ?? [],
    total: count ?? 0,
    page,
    pageSize,
    metadata
  };
}

export async function getEpisodes(query: EpisodeQuery = {}): Promise<EpisodeQueryResult> {
  const client = await getSupabaseClient();

  if (!client) {
    return getLocalEpisodes(query);
  }

  try {
    return await getSupabaseEpisodes(client, query);
  } catch (error) {
    console.warn('[analysis-archive] Failed to load data from Supabase, falling back to local JSON.', error);
    return getLocalEpisodes(query);
  }
}
