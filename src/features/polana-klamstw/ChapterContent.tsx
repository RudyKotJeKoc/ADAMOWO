import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Chapter } from './polana.types';

interface ChapterContentProps {
  /** Chapter data to display */
  chapter: Chapter;
  /** Callback when chapter becomes visible (for progress tracking) */
  onChapterViewed?: (chapterId: string) => void;
}

/**
 * ChapterContent Component
 *
 * Displays a single chapter of Polana Kłamstw with:
 * - Accessible markdown rendering
 * - Proper heading hierarchy
 * - Reading time estimate
 * - ARIA landmarks and labels
 * - Responsive typography optimized for reading
 */
export function ChapterContent({ chapter, onChapterViewed }: ChapterContentProps) {
  const articleRef = useRef<HTMLElement>(null);

  // Track when chapter is viewed
  useEffect(() => {
    if (onChapterViewed) {
      // Delay to ensure user is actually reading
      const timer = setTimeout(() => {
        onChapterViewed(chapter.id);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [chapter.id, onChapterViewed]);

  // Scroll to top when chapter changes
  useEffect(() => {
    if (articleRef.current) {
      articleRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [chapter.id]);

  return (
    <article
      ref={articleRef}
      className="chapter-content"
      aria-labelledby="chapter-title"
      role="article"
    >
      {/* Chapter Header */}
      <header className="chapter-header">
        <h1 id="chapter-title" className="chapter-title">
          {chapter.title}
        </h1>

        {/* Reading metadata */}
        <div className="chapter-meta" aria-label="Informacje o rozdziale">
          <span className="reading-time" aria-label="Szacowany czas czytania">
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
            {chapter.estimatedReadingTime} min czytania
          </span>

          <span className="word-count" aria-label="Liczba słów">
            {chapter.wordCount.toLocaleString('pl-PL')} słów
          </span>

          {chapter.hasSpecialElements && (
            <span className="special-badge" aria-label="Rozdział zawiera elementy interaktywne">
              <svg
                className="icon"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 0l2.5 5 5.5.8-4 3.9.9 5.3-4.9-2.6L3.1 15l.9-5.3-4-3.9 5.5-.8L8 0z" />
              </svg>
              Elementy interaktywne
            </span>
          )}
        </div>

        {/* Chapter description */}
        {chapter.description && (
          <p className="chapter-description">{chapter.description}</p>
        )}
      </header>

      {/* Main chapter content with markdown rendering */}
      <div className="chapter-body">
        <ReactMarkdown
          components={{
            // Accessible heading levels (preserve hierarchy)
            h1: ({ children, ...props }) => (
              <h2 className="content-h1" {...props}>{children}</h2>
            ),
            h2: ({ children, ...props }) => (
              <h3 className="content-h2" {...props}>{children}</h3>
            ),
            h3: ({ children, ...props }) => (
              <h4 className="content-h3" {...props}>{children}</h4>
            ),

            // Block quotes for calendar entries and important passages
            blockquote: ({ children, ...props }) => (
              <blockquote className="content-blockquote" role="note" {...props}>
                {children}
              </blockquote>
            ),

            // Paragraphs with optimal reading line length
            p: ({ children, ...props }) => (
              <p className="content-paragraph" {...props}>{children}</p>
            ),

            // Lists with proper semantics
            ul: ({ children, ...props }) => (
              <ul className="content-list" {...props}>{children}</ul>
            ),
            ol: ({ children, ...props }) => (
              <ol className="content-list content-list-ordered" {...props}>{children}</ol>
            ),

            // Emphasis and strong with semantic meaning preserved
            em: ({ children, ...props }) => (
              <em className="content-em" {...props}>{children}</em>
            ),
            strong: ({ children, ...props }) => (
              <strong className="content-strong" {...props}>{children}</strong>
            ),

            // Links with external indicator
            a: ({ href, children, ...props }) => {
              const isExternal = href?.startsWith('http');
              return (
                <a
                  href={href}
                  className="content-link"
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  {...props}
                >
                  {children}
                  {isExternal && (
                    <svg
                      className="external-icon"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="currentColor"
                      aria-label="(otwiera w nowej karcie)"
                    >
                      <path d="M10 0v2h1.5L7 6.5 8.5 8 13 3.5V5h2V0h-5zM2 2C.9 2 0 2.9 0 4v6c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V7h-2v3H2V4h3V2H2z" />
                    </svg>
                  )}
                </a>
              );
            },
          }}
        >
          {chapter.content}
        </ReactMarkdown>
      </div>

      {/* Chapter footer with key topics */}
      {chapter.keyTopics && chapter.keyTopics.length > 0 && (
        <footer className="chapter-footer">
          <h2 className="topics-title">Kluczowe tematy</h2>
          <ul className="topic-list" aria-label="Lista kluczowych tematów rozdziału">
            {chapter.keyTopics.map((topic, index) => (
              <li key={index} className="topic-item">
                {topic}
              </li>
            ))}
          </ul>
        </footer>
      )}
    </article>
  );
}
