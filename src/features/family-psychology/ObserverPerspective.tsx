import { useTranslation } from 'react-i18next';

export function ObserverPerspective(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="my-8 space-y-6">
      <div className="rounded-2xl border border-accent-500/30 bg-base-950/60 p-8">
        <h3 className="mb-6 font-display text-2xl font-semibold text-accent-300">
          {t('familyPsychology.observer.title')}
        </h3>
        <div className="space-y-4 text-base-200">
          <p className="leading-relaxed">{t('familyPsychology.observer.description')}</p>
          <p className="leading-relaxed">{t('familyPsychology.observer.mechanism')}</p>
        </div>
      </div>

      <div className="rounded-xl border-2 border-accent-500/60 bg-gradient-to-br from-accent-950/40 to-base-950/60 p-8 shadow-lg">
        <div className="mb-4 flex items-center gap-3">
          <svg className="h-8 w-8 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <h4 className="font-display text-xl font-semibold text-accent-200">
            {t('familyPsychology.observer.mechanismTitle')}
          </h4>
        </div>
        <p className="text-center text-lg font-semibold italic text-accent-100">
          {t('familyPsychology.observer.truth')}
        </p>
      </div>

      <div className="rounded-xl border border-base-800 bg-base-925/60 p-6">
        <div className="mb-4 flex items-start gap-3">
          <span className="text-2xl" aria-hidden="true">
            👁️
          </span>
          <div>
            <h4 className="mb-2 font-display text-lg font-semibold text-base-50">
              {t('familyPsychology.observer.symbolicTitle')}
            </h4>
            <p className="text-sm leading-relaxed text-base-300">{t('familyPsychology.observer.symbolicDescription')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
