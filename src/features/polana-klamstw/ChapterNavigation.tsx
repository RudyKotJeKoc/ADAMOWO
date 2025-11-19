import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Chapter } from './polana.types';

interface ChapterNavigationProps {
  /** Previous chapter (null if at beginning) */
  previousChapter: Chapter | null;
  /** Next chapter (null if at end) */
  nextChapter: Chapter | null;
  /** Current chapter info (for context) */
  currentChapter?: Chapter;
  /** Show link back to table of contents */
  showTableOfContents?: boolean;
}

/**
 * ChapterNavigation Component
 *
 * Provides accessible navigation between chapters with:
 * - Previous/Next chapter links
 * - Back to table of contents
 * - Keyboard navigation (arrow keys)
 * - ARIA labels for screen readers
 * - Visual indicators for chapter titles
 * - Touch-friendly sizing
 */
export function ChapterNavigation({
  previousChapter,
  nextChapter,
  currentChapter,
  showTableOfContents = true,
}: ChapterNavigationProps) {
  const { t } = useTranslation();

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' && previousChapter) {
      window.location.href = `/polana-klamstw/${previousChapter.id}`;
    } else if (e.key === 'ArrowRight' && nextChapter) {
      window.location.href = `/polana-klamstw/${nextChapter.id}`;
    }
  };

  const getChapterLabel = (chapter: Chapter): string => {
    if (chapter.type === 'prolog') {
      return t('polanaKlamstw.prolog', 'Prolog');
    } else if (chapter.type === 'epilog') {
      return t('polanaKlamstw.epilog', 'Epilog');
    } else if (chapter.chapterNumber) {
      return `${t('polanaKlamstw.chapter', 'Rozdział')} ${chapter.chapterNumber}`;
    }
    return chapter.title;
  };

  return (
    <nav
      className="chapter-navigation"
      aria-label="Nawigacja między rozdziałami"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* Back to table of contents */}
      {showTableOfContents && (
        <div className="nav-toc">
          <Link
            to="/polana-klamstw"
            className="nav-toc-link"
            aria-label="Powrót do spisu treści"
          >
            <svg
              className="icon"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M3 3h4v4H3V3zm6 0h8v2H9V3zm0 4h8v2H9V7zm0 4h8v2H9v-2zm0 4h8v2H9v-2zm-6-8h4v4H3V7zm0 6h4v4H3v-4z" />
            </svg>
            <span>{t('polanaKlamstw.backToContents', 'Powrót do spisu treści')}</span>
          </Link>
        </div>
      )}

      {/* Previous/Next navigation */}
      <div className="nav-buttons">
        {/* Previous chapter */}
        {previousChapter ? (
          <Link
            to={`/polana-klamstw/${previousChapter.id}`}
            className="nav-button nav-button-prev"
            aria-label={`Poprzedni rozdział: ${getChapterLabel(previousChapter)}`}
          >
            <span className="nav-arrow" aria-hidden="true">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M15.4 7.4L14 6l-6 6 6 6 1.4-1.4L10.8 12z" />
              </svg>
            </span>
            <span className="nav-text">
              <span className="nav-label">
                {t('polanaKlamstw.previousChapter', 'Poprzedni rozdział')}
              </span>
              <span className="nav-title">{getChapterLabel(previousChapter)}</span>
              <span className="nav-chapter-title">{previousChapter.title}</span>
            </span>
          </Link>
        ) : (
          <div className="nav-spacer" />
        )}

        {/* Current chapter indicator (mobile) */}
        {currentChapter && (
          <div className="nav-current" aria-hidden="true">
            <span className="nav-current-label">
              {getChapterLabel(currentChapter)}
            </span>
          </div>
        )}

        {/* Next chapter */}
        {nextChapter ? (
          <Link
            to={`/polana-klamstw/${nextChapter.id}`}
            className="nav-button nav-button-next"
            aria-label={`Następny rozdział: ${getChapterLabel(nextChapter)}`}
          >
            <span className="nav-text">
              <span className="nav-label">
                {t('polanaKlamstw.nextChapter', 'Następny rozdział')}
              </span>
              <span className="nav-title">{getChapterLabel(nextChapter)}</span>
              <span className="nav-chapter-title">{nextChapter.title}</span>
            </span>
            <span className="nav-arrow" aria-hidden="true">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8.6 7.4L10 6l6 6-6 6-1.4-1.4L13.2 12z" />
              </svg>
            </span>
          </Link>
        ) : (
          <div className="nav-spacer" />
        )}
      </div>

      {/* Keyboard hint */}
      <div className="nav-hint" aria-live="polite" aria-atomic="true">
        <kbd className="nav-key">←</kbd>
        <span className="nav-hint-text">Poprzedni</span>
        <kbd className="nav-key">→</kbd>
        <span className="nav-hint-text">Następny</span>
      </div>
    </nav>
  );
}
