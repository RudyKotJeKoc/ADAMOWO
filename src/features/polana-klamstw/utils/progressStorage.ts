/**
 * Utility functions for managing reading progress in localStorage
 */

import type { ReadingProgress } from '../types';

const STORAGE_KEY = 'polana-klamstw-progress';

/**
 * Get reading progress from localStorage
 */
export function getReadingProgress(): ReadingProgress | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as ReadingProgress;
  } catch (error) {
    console.error('Failed to read progress from localStorage:', error);
    return null;
  }
}

/**
 * Save reading progress to localStorage
 */
export function saveReadingProgress(progress: ReadingProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save progress to localStorage:', error);
  }
}

/**
 * Update current chapter and timestamp
 */
export function updateCurrentChapter(chapterId: string): void {
  const progress = getReadingProgress() || {
    currentChapterId: chapterId,
    percentageRead: 0,
    lastRead: new Date().toISOString(),
    bookmarks: [],
  };

  progress.currentChapterId = chapterId;
  progress.lastRead = new Date().toISOString();

  saveReadingProgress(progress);
}

/**
 * Add a bookmark for a chapter
 */
export function addBookmark(chapterId: string): void {
  const progress = getReadingProgress() || {
    currentChapterId: '',
    percentageRead: 0,
    lastRead: new Date().toISOString(),
    bookmarks: [],
  };

  if (!progress.bookmarks.includes(chapterId)) {
    progress.bookmarks.push(chapterId);
    saveReadingProgress(progress);
  }
}

/**
 * Remove a bookmark for a chapter
 */
export function removeBookmark(chapterId: string): void {
  const progress = getReadingProgress();
  if (!progress) return;

  progress.bookmarks = progress.bookmarks.filter((id) => id !== chapterId);
  saveReadingProgress(progress);
}

/**
 * Check if a chapter is bookmarked
 */
export function isBookmarked(chapterId: string): boolean {
  const progress = getReadingProgress();
  return progress?.bookmarks.includes(chapterId) || false;
}

/**
 * Clear all reading progress
 */
export function clearProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}
