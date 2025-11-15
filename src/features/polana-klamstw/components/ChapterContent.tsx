import { useEffect } from 'react';
import type { Chapter } from '../types';
import { updateCurrentChapter } from '../utils/progressStorage';

interface ChapterContentProps {
  chapter: Chapter;
}

/**
 * Component for displaying chapter content
 * Renders markdown content and updates reading progress
 */
export function ChapterContent({ chapter }: ChapterContentProps) {
  useEffect(() => {
    // Update reading progress when chapter changes
    updateCurrentChapter(chapter.id);
  }, [chapter.id]);

  // Convert markdown newlines to paragraphs (simple approach)
  const renderContent = () => {
    const paragraphs = chapter.content.split('\n\n').filter((p) => p.trim());

    return paragraphs.map((paragraph, index) => {
      // Handle headers
      if (paragraph.startsWith('# ')) {
        return (
          <h1 key={index} className="text-3xl font-bold mb-6 text-base-50">
            {paragraph.replace(/^#\s+/, '')}
          </h1>
        );
      }
      if (paragraph.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-semibold mb-4 text-base-100">
            {paragraph.replace(/^##\s+/, '')}
          </h2>
        );
      }
      if (paragraph.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-medium mb-3 text-base-200">
            {paragraph.replace(/^###\s+/, '')}
          </h3>
        );
      }

      // Handle horizontal rules
      if (paragraph.trim() === '---') {
        return <hr key={index} className="my-8 border-base-700" />;
      }

      // Handle lists
      if (paragraph.startsWith('-') || paragraph.startsWith('*')) {
        const items = paragraph.split('\n').filter((item) => item.trim());
        return (
          <ul key={index} className="list-disc list-inside mb-6 text-base-200 space-y-2">
            {items.map((item, i) => (
              <li key={i}>{item.replace(/^[-*]\s+/, '')}</li>
            ))}
          </ul>
        );
      }

      // Regular paragraph
      // Handle bold and italic
      let content = paragraph;
      content = content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      content = content.replace(/\*(.+?)\*/g, '<em>$1</em>');

      return (
        <p
          key={index}
          className="mb-6 text-base-200 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    });
  };

  return (
    <article className="prose prose-invert max-w-none">
      {/* Chapter Header */}
      <header className="mb-8 pb-6 border-b border-base-800">
        {chapter.number !== null && (
          <span className="text-sm uppercase tracking-wider text-accent-300 font-semibold">
            Rozdział {chapter.number}
          </span>
        )}
        <h1 className="text-4xl font-bold mt-2 mb-3 text-base-50">{chapter.title}</h1>
        {chapter.subtitle && <p className="text-xl text-base-300 italic">{chapter.subtitle}</p>}
        <div className="flex items-center gap-4 mt-4 text-sm text-base-400">
          <span>{chapter.estimatedReadingTime} min czytania</span>
          {chapter.publishDate && (
            <>
              <span>•</span>
              <span>{new Date(chapter.publishDate).toLocaleDateString('pl-PL')}</span>
            </>
          )}
        </div>
      </header>

      {/* Chapter Content */}
      <div className="chapter-content">{renderContent()}</div>

      {/* Author Notes */}
      {chapter.notes && (
        <footer className="mt-12 pt-6 border-t border-base-800">
          <h3 className="text-sm uppercase tracking-wider text-base-400 mb-3">Notatki Autora</h3>
          <p className="text-sm text-base-300 italic">{chapter.notes}</p>
        </footer>
      )}
    </article>
  );
}
