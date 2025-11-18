import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Chapter } from './polana.types';

interface TableOfContentsProps {
  /** All chapters in the story */
  chapters: Chapter[];
  /** Currently active chapter ID (for highlighting) */
  currentChapterId?: string;
  /** Set of chapter IDs that have been read */
  readChapters?: Set<string>;
  /** Callback when a chapter is selected */
  onChapterSelect?: (chapterId: string) => void;
}

/**
 * TableOfContents Component
 *
 * Displays an accessible, hierarchical table of contents with:
 * - Keyboard navigation support
 * - Visual indicators for read/unread chapters
 * - Current chapter highlighting
 * - Progress tracking
 * - Estimated reading times
 * - ARIA landmarks and labels
 */
export function TableOfContents({
  chapters,
  currentChapterId,
  readChapters = new Set(),
  onChapterSelect,
}: TableOfContentsProps) {
  const { t } = useTranslation();

  // Calculate overall progress
  const totalChapters = chapters.length;
  const readCount = readChapters.size;
  const progressPercentage = totalChapters > 0 ? (readCount / totalChapters) * 100 : 0;

  // Calculate total reading time
  const totalReadingTime = chapters.reduce(
    (sum, ch) => sum + (ch.estimatedReadingTime || 0),
    0
  );

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
    <nav className="table-of-contents" aria-labelledby="toc-title">
      {/* Header */}
      <header className="toc-header">
        <h2 id="toc-title" className="toc-title">
          {t('polanaKlamstw.tableOfContents', 'Spis Treści')}
        </h2>

        <p className="toc-subtitle">
          {t('polanaKlamstw.subtitle', 'Baśń współczesna o tym, jak echo może być silniejsze niż głos, a wolność cenniejsza niż majątek.')}
        </p>

        {/* Progress bar */}
        <div className="toc-progress" aria-label="Postęp czytania">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
              role="progressbar"
              aria-valuenow={Math.round(progressPercentage)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${readCount} z ${totalChapters} rozdziałów przeczytanych`}
            />
          </div>
          <p className="progress-text">
            <span className="progress-count">
              {readCount} / {totalChapters}
            </span>
            <span className="progress-label">
              {t('polanaKlamstw.chaptersRead', 'rozdziałów przeczytanych')}
            </span>
          </p>
        </div>

        {/* Total reading time */}
        <p className="toc-reading-time">
          <svg
            className="icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm0 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm.5 2v5.5l3.5 2.1-.7 1.1-4.3-2.6V3h1.5z" />
          </svg>
          <span>
            {t('polanaKlamstw.totalReadingTime', 'Całkowity czas czytania')}: ~{totalReadingTime} min
          </span>
        </p>
      </header>

      {/* Chapter list */}
      <ol className="toc-list" role="list">
        {chapters.map((chapter) => {
          const isRead = readChapters.has(chapter.id);
          const isCurrent = chapter.id === currentChapterId;
          const chapterLabel = getChapterLabel(chapter);

          return (
            <li key={chapter.id} className="toc-item">
              <Link
                to={`/polana-klamstw/${chapter.id}`}
                className={`toc-link ${isCurrent ? 'toc-link-current' : ''} ${isRead ? 'toc-link-read' : ''}`}
                aria-current={isCurrent ? 'page' : undefined}
                onClick={() => onChapterSelect?.(chapter.id)}
              >
                {/* Status indicator */}
                <span className="toc-status" aria-hidden="true">
                  {isRead ? (
                    <svg
                      className="icon-check"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 0C4.5 0 0 4.5 0 10s4.5 10 10 10 10-4.5 10-10S15.5 0 10 0zm-2 15l-5-5 1.4-1.4L8 12.2l7.6-7.6L17 6l-9 9z" />
                    </svg>
                  ) : (
                    <span className="icon-circle" />
                  )}
                </span>

                {/* Chapter info */}
                <div className="toc-info">
                  <div className="toc-number">{chapterLabel}</div>
                  <div className="toc-chapter-title">{chapter.title}</div>

                  <div className="toc-meta">
                    <span className="toc-time">
                      {chapter.estimatedReadingTime} min
                    </span>
                    {chapter.hasSpecialElements && (
                      <span
                        className="toc-special"
                        aria-label="Zawiera elementy interaktywne"
                      >
                        <svg
                          className="icon"
                          width="14"
                          height="14"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M8 0l2.5 5 5.5.8-4 3.9.9 5.3-4.9-2.6L3.1 15l.9-5.3-4-3.9 5.5-.8L8 0z" />
                        </svg>
                      </span>
                    )}
                  </div>
                </div>

                {/* Current indicator */}
                {isCurrent && (
                  <span className="toc-current-badge" aria-label="Aktualnie czytany">
                    <svg
                      className="icon"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M4 0l8 8-8 8V0z" />
                    </svg>
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ol>

      {/* Footer with story info */}
      <footer className="toc-footer">
        <p className="toc-story-info">
          <strong>Polana Kłamstw</strong>
          <br />
          {totalChapters} rozdziałów · {chapters[0]?.wordCount ?
            `${chapters.reduce((sum, ch) => sum + (ch.wordCount || 0), 0).toLocaleString('pl-PL')} słów` :
            ''}
        </p>
      </footer>
    </nav>
  );
}
