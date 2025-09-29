import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { ModuleAnswers, SinModuleData } from './guide.schema';
import { ResultPanel } from './ResultPanel';
import { SinQuestion } from './SinQuestion';

export type SinModuleProps = {
  module: SinModuleData;
  answers: ModuleAnswers;
  onAnswer: (questionId: string, value: unknown) => void;
};

export const SinModule = ({ module, answers, onAnswer }: SinModuleProps): JSX.Element => {
  const { t } = useTranslation();

  const examples = useMemo(() => module.examplesKeys.map((key) => t(key)), [module.examplesKeys, t]);

  return (
    <section
      role="region"
      aria-labelledby={`${module.id}-title`}
      className="mt-6 rounded-2xl border border-base-700 bg-base-950/80 p-6 shadow-xl"
    >
      <header id={`${module.id}-title`} className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-base-50">{t(module.titleKey)}</h2>
          <p className="mt-2 text-base text-base-200">{t(module.descriptionKey)}</p>
        </div>
      </header>

      <div className="mt-4 rounded-xl border border-base-800 bg-base-900/60 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-base-300">
          {t('guide.examples.title')}
        </h3>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-base-200">
          {examples.map((example, index) => (
            <li key={module.examplesKeys[index]}>{example}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6 space-y-4">
        {module.questions.map((question) => (
          <SinQuestion
            key={question.id}
            moduleId={module.id}
            question={question}
            value={answers[question.id]}
            onChange={(value) => onAnswer(question.id, value)}
          />
        ))}
      </div>

      <ResultPanel module={module} answers={answers} />
    </section>
  );
};
