import { useTranslation } from 'react-i18next';

import { ModuleProgress } from './useGuideProgress';

const formatPercent = (value: number) => Math.round(value * 100);

type Props = {
  modules: { id: string; titleKey: string }[];
  moduleProgress: ModuleProgress[];
  overallProgress: number;
  activeModuleId: string | null;
  onSelectModule: (moduleId: string) => void;
};

export const ProgressBar = ({
  modules,
  moduleProgress,
  overallProgress,
  activeModuleId,
  onSelectModule
}: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <section className="rounded-2xl border border-base-700 bg-base-900/70 p-4 text-base-100 shadow-lg">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-base-50">{t('guide.progress')}</h2>
          <p className="text-sm text-base-300">
            {t('guide.progress.summary', { percentage: formatPercent(overallProgress) })}
          </p>
        </div>
        <div className="flex w-full max-w-sm items-center gap-3">
          <div className="h-2 flex-1 rounded-full bg-base-700">
            <div
              className="h-full rounded-full bg-accent-500 transition-all"
              style={{ width: `${Math.min(100, formatPercent(overallProgress))}%` }}
              aria-hidden="true"
            />
          </div>
          <span className="text-sm font-semibold text-accent-200">
            {formatPercent(overallProgress)}%
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {modules.map((module) => {
          const progress = moduleProgress.find((item) => item.moduleId === module.id);
          const percent = progress ? formatPercent(progress.completion) : 0;
          const isActive = activeModuleId === module.id;

          return (
            <button
              key={module.id}
              type="button"
              onClick={() => onSelectModule(module.id)}
              className={`flex flex-col rounded-xl border px-3 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 ${
                isActive ? 'border-accent-300 bg-base-800/70' : 'border-base-700 bg-base-900/60 hover:border-accent-400'
              }`}
              aria-pressed={isActive}
              aria-current={isActive ? 'true' : undefined}
            >
              <span className="text-sm font-semibold text-base-50">{t(module.titleKey)}</span>
              <span className="mt-1 text-xs text-base-300">
                {t('guide.progress.module', { answered: progress?.answered ?? 0, total: progress?.total ?? 0 })}
              </span>
              <div className="mt-2 h-1.5 rounded-full bg-base-700">
                <div
                  className="h-full rounded-full bg-accent-500"
                  style={{ width: `${percent}%` }}
                  aria-hidden="true"
                />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
