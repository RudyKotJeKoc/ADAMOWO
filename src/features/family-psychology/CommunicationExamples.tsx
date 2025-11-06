import { useTranslation } from 'react-i18next';
import { COMMUNICATION_EXAMPLES } from './family-psychology.data';

const STYLE_CLASSES = {
  impulsive: 'border-red-500/40 bg-red-950/20',
  assertive: 'border-yellow-500/40 bg-yellow-950/20',
  conscious: 'border-green-500/40 bg-green-950/20'
};

const ICON_MAP = {
  impulsive: '⚡',
  assertive: '🛡️',
  conscious: '🧠'
};

export function CommunicationExamples(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="my-8 rounded-2xl border border-accent-500/30 bg-base-950/60 p-8">
      <h3 className="mb-6 text-center font-display text-2xl font-semibold text-accent-300">
        {t('familyPsychology.communication.title')}
      </h3>
      <div className="grid gap-6 md:grid-cols-3">
        {COMMUNICATION_EXAMPLES.map((example, index) => {
          const styleKey = ['impulsive', 'assertive', 'conscious'][index] as keyof typeof STYLE_CLASSES;
          return (
            <div
              key={index}
              className={`rounded-xl border p-6 transition-all hover:shadow-lg ${STYLE_CLASSES[styleKey]}`}
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="text-2xl" aria-hidden="true">
                  {ICON_MAP[styleKey]}
                </span>
                <h4 className="font-display text-lg font-semibold text-base-50">{t(example.typeKey)}</h4>
              </div>
              <p className="mb-4 text-sm text-base-200">{t(example.descriptionKey)}</p>
              <div className="rounded-lg bg-base-950/60 p-4">
                <p className="text-xs italic text-base-300">{t(example.exampleKey)}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-8 rounded-lg border border-base-800 bg-base-900/40 p-4 text-center">
        <p className="text-sm text-base-200">{t('familyPsychology.communication.note')}</p>
      </div>
    </div>
  );
}
