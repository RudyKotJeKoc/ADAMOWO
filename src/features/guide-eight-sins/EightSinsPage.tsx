import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { eightSinsModules } from './guide.data';
import { ModuleAnswers } from './guide.schema';
import { ProgressBar } from './ProgressBar';
import { SinModule } from './SinModule';
import { useGuideProgress } from './useGuideProgress';

export const EightSinsPage = (): JSX.Element => {
  const { t } = useTranslation();
  const modules = eightSinsModules;
  const [activeModuleId, setActiveModuleId] = useState<string | null>(modules[0]?.id ?? null);
  const { answersByModule, totals, moduleProgress, overallProgress, setAnswer, reset } =
    useGuideProgress(modules);

  const hasProgress = moduleProgress.some((progress) => progress.answered > 0);

  useEffect(() => {
    if (!activeModuleId && modules.length > 0) {
      setActiveModuleId(modules[0].id);
    }
  }, [activeModuleId, modules]);

  useEffect(() => {
    if (!modules.length) {
      return;
    }

    if (!hasProgress) {
      return;
    }

    const incomplete = moduleProgress.find((progress) => progress.answered < progress.total);
    if (incomplete) {
      setActiveModuleId(incomplete.moduleId);
    }
  }, [modules, moduleProgress, hasProgress]);

  const activeModule = useMemo(
    () => modules.find((module) => module.id === activeModuleId) ?? modules[0],
    [modules, activeModuleId]
  );

  const activeAnswers: ModuleAnswers = answersByModule[activeModule?.id ?? ''] ?? {};

  const handleReset = () => {
    if (window.confirm(t('guide.reset.confirm'))) {
      reset();
      setActiveModuleId(modules[0]?.id ?? null);
    }
  };

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-base-700 bg-gradient-to-br from-base-900 via-base-950 to-base-900 p-8 text-base-100 shadow-xl">
        <h1 className="text-3xl font-bold text-accent-200 sm:text-4xl">{t('guide.title')}</h1>
        <p className="mt-4 max-w-3xl text-base text-base-200">{t('guide.intro')}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveModuleId(modules[0]?.id ?? null)}
            className="rounded-full bg-accent-500 px-5 py-2 text-sm font-semibold text-base-950 shadow hover:bg-accent-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-200"
          >
            {hasProgress ? t('guide.continue') : t('guide.start')}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-full border border-base-600 px-5 py-2 text-sm font-semibold text-base-200 hover:border-accent-400 hover:text-accent-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
          >
            {t('guide.reset')}
          </button>
        </div>
      </header>

      <ProgressBar
        modules={modules.map((module) => ({ id: module.id, titleKey: module.titleKey }))}
        moduleProgress={moduleProgress}
        overallProgress={overallProgress}
        activeModuleId={activeModule?.id ?? null}
        onSelectModule={(moduleId) => setActiveModuleId(moduleId)}
      />

      {activeModule ? (
        <SinModule
          key={activeModule.id}
          module={activeModule}
          answers={activeAnswers}
          onAnswer={(questionId, value) => setAnswer(activeModule.id, questionId, value)}
        />
      ) : null}

      <section className="rounded-2xl border border-base-700 bg-base-900/60 p-6 text-sm text-base-300">
        <h2 className="text-base font-semibold text-base-200">{t('guide.footer.title')}</h2>
        <p className="mt-2 max-w-3xl">{t('guide.footer.body')}</p>
        <p className="mt-2 text-xs text-base-500">{t('guide.footer.disclaimer')}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <div key={`${module.id}-summary`} className="rounded-xl border border-base-800 bg-base-900/50 p-4">
              <h3 className="text-sm font-semibold text-base-100">{t(module.titleKey)}</h3>
              <p className="mt-1 text-xs text-base-300">
                {t('guide.footer.moduleScore', { score: totals[module.id] ?? 0 })}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
