
import type { ProgramId } from '../studio/studio.schema';

import type {
  Episode as BaseEpisode,
  EpisodeFiltersMetadata as BaseEpisodeFiltersMetadata,
  EpisodeQuery as BaseEpisodeQuery,
  EpisodeQueryResult as BaseEpisodeQueryResult,
  EpisodeResource,
  EpisodeSort as BaseEpisodeSort
} from '../../data/types';


export type Chapter = {
  title: string;
  startSec: number;
};

export type EpisodeCategory =
  | 'AktDarowania'
  | 'SłużebnośćUwiązania'
  | 'SprawaAdamskich'
  | 'BronNarcyza'
  | 'Sledztwo';

export type EpisodeSort = BaseEpisodeSort;

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

export type EpisodeQuery = Omit<BaseEpisodeQuery, 'categories'> & {
  categories?: EpisodeCategory[];

  tags?: string[];
  sort?: EpisodeSort;
  page?: number;
  pageSize?: number;
  programId?: ProgramId;
};

export type EpisodeFiltersMetadata = {
  categories: { value: EpisodeCategory; count: number }[];
  tags: BaseEpisodeFiltersMetadata['tags'];
};

export type EpisodeQueryResult = Omit<BaseEpisodeQueryResult, 'episodes' | 'metadata'> & {
  episodes: Episode[];
  metadata: EpisodeFiltersMetadata;
};
