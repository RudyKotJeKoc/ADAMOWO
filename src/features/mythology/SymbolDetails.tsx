import { useTranslation } from 'react-i18next';

import type { MythSymbol } from './mythology.schema';

export function SymbolDetails({ symbol }: { symbol: MythSymbol }): JSX.Element {
  const { t } = useTranslation();

  return (
    <section
      className="space-y-6 rounded-3xl border border-base-900/80 bg-base-950/70 p-8 shadow-[0_0_42px_rgba(9,12,32,0.45)]"
      role="region"
      aria-labelledby={`symbol-${symbol.id}-title`}
    >
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-accent-200">{t('mythology.detailKicker')}</p>
        <h3 id={`symbol-${symbol.id}-title`} className="font-display text-2xl font-semibold text-base-50">
          {t(symbol.titleKey)}
        </h3>
        <p className="max-w-2xl text-sm text-base-200">{t(symbol.subtitleKey)}</p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <article className="space-y-3 rounded-2xl border border-base-850/80 bg-base-925/60 p-6">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-accent-100">{t('mythology.blocks.meaning')}</h4>
          <ul className="space-y-2 text-sm text-base-200">
            {symbol.meaningKeys.map((key) => (
              <li key={key}>{t(key)}</li>
            ))}
          </ul>
        </article>
        <article className="space-y-3 rounded-2xl border border-base-850/80 bg-base-925/60 p-6">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-accent-100">{t('mythology.blocks.when')}</h4>
          <ul className="space-y-2 text-sm text-base-200">
            {symbol.whenKeys.map((key) => (
              <li key={key}>{t(key)}</li>
            ))}
          </ul>
        </article>
        <article className="space-y-3 rounded-2xl border border-accent-500/40 bg-base-925/60 p-6">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-accent-100">{t('mythology.blocks.actions')}</h4>
          <ul className="space-y-2 text-sm text-base-100">
            {symbol.actionKeys.map((key) => (
              <li key={key}>{t(key)}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
