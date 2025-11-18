/**
 * POLANA KŁAMSTW - Complete Story Data
 *
 * Baśń współczesna o tym, jak echo może być silniejsze niż głos,
 * a wolność cenniejsza niż majątek.
 *
 * This file contains the complete text content and metadata for the story
 * "Polana Kłamstw: Kronika Ósmego Kręgu"
 */

import type { Chapter, PolanaData, PolanaMetadata } from './polana.types';

// Import all chapter files
import { chapter as prolog } from './chapters/prolog';
import { chapter as chapter01 } from './chapters/chapter-01';
import { chapter as chapter02 } from './chapters/chapter-02';
import { chapter03 } from './chapters/chapter-03';
import { chapter05 } from './chapters/chapter-05';
import { chapter06 } from './chapters/chapter-06';
import { chapter07 } from './chapters/chapter-07';
import { chapter08 } from './chapters/chapter-08';
import { chapter09 } from './chapters/chapter-09';
import { chapter10 } from './chapters/chapter-10';
import { chapter11 } from './chapters/chapter-11';
import { chapter12 } from './chapters/chapter-12';
import { epilog } from './chapters/epilog';

/**
 * Complete story metadata
 */
const metadata: PolanaMetadata = {
  title: 'POLANA KŁAMSTW',
  subtitle: 'Kronika Ósmego Kręgu',
  description:
    'Baśń współczesna o tym, jak echo może być silniejsze niż głos, a wolność cenniejsza niż majątek.',
  author: 'Dariusz Adamski',
  genre: 'Contemporary Fairytale/Literary Chronicle',
  totalWords: 17375,
  timespan: '2017-2028 (main timeline), with philosophical epilogue',
  themes: [
    'Family conflict and manipulation',
    'The power of narrative and echo over truth',
    'Goodness weaponized against the good',
    'Obsessive control and its destructive nature',
    'The paradox of winning while losing everything',
    'Freedom vs. material possessions',
  ],
  characters: [
    {
      name: 'Wilk Samotnik (The Lone Wolf)',
      realName: 'Dariusz',
      role: 'Protagonist - Good-hearted son',
      description: "Only predator who doesn't hunt the weak; works abroad, invests in family home",
    },
    {
      name: 'Wiedźma Adamowska (The Witch)',
      realName: 'Barbara',
      role: 'Antagonist - Manipulator',
      description: 'Uses the Cauldron of Wrongs to accumulate grievances and orchestrate revenge',
    },
    {
      name: 'Sarenka z Polany (Little Doe)',
      realName: 'Julia',
      role: 'Catalyst/Secondary protagonist',
      description: 'Spark that ignites the conflict',
    },
    {
      name: 'Stary Jeleń Sylwester (Old Deer Sylvester)',
      realName: 'Sylwester',
      role: 'Tragic figure',
      description:
        "Once strong, now paralyzed by stroke (red cap as symbol) and his wife's control",
    },
    {
      name: 'Hiena Domkowa (House Hyena)',
      realName: 'Defense Attorney - Aleksander Domek',
      role: 'Betrayer',
      description: 'Scavenger who profits from the conflict then betrays the protagonist',
    },
    {
      name: 'Puszczyk Halager (Judge Owl)',
      role: 'System representative',
      description:
        'Sees only documents (paper), never descends to earth (reality), issues binding judgments',
    },
    {
      name: 'Sroka Dorota (Magpie Dorothy)',
      realName: 'Sister Barbara',
      role: 'Gossip/Amplifier',
      description: 'Advises the Witch to keep detailed records; spreads distorted information',
    },
  ],
};

/**
 * Complete story data with all chapters in reading order
 */
export const polanaData: PolanaData = {
  metadata,
  chapters: [
    prolog,
    chapter01,
    chapter02,
    chapter03,
    // Note: chapter 4 is intentionally missing from the source material
    chapter05,
    chapter06,
    chapter07,
    chapter08,
    chapter09,
    chapter10,
    chapter11,
    chapter12,
    epilog,
  ],
};

/**
 * Utility function to calculate estimated reading time
 * @param wordCount - Number of words in the content
 * @returns Estimated reading time in minutes (assumes 200 words/minute)
 */
export function calculateReadingTime(wordCount: number): number {
  const wordsPerMinute = 200;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Get chapter by ID
 * @param id - Chapter identifier (e.g., 'prolog', 'ch1', 'epilog')
 * @returns Chapter object or undefined if not found
 */
export function getChapterById(id: string): Chapter | undefined {
  return polanaData.chapters.find((chapter) => chapter.id === id);
}

/**
 * Get all chapters of a specific type
 * @param type - Chapter type to filter by
 * @returns Array of matching chapters
 */
export function getChaptersByType(type: Chapter['type']): Chapter[] {
  return polanaData.chapters.filter((chapter) => chapter.type === type);
}

/**
 * Get next chapter in reading order
 * @param currentId - Current chapter ID
 * @returns Next chapter or undefined if at the end
 */
export function getNextChapter(currentId: string): Chapter | undefined {
  const currentIndex = polanaData.chapters.findIndex((ch) => ch.id === currentId);
  if (currentIndex === -1 || currentIndex === polanaData.chapters.length - 1) {
    return undefined;
  }
  return polanaData.chapters[currentIndex + 1];
}

/**
 * Get previous chapter in reading order
 * @param currentId - Current chapter ID
 * @returns Previous chapter or undefined if at the beginning
 */
export function getPreviousChapter(currentId: string): Chapter | undefined {
  const currentIndex = polanaData.chapters.findIndex((ch) => ch.id === currentId);
  if (currentIndex <= 0) {
    return undefined;
  }
  return polanaData.chapters[currentIndex - 1];
}

/**
 * Get total reading time for all chapters
 * @returns Total estimated reading time in minutes
 */
export function getTotalReadingTime(): number {
  return polanaData.chapters.reduce((total, chapter) => {
    return total + chapter.estimatedReadingTime;
  }, 0);
}

/**
 * Get chapters with special interactive elements
 * @returns Array of chapters that have special elements
 */
export function getChaptersWithSpecialElements(): Chapter[] {
  return polanaData.chapters.filter((chapter) => chapter.hasSpecialElements);
}

/**
 * Search chapters by keyword in title or description
 * @param keyword - Search term
 * @returns Array of matching chapters
 */
export function searchChapters(keyword: string): Chapter[] {
  const lowerKeyword = keyword.toLowerCase();
  return polanaData.chapters.filter(
    (chapter) =>
      chapter.title.toLowerCase().includes(lowerKeyword) ||
      chapter.description?.toLowerCase().includes(lowerKeyword) ||
      chapter.keyTopics?.some((topic) => topic.toLowerCase().includes(lowerKeyword))
  );
}

/**
 * Get chapter progress info
 * @param currentId - Current chapter ID
 * @returns Progress information (current index, total count, percentage)
 */
export function getChapterProgress(currentId: string): {
  currentIndex: number;
  totalChapters: number;
  percentageComplete: number;
} {
  const currentIndex = polanaData.chapters.findIndex((ch) => ch.id === currentId);
  const totalChapters = polanaData.chapters.length;
  const percentageComplete =
    currentIndex >= 0 ? Math.round(((currentIndex + 1) / totalChapters) * 100) : 0;

  return {
    currentIndex: currentIndex + 1, // Convert to 1-based index
    totalChapters,
    percentageComplete,
  };
}

export default polanaData;
