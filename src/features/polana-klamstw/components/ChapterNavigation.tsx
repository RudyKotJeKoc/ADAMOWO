import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import type { Chapter } from '../types';

interface ChapterNavigationProps {
  previousChapter?: Chapter;
  nextChapter?: Chapter;
}

/**
 * Navigation component for moving between chapters
 */
export function ChapterNavigation({ previousChapter, nextChapter }: ChapterNavigationProps) {
  return (
    <nav className="flex items-center justify-between gap-4 py-8 border-t border-b border-base-800">
      {/* Previous Chapter */}
      <div className="flex-1">
        {previousChapter ? (
          <Link
            to={`/polana-klamstw/${previousChapter.id}`}
            className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-base-800 bg-base-950/40 hover:bg-base-900/60 hover:border-accent-400 transition-all"
          >
            <ChevronLeftIcon className="w-5 h-5 text-accent-300 group-hover:text-accent-200" />
            <div className="text-left">
              <div className="text-xs uppercase tracking-wider text-base-400">Poprzedni</div>
              <div className="text-sm font-medium text-base-200 group-hover:text-base-50">
                {previousChapter.title}
              </div>
            </div>
          </Link>
        ) : (
          <div className="px-4 py-3 text-base-600 text-sm">Początek książki</div>
        )}
      </div>

      {/* Table of Contents */}
      <Link
        to="/polana-klamstw"
        className="flex items-center gap-2 px-4 py-3 rounded-xl border border-base-700 bg-base-900/40 hover:bg-accent-500/10 hover:border-accent-400 transition-all"
        title="Spis treści"
      >
        <ListBulletIcon className="w-5 h-5 text-accent-300" />
        <span className="text-sm font-medium text-base-200">Spis treści</span>
      </Link>

      {/* Next Chapter */}
      <div className="flex-1 flex justify-end">
        {nextChapter ? (
          <Link
            to={`/polana-klamstw/${nextChapter.id}`}
            className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-base-800 bg-base-950/40 hover:bg-base-900/60 hover:border-accent-400 transition-all"
          >
            <div className="text-right">
              <div className="text-xs uppercase tracking-wider text-base-400">Następny</div>
              <div className="text-sm font-medium text-base-200 group-hover:text-base-50">
                {nextChapter.title}
              </div>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-accent-300 group-hover:text-accent-200" />
          </Link>
        ) : (
          <div className="px-4 py-3 text-base-600 text-sm text-right">Koniec książki</div>
        )}
      </div>
    </nav>
  );
}
