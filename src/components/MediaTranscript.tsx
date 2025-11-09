import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface TranscriptEntry {
  timestamp: string;
  speaker?: string;
  text: string;
}

export interface MediaTranscriptProps {
  entries: TranscriptEntry[];
  searchable?: boolean;
  onTimestampClick?: (timestamp: string) => void;
}

export function MediaTranscript({
  entries,
  searchable = true,
  onTimestampClick
}: MediaTranscriptProps): JSX.Element {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntries = searchable
    ? entries.filter((entry) => {
        const query = searchQuery.toLowerCase();
        return (
          entry.text.toLowerCase().includes(query) ||
          entry.speaker?.toLowerCase().includes(query) ||
          entry.timestamp.toLowerCase().includes(query)
        );
      })
    : entries;

  const handleTimestampClick = (timestamp: string) => {
    if (onTimestampClick) {
      onTimestampClick(timestamp);
    }
  };

  return (
    <div className="rounded-xl border border-base-800/70 bg-base-950/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-accent-200">
          {t('media.transcript.title', 'Transkrypcja')}
        </h3>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="rounded-lg border border-base-600 px-3 py-1 text-xs font-semibold text-base-200 transition hover:border-accent-400 hover:text-accent-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-300"
          aria-expanded={isExpanded}
        >
          {isExpanded
            ? t('media.transcript.hide', 'Ukryj')
            : t('media.transcript.show', 'Pokaż')}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-3">
          {searchable && entries.length > 5 && (
            <div className="mb-3">
              <label htmlFor="transcript-search" className="sr-only">
                {t('media.transcript.search', 'Przeszukaj transkrypcję')}
              </label>
              <input
                id="transcript-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('media.transcript.searchPlaceholder', 'Szukaj w transkrypcji...')}
                className="w-full rounded-lg border border-base-700 bg-base-900/50 px-3 py-2 text-sm text-base-100 placeholder-base-400 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-300/50"
              />
            </div>
          )}

          <div className="max-h-96 space-y-2 overflow-y-auto rounded-lg bg-base-900/50 p-3">
            {filteredEntries.length === 0 ? (
              <p className="text-sm text-base-400">
                {t('media.transcript.noResults', 'Nie znaleziono wyników')}
              </p>
            ) : (
              filteredEntries.map((entry, index) => (
                <div
                  key={index}
                  className="flex gap-3 border-l-2 border-base-700/50 pl-3 text-sm hover:border-accent-400/50"
                >
                  <button
                    type="button"
                    onClick={() => handleTimestampClick(entry.timestamp)}
                    className="flex-shrink-0 font-mono text-xs text-accent-400 hover:text-accent-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-300"
                    disabled={!onTimestampClick}
                    aria-label={t('media.transcript.jumpTo', 'Przejdź do {{time}}', {
                      time: entry.timestamp
                    })}
                  >
                    {entry.timestamp}
                  </button>
                  <div className="flex-1">
                    {entry.speaker && (
                      <span className="font-semibold text-base-200">{entry.speaker}: </span>
                    )}
                    <span className="text-base-300">{entry.text}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {searchable && searchQuery && (
            <p className="text-xs text-base-400">
              {t('media.transcript.resultsCount', 'Znaleziono: {{count}}', {
                count: filteredEntries.length
              })}
            </p>
          )}
        </div>
      )}

      <p className="mt-2 text-xs text-base-400">
        {t(
          'media.transcript.accessibility',
          'Transkrypcja poprawia dostępność dla osób z niepełnosprawnościami słuchu i ułatwia przeszukiwanie treści.'
        )}
      </p>
    </div>
  );
}
