import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { ModuleAnswers, SinModuleData, calculateModuleScore } from './guide.schema';

type Props = {
  module: SinModuleData;
  answers: ModuleAnswers;
};

export const ResultPanel = ({ module, answers }: Props): JSX.Element => {
  const { t } = useTranslation();

  const { total, max } = useMemo(() => calculateModuleScore(module, answers), [module, answers]);

  const interpretation = useMemo(() => {
    if (total >= module.thresholds.high) {
      return 'high';
    }
    if (total >= module.thresholds.medium) {
      return 'medium';
    }
    return 'low';
  }, [module.thresholds.high, module.thresholds.medium, total]);

  const percentage = max > 0 ? Math.round((total / max) * 100) : 0;

  return (
    <section
      aria-live="polite"
      className="mt-6 rounded-xl border border-accent-400/40 bg-base-900/70 p-4 text-base-100 shadow-inner"
    >
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-accent-200">{t('guide.score')}</h4>
          <p className="text-sm text-base-300">
            {t('guide.score.summary', { total, max, percentage })}
          </p>
        </div>
        <span
          className={`inline-flex items-center justify-center rounded-full px-4 py-1 text-sm font-semibold uppercase tracking-wide ${
            interpretation === 'high'
              ? 'bg-red-500/20 text-red-200'
              : interpretation === 'medium'
              ? 'bg-amber-500/20 text-amber-200'
              : 'bg-emerald-500/20 text-emerald-200'
          }`}
        >
          {t(`guide.result.${interpretation}`)}
        </span>
      </header>

      <p className="mt-4 text-base text-base-100">{t(`${module.id}.result.${interpretation}`)}</p>

      <div className="mt-4">
        <h5 className="text-sm font-semibold uppercase tracking-wide text-base-200">
          {t('guide.resources.title')}
        </h5>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-base-200">
          {module.resourcesKeys.map((key) => (
            <li key={key}>{t(key)}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};
