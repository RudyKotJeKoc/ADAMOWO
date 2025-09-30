import { getEpisodes as fetchEpisodes, getLocalEpisodes } from '../../data/episodes';
import type {
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

function adaptMetadata(metadata: BaseEpisodeFiltersMetadata): EpisodeFiltersMetadata {
  const categories = metadata.categories
    .filter((category) => isEpisodeCategory(category.value))
    .map((category) => ({ value: category.value as EpisodeCategory, count: category.count }));

  return {
    categories,
    tags: metadata.tags
  };
}

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
