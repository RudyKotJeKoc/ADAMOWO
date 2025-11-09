import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface SafeReadingToggleProps {
  children: ReactNode;
  warningText?: string;
  defaultHidden?: boolean;
  className?: string;
}

export function SafeReadingToggle({
  children,
  warningText,
  defaultHidden = true,
  className = ''
}: SafeReadingToggleProps): JSX.Element {
  const { t } = useTranslation();
  const [isHidden, setIsHidden] = useState(defaultHidden);

  return (
    <div className={`relative ${className}`}>
      {isHidden ? (
        <div className="rounded-lg border border-amber-700/50 bg-amber-950/30 p-6 text-center">
          <div
            className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20 text-amber-400"
            aria-hidden="true"
          >
            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-sm font-semibold text-amber-200">
            {t('safeReading.hiddenTitle', 'Zawartość ukryta dla Twojego bezpieczeństwa')}
          </h3>
          <p className="mb-4 text-sm text-amber-300/80">
            {warningText ||
              t(
                'safeReading.hiddenMessage',
                'Ta sekcja zawiera potencjalnie trudne lub traumatyzujące treści. Możesz ją odsłonić, gdy poczujesz się gotowy/a.'
              )}
          </p>
          <button
            type="button"
            onClick={() => setIsHidden(false)}
            className="rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-base-950"
          >
            {t('safeReading.showContent', 'Odsłoń treść')}
          </button>
        </div>
      ) : (
        <>
          <div className="mb-3 flex items-center justify-between rounded-t-lg border border-b-0 border-amber-700/30 bg-amber-950/20 px-4 py-2">
            <span className="text-xs font-medium text-amber-300">
              {t('safeReading.contentVisible', 'Treść odsłonięta')}
            </span>
            <button
              type="button"
              onClick={() => setIsHidden(true)}
              className="rounded px-3 py-1 text-xs font-medium text-amber-300 transition hover:bg-amber-900/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              aria-label={t('safeReading.hideContent', 'Ukryj treść')}
            >
              {t('safeReading.hide', 'Ukryj')}
            </button>
          </div>
          <div className="rounded-b-lg border border-amber-700/30 bg-gradient-to-br from-base-900/50 to-base-800/30 p-4">
            {children}
          </div>
        </>
      )}
    </div>
  );
}
