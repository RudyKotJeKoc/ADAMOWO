/**
 * Type definitions for Polana Kłamstw feature
 */

export interface Chapter {
  /** Unique identifier (e.g., 'prolog', '1', '2', ..., '13', 'epilog') */
  id: string;
  /** Chapter number (null for prolog/epilog) */
  number: number | null;
  /** Chapter title */
  title: string;
  /** Chapter subtitle (optional) */
  subtitle?: string;
  /** Main content in markdown format */
  content: string;
  /** Estimated reading time in minutes */
  estimatedReadingTime: number;
  /** Publication date (ISO 8601 format) */
  publishDate?: string;
  /** Author notes or commentary (optional) */
  notes?: string;
}

export interface BookMetadata {
  /** Book title */
  title: string;
  /** Author name */
  author: string;
  /** Book description/subtitle */
  description: string;
  /** Genre/category */
  genre: string;
  /** Cover image path (optional) */
  coverImage?: string;
  /** Total number of chapters (excluding prolog/epilog) */
  totalChapters: number;
  /** Publication year */
  year: number;
}

export interface BookData {
  /** Book metadata */
  metadata: BookMetadata;
  /** All chapters including prolog and epilog */
  chapters: Chapter[];
}

export interface ReadingProgress {
  /** Current chapter ID */
  currentChapterId: string;
  /** Percentage read (0-100) */
  percentageRead: number;
  /** Timestamp of last read */
  lastRead: string;
  /** Bookmarked chapters */
  bookmarks: string[];
}

export type ChapterNavigationDirection = 'previous' | 'next';
