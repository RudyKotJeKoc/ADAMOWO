export type DocResourceType = 'pdf' | 'article' | 'audio' | 'guide' | 'video';

export interface DocResource {
  id: string;
  type: DocResourceType;
  url: string;
  titleKey: string;
  descriptionKey: string;
}

export interface DocChapter {
  id: string;
  time: number;
  titleKey: string;
  summaryKey?: string;
}

export interface DocMeta {
  titleKey: string;
  descriptionKey: string;
  resources: DocResource[];
  chapters: DocChapter[];
  poster?: string;
}
