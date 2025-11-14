/**
 * Documentary Feature Type Definitions
 *
 * Type system for documentary metadata, resources, and chapter navigation.
 * Supports multiple resource types and internationalized content.
 */

/**
 * Types of documentary resources available.
 *
 * - pdf: Downloadable PDF documents
 * - article: Web-based articles or essays
 * - audio: Audio recordings or podcasts
 * - guide: Step-by-step guides or instructions
 * - video: Video content or clips
 */
export type DocResourceType = 'pdf' | 'article' | 'audio' | 'guide' | 'video';

/**
 * A supplementary resource related to the documentary.
 *
 * @property id - Unique identifier for the resource
 * @property type - Type of resource content
 * @property url - URL to access the resource
 * @property titleKey - i18n key for the resource title
 * @property descriptionKey - i18n key for the resource description
 */
export interface DocResource {
  id: string;
  type: DocResourceType;
  url: string;
  titleKey: string;
  descriptionKey: string;
}

/**
 * A chapter or section marker in the documentary timeline.
 *
 * @property id - Unique identifier for the chapter
 * @property time - Start time of the chapter in seconds
 * @property titleKey - i18n key for the chapter title
 * @property summaryKey - i18n key for the chapter summary (optional)
 */
export interface DocChapter {
  id: string;
  time: number;
  titleKey: string;
  summaryKey?: string;
}

/**
 * Complete metadata for the documentary feature.
 *
 * @property titleKey - i18n key for the documentary title
 * @property descriptionKey - i18n key for the documentary description
 * @property resources - Array of supplementary resources
 * @property chapters - Array of chapter markers for navigation
 * @property poster - URL to poster/thumbnail image (optional)
 */
export interface DocMeta {
  titleKey: string;
  descriptionKey: string;
  resources: DocResource[];
  chapters: DocChapter[];
  poster?: string;
}
