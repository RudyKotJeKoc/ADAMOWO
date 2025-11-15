import { useParams, Navigate } from 'react-router-dom';
import { ChapterContent } from './ChapterContent';
import { ChapterNavigation } from './ChapterNavigation';
import { TableOfContents } from './TableOfContents';
import {
  getBookData,
  getChapterById,
  getNextChapter,
  getPreviousChapter,
  isValidChapterId,
} from '../utils/chapterLoader';

/**
 * Main reader component for Polana Kłamstw
 * Handles routing and displays either TOC or chapter content
 */
export function PolanaKlamstwReader() {
  const { chapterId } = useParams<{ chapterId?: string }>();
  const bookData = getBookData();

  // Show table of contents if no chapter specified
  if (!chapterId) {
    return (
      <div className="min-h-screen bg-base-950 px-4 py-12">
        <TableOfContents bookData={bookData} />
      </div>
    );
  }

  // Validate chapter ID
  if (!isValidChapterId(chapterId)) {
    return <Navigate to="/polana-klamstw" replace />;
  }

  const currentChapter = getChapterById(chapterId);
  if (!currentChapter) {
    return <Navigate to="/polana-klamstw" replace />;
  }

  const previousChapter = getPreviousChapter(chapterId);
  const nextChapter = getNextChapter(chapterId);

  return (
    <div className="min-h-screen bg-base-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Chapter Content */}
        <ChapterContent chapter={currentChapter} />

        {/* Navigation */}
        <div className="mt-12">
          <ChapterNavigation previousChapter={previousChapter} nextChapter={nextChapter} />
        </div>
      </div>
    </div>
  );
}
