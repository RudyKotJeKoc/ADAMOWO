/**
 * TypeScript types for Polana Kłamstw feature
 * A contemporary fairytale about truth, lies, and consequences
 */

export interface Chapter {
  /** Unique chapter identifier (e.g., 'prolog', 'ch1', 'epilog') */
  id: string;

  /** Chapter type (prolog, chapter, epilog) */
  type: 'prolog' | 'chapter' | 'epilog' | 'part';

  /** Chapter number (if applicable) */
  chapterNumber?: number;

  /** Chapter title in Polish */
  title: string;

  /** Full chapter content in markdown format */
  content: string;

  /** Estimated reading time in minutes */
  estimatedReadingTime: number;

  /** Word count for the chapter */
  wordCount: number;

  /** Whether chapter contains special interactive elements */
  hasSpecialElements?: boolean;

  /** Description of special elements if any */
  specialElementsDescription?: string;

  /** Array of sub-chapters (for parts) */
  chapters?: Chapter[];

  /** Key topics covered in this chapter */
  keyTopics?: string[];

  /** Short description of the chapter */
  description?: string;
}

export interface CharacterInfo {
  /** Character name in the fairytale */
  name: string;

  /** Real name (if applicable) */
  realName?: string;

  /** Role in the story */
  role: string;

  /** Description of the character */
  description: string;
}

export interface PolanaMetadata {
  /** Story title */
  title: string;

  /** Story subtitle */
  subtitle: string;

  /** Story description */
  description: string;

  /** Main author/narrator */
  author: string;

  /** Genre classification */
  genre: string;

  /** Total word count */
  totalWords: number;

  /** Narrative timespan */
  timespan: string;

  /** Main themes of the story */
  themes: string[];

  /** Main characters */
  characters: CharacterInfo[];

  /** Cover image URL (optional) */
  coverImage?: string;
}

export interface PolanaData {
  /** Story metadata */
  metadata: PolanaMetadata;

  /** All chapters in reading order */
  chapters: Chapter[];
}

export interface ReadingProgress {
  /** ID of the last read chapter */
  lastChapterId: string;

  /** Set of chapter IDs that have been read */
  readChapters: Set<string>;

  /** Total reading time in minutes */
  totalReadingTime: number;

  /** Progress percentage (0-100) */
  progressPercentage: number;

  /** Last updated timestamp */
  lastUpdated: Date;
}

export interface NavigationItem {
  /** Chapter ID to navigate to */
  chapterId: string;

  /** Display label */
  label: string;

  /** Whether this is the current chapter */
  isCurrent: boolean;

  /** Whether this chapter has been read */
  isRead: boolean;

  /** Nesting level (for part hierarchy) */
  level: number;
}
