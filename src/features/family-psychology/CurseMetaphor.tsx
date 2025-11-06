import { useTranslation } from 'react-i18next';

export function CurseMetaphor(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="my-8 space-y-6">
      <div className="rounded-2xl border border-accent-500/30 bg-gradient-to-br from-base-950/95 via-base-925/80 to-base-950/95 p-8 shadow-[0_0_48px_rgba(255,107,53,0.15)]">
        <h3 className="mb-6 font-display text-2xl font-semibold text-accent-300">
          {t('familyPsychology.curse.metaphorTitle')}
        </h3>
        <div className="space-y-4 text-base-200">
          <p className="leading-relaxed">{t('familyPsychology.curse.explanation')}</p>
          <p className="leading-relaxed">{t('familyPsychology.curse.primaryWound')}</p>
        </div>
        <div className="mt-6 rounded-xl border-l-4 border-accent-500 bg-base-900/60 p-6">
          <p className="font-semibold italic text-accent-200">{t('familyPsychology.curse.breakingPoint')}</p>
        </div>
      </div>

      <div className="rounded-xl border border-base-800 bg-base-925/60 p-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">
            💭
          </span>
          <h4 className="font-display text-lg font-semibold text-accent-300">
            {t('familyPsychology.curse.quoteTitle')}
          </h4>
        </div>
        <blockquote className="border-l-4 border-accent-500/50 pl-4 italic text-base-200">
          "{t('familyPsychology.curse.quote')}"
        </blockquote>
        <p className="mt-3 text-right text-xs text-base-400">{t('familyPsychology.curse.quoteAttribution')}</p>
      </div>
    </div>
  );
}
