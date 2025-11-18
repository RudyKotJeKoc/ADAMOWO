import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { polanaData, getChapterById, getNextChapter, getPreviousChapter } from './polana.data';
import { ChapterContent } from './ChapterContent';
import { ChapterNavigation } from './ChapterNavigation';
import { TableOfContents } from './TableOfContents';
import './polana.css';

const STORAGE_KEY_LAST_CHAPTER = 'polana-klamstw-last-chapter';
const STORAGE_KEY_READ_CHAPTERS = 'polana-klamstw-read-chapters';

/**
 * PolanaKlamstwReader Component
 *
 * Main reader component that manages:
 * - Chapter display and navigation
 * - Reading progress tracking
 * - Table of contents vs chapter view
 * - localStorage persistence
 * - Bookmark/continue reading functionality
 * - Responsive layout
 */
export function PolanaKlamstwReader() {
  const { chapterId } = useParams<{ chapterId?: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // State for tracking reading progress
  const [readChapters, setReadChapters] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_READ_CHAPTERS);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Determine what to show: Table of Contents or specific chapter
  const showTableOfContents = !chapterId;

  // Get current chapter data
  const currentChapter = chapterId ? getChapterById(chapterId) : null;
  const previousChapter = chapterId ? getPreviousChapter(chapterId) : null;
  const nextChapter = chapterId ? getNextChapter(chapterId) : null;

  // Save last read chapter to localStorage
  useEffect(() => {
    if (chapterId) {
      localStorage.setItem(STORAGE_KEY_LAST_CHAPTER, chapterId);
    }
  }, [chapterId]);

  // Save read chapters to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_READ_CHAPTERS,
        JSON.stringify(Array.from(readChapters))
      );
    } catch (error) {
      console.error('Failed to save reading progress:', error);
    }
  }, [readChapters]);

  // Handle chapter viewed (mark as read after 2 seconds)
  const handleChapterViewed = (viewedChapterId: string) => {
    setReadChapters((prev) => {
      const updated = new Set(prev);
      updated.add(viewedChapterId);
      return updated;
    });
  };

  // Handle chapter selection from table of contents
  const handleChapterSelect = (selectedChapterId: string) => {
    navigate(`/polana-klamstw/${selectedChapterId}`);
  };

  // Prompt to continue reading on first load
  useEffect(() => {
    if (showTableOfContents) {
      const lastChapter = localStorage.getItem(STORAGE_KEY_LAST_CHAPTER);
      if (lastChapter && lastChapter !== 'undefined') {
        // Check if user wants to continue
        const shouldContinue = window.confirm(
          t(
            'polanaKlamstw.continueReading',
            `Kontynuować czytanie od ostatniego rozdziału?`
          )
        );
        if (shouldContinue) {
          navigate(`/polana-klamstw/${lastChapter}`);
        }
      }
    }
  }, [showTableOfContents, navigate, t]);

  // Error handling for invalid chapter IDs
  if (chapterId && !currentChapter) {
    return (
      <div className="polana-klamstw-error" role="alert">
        <h2>{t('error.chapterNotFound', 'Rozdział nie został znaleziony')}</h2>
        <p>
          {t(
            'error.chapterNotFoundDescription',
            'Przepraszamy, ale ten rozdział nie istnieje lub został przeniesiony.'
          )}
        </p>
        <button
          onClick={() => navigate('/polana-klamstw')}
          className="error-button"
        >
          {t('polanaKlamstw.backToContents', 'Powrót do spisu treści')}
        </button>
      </div>
    );
  }

  // Render table of contents view
  if (showTableOfContents) {
    return (
      <div className="polana-klamstw-reader polana-klamstw-toc-view">
        <TableOfContents
          chapters={polanaData.chapters}
          readChapters={readChapters}
          onChapterSelect={handleChapterSelect}
        />
      </div>
    );
  }

  // Render chapter reading view
  return (
    <div className="polana-klamstw-reader polana-klamstw-chapter-view">
      {/* Chapter content */}
      {currentChapter && (
        <ChapterContent
          chapter={currentChapter}
          onChapterViewed={handleChapterViewed}
        />
      )}

      {/* Navigation between chapters */}
      <ChapterNavigation
        previousChapter={previousChapter}
        nextChapter={nextChapter}
        currentChapter={currentChapter || undefined}
        showTableOfContents={true}
      />

      {/* Reading progress indicator (sticky) */}
      {currentChapter && (
        <aside className="reading-progress-sidebar" aria-label="Postęp czytania">
          <div className="progress-info">
            <h3 className="progress-title">Twój postęp</h3>
            <p className="progress-stats">
              {readChapters.size} / {polanaData.chapters.length} rozdziałów
            </p>
            <div
              className="progress-bar-small"
              role="progressbar"
              aria-valuenow={Math.round(
                (readChapters.size / polanaData.chapters.length) * 100
              )}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="progress-fill-small"
                style={{
                  width: `${(readChapters.size / polanaData.chapters.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
