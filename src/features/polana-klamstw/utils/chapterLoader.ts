/**
 * Utility functions for loading chapter data
 */

import type { Chapter, BookMetadata, BookData } from '../types';
import metadata from '../data/metadata.json';

// Import all chapter JSON files
import prolog from '../data/chapters/prolog.json';
import chapter01 from '../data/chapters/chapter-01.json';
import chapter02 from '../data/chapters/chapter-02.json';
import chapter03 from '../data/chapters/chapter-03.json';
import chapter04 from '../data/chapters/chapter-04.json';
import chapter05 from '../data/chapters/chapter-05.json';
import chapter06 from '../data/chapters/chapter-06.json';
import chapter07 from '../data/chapters/chapter-07.json';
import chapter08 from '../data/chapters/chapter-08.json';
import chapter09 from '../data/chapters/chapter-09.json';
import chapter10 from '../data/chapters/chapter-10.json';
import chapter11 from '../data/chapters/chapter-11.json';
import chapter12 from '../data/chapters/chapter-12.json';
import chapter13 from '../data/chapters/chapter-13.json';
import epilog from '../data/chapters/epilog.json';

/**
 * All chapters in reading order
 */
const allChapters: Chapter[] = [
  prolog as Chapter,
  chapter01 as Chapter,
  chapter02 as Chapter,
  chapter03 as Chapter,
  chapter04 as Chapter,
  chapter05 as Chapter,
  chapter06 as Chapter,
  chapter07 as Chapter,
  chapter08 as Chapter,
  chapter09 as Chapter,
  chapter10 as Chapter,
  chapter11 as Chapter,
  chapter12 as Chapter,
  chapter13 as Chapter,
  epilog as Chapter,
];

/**
 * Get complete book data with metadata and all chapters
 */
export function getBookData(): BookData {
  return {
    metadata: metadata as BookMetadata,
    chapters: allChapters,
  };
}

/**
 * Get a specific chapter by ID
 * @param chapterId - Chapter ID (e.g., 'prolog', '1', '13', 'epilog')
 */
export function getChapterById(chapterId: string): Chapter | undefined {
  return allChapters.find((ch) => ch.id === chapterId);
}

/**
 * Get the next chapter after the current one
 * @param currentId - Current chapter ID
 */
export function getNextChapter(currentId: string): Chapter | undefined {
  const currentIndex = allChapters.findIndex((ch) => ch.id === currentId);
  if (currentIndex === -1 || currentIndex === allChapters.length - 1) {
    return undefined;
  }
  return allChapters[currentIndex + 1];
}

/**
 * Get the previous chapter before the current one
 * @param currentId - Current chapter ID
 */
export function getPreviousChapter(currentId: string): Chapter | undefined {
  const currentIndex = allChapters.findIndex((ch) => ch.id === currentId);
  if (currentIndex <= 0) {
    return undefined;
  }
  return allChapters[currentIndex - 1];
}

/**
 * Get chapter index in the book (0-based)
 * @param chapterId - Chapter ID
 */
export function getChapterIndex(chapterId: string): number {
  return allChapters.findIndex((ch) => ch.id === chapterId);
}

/**
 * Calculate total estimated reading time for all chapters
 */
export function getTotalReadingTime(): number {
  return allChapters.reduce((total, chapter) => total + chapter.estimatedReadingTime, 0);
}

/**
 * Get all numbered chapters (excluding prolog and epilog)
 */
export function getNumberedChapters(): Chapter[] {
  return allChapters.filter((ch) => ch.number !== null);
}

/**
 * Validate chapter ID
 * @param chapterId - Chapter ID to validate
 */
export function isValidChapterId(chapterId: string): boolean {
  return allChapters.some((ch) => ch.id === chapterId);
}
