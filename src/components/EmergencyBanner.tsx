import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

export function EmergencyBanner(): JSX.Element | null {
  const { t } = useTranslation();
  const [isDismissed, setIsDismissed] = useState(() => {
    // Check if user has dismissed the banner in this session
    return sessionStorage.getItem('emergency-banner-dismissed') === 'true';
  });

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('emergency-banner-dismissed', 'true');
  };

  if (isDismissed) {
    return null;
  }

  return (
    <div
      className="relative z-50 border-b border-red-700/50 bg-gradient-to-r from-red-950/95 to-red-900/95"
      role="alert"
      aria-live="polite"
    >
      <div className="container-responsive flex items-center justify-between gap-4 py-3">
        <div className="flex flex-1 items-center gap-3">
          <div
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-500/20"
            aria-hidden="true"
          >
            <svg
              className="h-5 w-5 text-red-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
            <span className="text-sm font-semibold text-red-100">
              {t('emergency.banner.title', 'Potrzebujesz pilnej pomocy?')}
            </span>
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
              <a
                href="tel:800120002"
                className="group flex items-center gap-1.5 font-mono text-red-200 transition hover:text-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2 focus-visible:ring-offset-red-950"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="group-hover:underline">800 120 002</span>
                <span className="hidden text-red-300 sm:inline">
                  ({t('emergency.banner.blueLineShort', 'Niebieska Linia')})
                </span>
              </a>
              <span className="hidden text-red-400 sm:inline" aria-hidden="true">
                •
              </span>
              <a
                href="tel:116123"
                className="group flex items-center gap-1.5 font-mono text-red-200 transition hover:text-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2 focus-visible:ring-offset-red-950"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="group-hover:underline">116 123</span>
                <span className="hidden text-red-300 sm:inline">
                  ({t('emergency.banner.trustPhoneShort', 'Telefon Zaufania')})
                </span>
              </a>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className={clsx(
            'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full',
            'text-red-300 transition hover:bg-red-800/50 hover:text-red-100',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300'
          )}
          aria-label={t('emergency.banner.dismiss', 'Zamknij banner')}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
