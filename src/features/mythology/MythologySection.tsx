import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SymbolCard } from './SymbolCard';
import { SymbolDetails } from './SymbolDetails';
import { MYTH_SYMBOLS } from './mythology.data';
import type { MythSymbol } from './mythology.schema';

type MythologySectionProps = {
  sectionId?: string;
};

export function MythologySection({ sectionId }: MythologySectionProps = {}): JSX.Element {
  const { t } = useTranslation();
  const [selectedSymbol, setSelectedSymbol] = useState<MythSymbol>(MYTH_SYMBOLS[0]);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    detailsRef.current?.focus();
  }, [selectedSymbol.id]);

  const cards = useMemo(
    () =>
      MYTH_SYMBOLS.map((symbol) => (
        <SymbolCard
          key={symbol.id}
          symbol={symbol}
          isActive={selectedSymbol.id === symbol.id}
          onSelect={setSelectedSymbol}
        />
      )),
    [selectedSymbol.id]
  );

  return (
    <section
      id={sectionId}
      role="region"
      aria-labelledby="mythology-section-title"
      className="space-y-8 rounded-[2.5rem] border border-base-925 bg-gradient-to-br from-base-950 via-base-925/80 to-base-950 p-8 shadow-[0_0_70px_rgba(8,12,28,0.6)]"
    >
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-accent-200">{t('mythology.kicker')}</p>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <h2 id="mythology-section-title" className="font-display text-3xl font-semibold text-base-50 sm:text-4xl">
            {t('mythology.title')}
          </h2>
          <p className="max-w-xl text-sm text-base-200">{t('mythology.intro')}</p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" aria-label={t('mythology.gridLabel')}>
          {cards}
        </div>
        <div ref={detailsRef} tabIndex={-1} className="outline-none focus-visible:shadow-focus">
          <SymbolDetails symbol={selectedSymbol} />
        </div>
      </div>
    </section>
  );
}
