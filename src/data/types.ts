export type PlaylistItem = {
  id: string;
  title: string;
  artist?: string;
  url: string;
  coverUrl?: string;
  position: number;
};

export type NowPlaying = {
  title: string;
  artist?: string;
  track?: string;
  coverUrl?: string;
  startedAt: string;
  duration?: number;
};

export type EpisodeChapter = {
  title: string;
  startSec: number;
};

export type EpisodeResource = {
  label: string;
  url: string;
};

export type Episode = {
  id: string;
  title: string;
  category: string;
  tags: string[];
  description: string;
  durationSec: number;
  audioUrl: string;
  coverUrl?: string;
  publishedAt: string;
  chapters?: EpisodeChapter[];
  resources?: EpisodeResource[];
  slug?: string;
};

export type EpisodeSort = 'newest' | 'oldest' | 'durationAsc' | 'durationDesc';

export type EpisodeQuery = {
  q?: string;
  categories?: string[];
  tags?: string[];
  sort?: EpisodeSort;
  page?: number;
  pageSize?: number;
};

export type EpisodeFiltersMetadata = {
  categories: { value: string; count: number }[];
  tags: { value: string; count: number }[];
};

export type EpisodeQueryResult = {
  episodes: Episode[];
  total: number;
  page: number;
  pageSize: number;
  metadata: EpisodeFiltersMetadata;
};
