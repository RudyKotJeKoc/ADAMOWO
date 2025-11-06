import { useTranslation } from 'react-i18next';
import { LIBERATION_STEPS } from './family-psychology.data';

export function LiberationSteps(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="my-8">
      <h3 className="mb-6 font-display text-2xl font-semibold text-accent-300">
        {t('familyPsychology.liberation.stepsTitle')}
      </h3>
      <div className="space-y-4">
        {LIBERATION_STEPS.map((stepKey, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-xl border border-base-800 bg-gradient-to-r from-base-925/80 to-base-950/80 p-5 transition-all hover:border-accent-500/50 hover:shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-500 to-accent-600 font-bold text-base-950 shadow-lg transition-transform group-hover:scale-110">
                {index + 1}
              </div>
              <div className="flex-1 pt-1">
                <p className="text-base leading-relaxed text-base-100">{t(stepKey)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-lg border-l-4 border-accent-500 bg-base-900/60 p-6">
        <p className="font-semibold text-accent-200">{t('familyPsychology.liberation.reminder')}</p>
      </div>
    </div>
  );
}
