import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

/**
 * Represents a single search result item.
 *
 * @interface
 * @property {string} title - The display title of the search result
 * @property {string} path - The route path to navigate to when selected
 * @property {string} description - A brief description of the page or feature
 * @property {('page' | 'guide' | 'analysis' | 'tool')} type - The category type for visual distinction
 */
interface SearchResult {
  title: string;
  path: string;
  description: string;
  type: 'page' | 'guide' | 'analysis' | 'tool';
}

/**
 * Search component with keyboard shortcuts and modal dialog interface.
 *
 * Provides a searchable interface for navigating through the application's pages,
 * guides, tools, and analysis content. Features keyboard shortcuts (Cmd/Ctrl+K),
 * focus trapping, and accessible dialog patterns.
 *
 * @component
 * @returns {JSX.Element} A search button that opens a modal search dialog
 *
 * @example
 * ```tsx
 * <Search />
 * ```
 *
 * Features:
 * - Keyboard shortcut activation (Cmd/Ctrl+K)
 * - Modal dialog with backdrop
 * - Real-time search filtering
 * - Categorized results with color-coded badges
 * - Keyboard navigation (Tab, Escape)
 * - Focus trap within dialog when open
 * - Click outside to close
 * - Accessible ARIA labels and roles
 * - Automatic focus management
 * - Route navigation on result selection
 * - Internationalized search index
 */
export function Search(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Search index - in a real app, this would come from a search service
  const searchIndex: SearchResult[] = [
    {
      title: t('navigation.live'),
      path: '/live',
      description: t('search.results.live.description'),
      type: 'page',
    },
    {
      title: t('navigation.violenceLoop'),
      path: '/violence-loop',
      description: t('search.results.violenceLoop.description'),
      type: 'tool',
    },
    {
      title: t('navigation.studio'),
      path: '/studio',
      description: t('search.results.studio.description'),
      type: 'page',
    },
    {
      title: t('navigation.shows'),
      path: '/shows',
      description: t('search.results.shows.description'),
      type: 'page',
    },
    {
      title: t('navigation.guide'),
      path: '/guides',
      description: t('search.results.guides.description'),
      type: 'guide',
    },
    {
      title: t('navigation.anatomy'),
      path: '/anatomy',
      description: t('search.results.anatomy.description'),
      type: 'guide',
    },
    {
      title: t('navigation.lab'),
      path: '/lab',
      description: t('search.results.lab.description'),
      type: 'tool',
    },
    {
      title: t('navigation.community'),
      path: '/community',
      description: t('search.results.community.description'),
      type: 'page',
    },
    {
      title: t('breadcrumbs.analysis'),
      path: '/analysis',
      description: t('search.results.analysis.description'),
      type: 'analysis',
    },
    {
      title: t('breadcrumbs.privacy'),
      path: '/privacy',
      description: t('search.results.privacy.description'),
      type: 'page',
    },
    {
      title: t('breadcrumbs.aiPolicy'),
      path: '/ai-policy',
      description: t('search.results.aiPolicy.description'),
      type: 'page',
    },
  ];

  /**
   * Filters the search index based on the query string.
   *
   * Performs case-insensitive matching against both title and description fields.
   * Clears results if the query is empty.
   *
   * @param {string} searchQuery - The search term to filter by
   */
  const handleSearch = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      const filtered = searchIndex.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setResults(filtered);
    },
    [searchIndex]
  );

  /**
   * Opens the search dialog and focuses the search input.
   *
   * Uses a small timeout to ensure the input is rendered before focusing.
   */
  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  /**
   * Closes the search dialog and resets all search state.
   *
   * Clears the query, results, and closes the modal.
   */
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
  }, []);

  /**
   * Navigates to the selected search result and closes the dialog.
   *
   * @param {string} path - The route path to navigate to
   */
  const handleResultClick = useCallback(
    (path: string) => {
      navigate(path);
      handleClose();
    },
    [navigate, handleClose]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd/Ctrl + K to open search
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        handleOpen();
      }
      // Escape to close
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleOpen, handleClose, isOpen]);

  // Trap focus within dialog
  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;

    const dialog = dialogRef.current;
    const focusableElements = dialog.querySelectorAll<HTMLElement>(
      'input, button, [href], [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    };

    dialog.addEventListener('keydown', handleTabKey);
    return () => dialog.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  /**
   * Returns Tailwind CSS classes for styling result type badges.
   *
   * Provides color-coded visual distinction for different content types.
   *
   * @param {SearchResult['type']} type - The result type to get colors for
   * @returns {string} Tailwind CSS class string for the badge
   */
  const getTypeColor = (type: SearchResult['type']): string => {
    switch (type) {
      case 'guide':
        return 'bg-accent-500/20 text-accent-200';
      case 'tool':
        return 'bg-purple-500/20 text-purple-200';
      case 'analysis':
        return 'bg-blue-500/20 text-blue-200';
      default:
        return 'bg-base-700 text-base-300';
    }
  };

  return (
    <>
      {/* Search trigger button */}
      <button
        type="button"
        onClick={handleOpen}
        className="flex-shrink-0 inline-flex items-center gap-1 sm:gap-2 rounded-full border border-base-700 bg-base-900/80 px-2 sm:px-3 py-2 text-sm text-base-300 transition hover:border-accent-500 hover:text-accent-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
        aria-label={t('search.open')}
      >
        <MagnifyingGlassIcon className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">{t('search.placeholder')}</span>
        <kbd className="hidden rounded bg-base-800 px-1.5 py-0.5 text-xs font-mono text-base-400 md:inline">
          ⌘K
        </kbd>
      </button>

      {/* Search dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-base-950/80 p-4 pt-20 backdrop-blur-sm"
          onClick={handleClose}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="search-label"
            className="w-full max-w-2xl rounded-2xl border border-base-800 bg-base-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-base-800 px-4 py-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-base-400" aria-hidden="true" />
              <input
                ref={inputRef}
                type="search"
                id="search-label"
                placeholder={t('search.placeholder')}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
                className="flex-1 bg-transparent text-base text-base-100 placeholder-base-500 outline-none"
                aria-label={t('search.label')}
              />
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full p-1 text-base-400 transition hover:bg-base-800 hover:text-base-100"
                aria-label={t('search.close')}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Search results */}
            <div className="max-h-96 overflow-y-auto p-2">
              {query && results.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-base-400">
                  {t('search.noResults')}
                </div>
              ) : results.length > 0 ? (
                <ul className="space-y-1">
                  {results.map((result) => (
                    <li key={result.path}>
                      <button
                        type="button"
                        onClick={() => handleResultClick(result.path)}
                        className="w-full rounded-lg px-4 py-3 text-left transition hover:bg-base-800 focus-visible:bg-base-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="font-medium text-base-100">{result.title}</div>
                            <div className="mt-1 text-sm text-base-400">{result.description}</div>
                          </div>
                          <span
                            className={clsx(
                              'rounded-full px-2 py-0.5 text-xs font-medium',
                              getTypeColor(result.type)
                            )}
                          >
                            {t(`search.types.${result.type}`)}
                          </span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-8 text-center text-sm text-base-400">
                  {t('search.hint')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
