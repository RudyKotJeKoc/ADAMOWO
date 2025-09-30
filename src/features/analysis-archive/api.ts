import { getEpisodes as fetchEpisodes, getLocalEpisodes } from '../../data/episodes';
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

  Episode as BaseEpisode,
  EpisodeFiltersMetadata as BaseEpisodeFiltersMetadata,
  EpisodeQuery as BaseEpisodeQuery,
  EpisodeQueryResult as BaseEpisodeQueryResult
} from '../../data/types';
import type { Episode, EpisodeCategory, EpisodeFiltersMetadata, EpisodeQuery, EpisodeQueryResult } from './data.schema';

const CATEGORY_VALUES: EpisodeCategory[] = [
  'AktDarowania',
  'SlużebnośćUwiązania',
  'SprawaAdamskich',
  'BronNarcyza',
  'Sledztwo'
];

function isEpisodeCategory(value: string): value is EpisodeCategory {
  return CATEGORY_VALUES.includes(value as EpisodeCategory);

}

function adaptEpisode(episode: BaseEpisode): Episode | null {
  if (!isEpisodeCategory(episode.category)) {
    console.warn('[analysis-archive] Unknown episode category received:', episode.category);
    return null;
  }

  return {
    ...episode,
    slug: episode.slug ?? episode.id,
    category: episode.category,
    chapters: episode.chapters?.map((chapter) => ({ title: chapter.title, startSec: chapter.startSec }))
  };
}

function adaptEpisodesResult(result: BaseEpisodeQueryResult): EpisodeQueryResult {
  const episodes = result.episodes
    .map(adaptEpisode)
    .filter((episode): episode is Episode => episode !== null);

  return {
    episodes,
    total: result.total,
    page: result.page,
    pageSize: result.pageSize,
    metadata: adaptMetadata(result.metadata)
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
function adaptMetadata(metadata: BaseEpisodeFiltersMetadata): EpisodeFiltersMetadata {
  const categories = metadata.categories
    .filter((category) => isEpisodeCategory(category.value))
    .map((category) => ({ value: category.value as EpisodeCategory, count: category.count }));


  return {
    categories,
    tags: metadata.tags
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

function toBaseQuery(query: EpisodeQuery): BaseEpisodeQuery {
  return { ...query } as BaseEpisodeQuery;

}

export async function getEpisodes(query: EpisodeQuery = {}): Promise<EpisodeQueryResult> {
  try {
    const result = await fetchEpisodes(toBaseQuery(query));
    return adaptEpisodesResult(result);
  } catch (error) {
    console.warn('[analysis-archive] Failed to load data from Supabase, falling back to local JSON.', error);
    const fallback = await getLocalEpisodes(toBaseQuery(query));
    return adaptEpisodesResult(fallback);
  }
}
