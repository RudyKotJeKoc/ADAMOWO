import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LibraryCard } from './LibraryCard';
import { LibraryDetails } from './LibraryDetails';
import { LIBRARY_ENTRIES } from './library.data';
import type { LibraryEntry } from './library.schema';

type LibrarySectionProps = {
  sectionId?: string;
};

export function LibrarySection({ sectionId }: LibrarySectionProps = {}): JSX.Element {
  const { t } = useTranslation();
  const [selectedEntry, setSelectedEntry] = useState<LibraryEntry>(LIBRARY_ENTRIES[0]);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    detailsRef.current?.focus();
  }, [selectedEntry.id]);

  const cards = useMemo(
    () =>
      LIBRARY_ENTRIES.map((entry) => (
        <LibraryCard
          key={entry.id}
          entry={entry}
          isActive={selectedEntry.id === entry.id}
          onSelect={setSelectedEntry}
        />
      )),
    [selectedEntry.id]
  );

  return (
    <section
      id={sectionId}
      role="region"
      aria-labelledby="library-section-title"
      className="space-y-8 rounded-[2.5rem] border border-base-900 bg-gradient-to-br from-base-950/95 via-base-925/80 to-base-950/95 p-8 shadow-[0_0_64px_rgba(9,12,32,0.6)]"
    >
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-accent-200">{t('library.kicker')}</p>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <h2 id="library-section-title" className="font-display text-3xl font-semibold text-base-50 sm:text-4xl">
            {t('library.title')}
          </h2>
          <p className="max-w-xl text-sm text-base-200">{t('library.intro')}</p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2" aria-label={t('library.gridLabel')}>
          {cards}
        </div>
        <div ref={detailsRef} tabIndex={-1} className="outline-none focus-visible:shadow-focus">
          <LibraryDetails entry={selectedEntry} />
        </div>
      </div>
    </section>
  );
}
