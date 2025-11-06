import { useTranslation } from 'react-i18next';
import { PATTERN_INDICATORS } from './family-psychology.data';

export function PatternIndicators(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="my-8 space-y-4">
      <h3 className="font-display text-2xl font-semibold text-accent-300">
        {t('familyPsychology.patterns.title')}
      </h3>
      <div className="space-y-4">
        {PATTERN_INDICATORS.map((indicator, index) => (
          <div
            key={index}
            className="case-barbara rounded-xl border border-base-800 bg-gradient-to-r from-base-925/80 to-base-950/80 p-5 transition-all hover:border-accent-500/40 hover:shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-500/20 text-accent-400">
                <span className="font-bold">{index + 1}</span>
              </div>
              <div className="flex-1">
                <h4 className="mb-2 font-semibold text-base-50">{t(indicator.titleKey)}</h4>
                <p className="text-sm leading-relaxed text-base-300">{t(indicator.descriptionKey)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-lg border-l-4 border-accent-500 bg-base-900/60 p-5">
        <p className="text-sm font-semibold italic text-accent-200">
          {t('familyPsychology.patterns.caseLabel')}
        </p>
      </div>
    </div>
  );
}
