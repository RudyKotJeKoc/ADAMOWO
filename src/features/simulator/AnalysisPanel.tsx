import { useTranslation } from 'react-i18next';
import type { JSX } from 'react';

import { techniqueCatalog, TechniqueId } from './engine/rules';

type AnalysisPanelProps = {
  techniques: TechniqueId[];
};

export function AnalysisPanel({ techniques }: AnalysisPanelProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <section
      aria-labelledby="analysis-panel-title"
      className="space-y-4 rounded-xl border border-base-800 bg-base-900/70 p-5"
    >
      <header className="space-y-1">
        <h3 id="analysis-panel-title" className="text-lg font-semibold text-base-50">
          {t('sim.analysis.title')}
        </h3>
        <p className="text-sm text-base-200">{t('sim.techniques.detected')}</p>
      </header>
      {techniques.length === 0 ? (
        <p className="text-sm text-base-300">{t('sim.analysis.none')}</p>
      ) : (
        <ul className="space-y-3">
          {techniques.map((technique) => {
            const catalogEntry = techniqueCatalog[technique];
            if (!catalogEntry) return null;
            return (
              <li
                key={technique}
                className="rounded-lg border border-accent-500/40 bg-accent-500/5 p-4"
                aria-live="polite"
              >
                <p className="text-sm font-semibold text-accent-300">
                  {t(catalogEntry.labelKey)}
                </p>
                <p className="mt-2 text-sm text-base-100">
                  {t(catalogEntry.descriptionKey)}
                </p>
                <p className="mt-2 text-xs text-base-300">{t(catalogEntry.tipKey)}</p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
