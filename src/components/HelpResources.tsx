import { useTranslation } from 'react-i18next';

export interface HelpResourcesProps {
  compact?: boolean;
  className?: string;
}

export function HelpResources({ compact = false, className = '' }: HelpResourcesProps): JSX.Element {
  const { t } = useTranslation();

  if (compact) {
    return (
      <div
        className={`rounded-lg border border-cyan-700/50 bg-cyan-950/20 p-3 ${className}`}
        role="complementary"
        aria-label={t('helpResources.title', 'Zasoby pomocowe')}
      >
        <h3 className="mb-2 text-sm font-semibold text-cyan-300">
          {t('helpResources.needHelp', 'Potrzebujesz pomocy?')}
        </h3>
        <div className="space-y-1 text-xs text-cyan-200">
          <p>
            <strong>{t('helpResources.hotline', 'Niebieska Linia')}:</strong>{' '}
            <a
              href="tel:800120002"
              className="underline hover:text-cyan-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              800 120 002
            </a>
          </p>
          <p>
            <strong>{t('helpResources.trustPhone', 'Telefon Zaufania')}:</strong>{' '}
            <a
              href="tel:116123"
              className="underline hover:text-cyan-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              116 123
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border border-cyan-700/50 bg-gradient-to-br from-cyan-950/30 to-cyan-900/20 p-6 shadow-lg ${className}`}
      role="complementary"
      aria-label={t('helpResources.title', 'Zasoby pomocowe')}
    >
      <div className="mb-4 flex items-start gap-3">
        <div
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300"
          aria-hidden="true"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-cyan-200">
            {t('helpResources.title', 'Zasoby pomocowe')}
          </h3>
          <p className="mt-1 text-sm text-cyan-300/80">
            {t(
              'helpResources.subtitle',
              'Jeśli przeżywasz trudną sytuację, nie jesteś sam/sama. Istnieje profesjonalna pomoc.'
            )}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-cyan-700/30 bg-cyan-950/40 p-4">
          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-cyan-200">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            {t('helpResources.emergencyHotlines', 'Linie telefoniczne')}
          </h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-baseline gap-2">
              <span className="text-cyan-400">•</span>
              <div>
                <strong className="text-cyan-200">
                  {t('helpResources.hotline', 'Niebieska Linia')}
                </strong>
                <span className="text-cyan-300/80">
                  {' '}
                  — {t('helpResources.hotlineDesc', 'pomoc w kryzysie, czynna 24/7')}:{' '}
                </span>
                <a
                  href="tel:800120002"
                  className="font-mono text-cyan-200 underline hover:text-cyan-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                >
                  800 120 002
                </a>
              </div>
            </li>
            <li className="flex items-baseline gap-2">
              <span className="text-cyan-400">•</span>
              <div>
                <strong className="text-cyan-200">
                  {t('helpResources.trustPhone', 'Telefon Zaufania')}
                </strong>
                <span className="text-cyan-300/80">
                  {' '}
                  — {t('helpResources.trustPhoneDesc', 'wsparcie emocjonalne')}:{' '}
                </span>
                <a
                  href="tel:116123"
                  className="font-mono text-cyan-200 underline hover:text-cyan-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                >
                  116 123
                </a>
              </div>
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-cyan-700/30 bg-cyan-950/40 p-4">
          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-cyan-200">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            {t('helpResources.professionalHelp', 'Pomoc specjalistyczna')}
          </h4>
          <ul className="space-y-1 text-sm text-cyan-300/80">
            <li className="flex items-baseline gap-2">
              <span className="text-cyan-400">•</span>
              <span>
                {t(
                  'helpResources.therapist',
                  'Skonsultuj się z psychologiem lub terapeutą specjalizującym się w traumie'
                )}
              </span>
            </li>
            <li className="flex items-baseline gap-2">
              <span className="text-cyan-400">•</span>
              <span>
                {t(
                  'helpResources.legal',
                  'Skorzystaj z bezpłatnej pomocy prawnej w Punktach Nieodpłatnej Pomocy Prawnej'
                )}
              </span>
            </li>
            <li className="flex items-baseline gap-2">
              <span className="text-cyan-400">•</span>
              <span>
                {t('helpResources.support', 'Dołącz do grup wsparcia dla osób w podobnej sytuacji')}
              </span>
            </li>
          </ul>
        </div>

        <div className="rounded-lg bg-cyan-900/20 p-3 text-xs text-cyan-300/70">
          <p>
            {t(
              'helpResources.disclaimer',
              'Materiały na tej stronie mają charakter edukacyjny i nie zastępują profesjonalnej pomocy psychologicznej ani prawnej.'
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
