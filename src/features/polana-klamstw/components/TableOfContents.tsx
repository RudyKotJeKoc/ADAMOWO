import { Link } from 'react-router-dom';
import { BookOpenIcon, ClockIcon } from '@heroicons/react/24/outline';
import type { BookData } from '../types';
import { getReadingProgress } from '../utils/progressStorage';

interface TableOfContentsProps {
  bookData: BookData;
}

/**
 * Table of Contents component
 * Displays all chapters with reading progress indicators
 */
export function TableOfContents({ bookData }: TableOfContentsProps) {
  const progress = getReadingProgress();
  const currentChapterId = progress?.currentChapterId;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Book Header */}
      <header className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-500/20 to-accent-600/20 border border-accent-400/30 mb-6">
          <BookOpenIcon className="w-10 h-10 text-accent-300" />
        </div>
        <h1 className="text-4xl font-bold mb-3 text-base-50">{bookData.metadata.title}</h1>
        <p className="text-lg text-base-300 mb-2">{bookData.metadata.description}</p>
        <p className="text-sm text-base-400">
          {bookData.metadata.author} • {bookData.metadata.year}
        </p>
        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-base-400">
          <ClockIcon className="w-4 h-4" />
          <span>
            {bookData.chapters.reduce((sum, ch) => sum + ch.estimatedReadingTime, 0)} minut
            całkowitego czasu czytania
          </span>
        </div>
      </header>

      {/* Chapters List */}
      <div className="space-y-3">
        {bookData.chapters.map((chapter) => {
          const isCurrent = chapter.id === currentChapterId;
          const isCompleted = progress?.bookmarks.includes(chapter.id);

          return (
            <Link
              key={chapter.id}
              to={`/polana-klamstw/${chapter.id}`}
              className={`
                group block p-6 rounded-xl border transition-all
                ${
                  isCurrent
                    ? 'bg-accent-500/10 border-accent-400 shadow-lg shadow-accent-500/20'
                    : 'bg-base-950/60 border-base-800 hover:bg-base-900/60 hover:border-accent-400/50'
                }
              `}
            >
              <div className="flex items-start gap-4">
                {/* Chapter Number */}
                <div className="flex-shrink-0">
                  {chapter.number !== null ? (
                    <div
                      className={`
                      w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg
                      ${isCurrent ? 'bg-accent-500/20 text-accent-200 border border-accent-400' : 'bg-base-900 text-base-400 border border-base-800'}
                    `}
                    >
                      {chapter.number}
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-base-900 border border-base-800">
                      <BookOpenIcon className="w-6 h-6 text-base-400" />
                    </div>
                  )}
                </div>

                {/* Chapter Info */}
                <div className="flex-1 min-w-0">
                  <h3
                    className={`text-lg font-semibold mb-1 ${isCurrent ? 'text-accent-200' : 'text-base-100 group-hover:text-base-50'}`}
                  >
                    {chapter.title}
                  </h3>
                  {chapter.subtitle && (
                    <p className="text-sm text-base-300 italic mb-2">{chapter.subtitle}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-base-400">
                    <span className="flex items-center gap-1">
                      <ClockIcon className="w-3 h-3" />
                      {chapter.estimatedReadingTime} min
                    </span>
                    {isCompleted && (
                      <span className="px-2 py-0.5 rounded-full bg-accent-500/20 text-accent-300 border border-accent-400/30">
                        Przeczytane
                      </span>
                    )}
                    {isCurrent && !isCompleted && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                        W trakcie
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Indicator */}
                {(isCurrent || isCompleted) && (
                  <div className="flex-shrink-0">
                    <div
                      className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-accent-400' : 'bg-blue-400'}`}
                    />
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer Info */}
      <footer className="mt-12 p-6 rounded-xl bg-base-900/40 border border-base-800 text-center text-sm text-base-400">
        <p>
          {bookData.metadata.totalChapters} rozdziałów • {bookData.metadata.genre}
        </p>
      </footer>
    </div>
  );
}
