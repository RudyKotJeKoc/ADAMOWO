export type Chapter = {
  title: string;
  startSec: number;
};

export type EpisodeCategory =
  | 'AktDarowania'
  | 'SlużebnośćUwiązania'
  | 'SprawaAdamskich'
  | 'BronNarcyza'
  | 'Sledztwo';

export type Episode = {
  id: string;
  title: string;
  slug: string;
  category: EpisodeCategory;
  tags: string[];
  description: string;
  durationSec: number;
  audioUrl: string;
  coverUrl?: string;
  publishedAt: string;
  chapters?: Chapter[];
  resources?: { label: string; url: string }[];
};

export type EpisodeSort = 'newest' | 'oldest' | 'durationAsc' | 'durationDesc';

export type EpisodeQuery = {
  q?: string;
  categories?: EpisodeCategory[];
  tags?: string[];
  sort?: EpisodeSort;
  page?: number;
  pageSize?: number;
};

export type EpisodeFiltersMetadata = {
  categories: { value: EpisodeCategory; count: number }[];
  tags: { value: string; count: number }[];
};

export type EpisodeQueryResult = {
  episodes: Episode[];
  total: number;
  page: number;
  pageSize: number;
  metadata: EpisodeFiltersMetadata;
};
