import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const CONSENT_STORAGE_KEY = 'simulator-ethics-consent';
const CONSENT_EXPIRY_DAYS = 90; // Re-show consent every 90 days

interface EthicsConsentProps {
  onConsent: () => void;
}

export function EthicsConsent({ onConsent }: EthicsConsentProps): JSX.Element | null {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [hasReadEthics, setHasReadEthics] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        const expiryDate = new Date(data.timestamp);
        expiryDate.setDate(expiryDate.getDate() + CONSENT_EXPIRY_DAYS);

        if (new Date() < expiryDate) {
          onConsent();
          return;
        }
      } catch {
        // Invalid data, show modal
      }
    }

    setShowModal(true);
  }, [onConsent]);

  const handleAccept = () => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({
        timestamp: new Date().toISOString(),
        accepted: true
      })
    );

    setShowModal(false);
    onConsent();
  };

  const handleDecline = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (showModal && typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }
    };
  }, [showModal]);

  if (!showModal) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-base-950/95 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ethics-consent-title"
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-amber-700/50 bg-gradient-to-br from-base-900 to-base-800 shadow-2xl">
        <div className="sticky top-0 z-10 border-b border-amber-700/50 bg-gradient-to-r from-amber-900/30 to-red-900/30 p-6 backdrop-blur">
          <div className="flex items-start gap-4">
            <div
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400"
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
            <div>
              <h2 id="ethics-consent-title" className="text-xl font-bold text-amber-200">
                {t('sim.ethics.title', 'Zasady etyczne i zgoda użytkownika')}
              </h2>
              <p className="mt-1 text-sm text-amber-300/80">
                {t(
                  'sim.ethics.subtitle',
                  'Przed użyciem symulatora, prosimy o zapoznanie się z poniższymi informacjami'
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-6">
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-base-100">
              <span
                className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-xs font-bold text-red-400"
                aria-hidden="true"
              >
                !
              </span>
              {t('sim.ethics.limitations.title', 'Ograniczenia symulatora')}
            </h3>
            <ul className="space-y-2 text-sm text-base-200">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-red-400" aria-hidden="true">
                  •
                </span>
                <span>
                  {t(
                    'sim.ethics.limitations.notReal',
                    'Symulator używa prostych reguł i wzorców, nie jest zaawansowanym AI'
                  )}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-red-400" aria-hidden="true">
                  •
                </span>
                <span>
                  {t(
                    'sim.ethics.limitations.educational',
                    'Narzędzie ma charakter wyłącznie edukacyjny i nie zastępuje terapii'
                  )}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-red-400" aria-hidden="true">
                  •
                </span>
                <span>
                  {t(
                    'sim.ethics.limitations.simplified',
                    'Odpowiedzi są uproszczone i nie oddają złożoności prawdziwych sytuacji'
                  )}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-red-400" aria-hidden="true">
                  •
                </span>
                <span>
                  {t(
                    'sim.ethics.limitations.offline',
                    'Symulator działa offline - Twoje dane NIE są wysyłane do żadnego serwera'
                  )}
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-base-100">
              <span
                className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-400"
                aria-hidden="true"
              >
                ⚠
              </span>
              {t('sim.ethics.retrauma.title', 'Ryzyko retraumatyzacji')}
            </h3>
            <div className="space-y-2 text-sm text-base-200">
              <p>
                {t(
                  'sim.ethics.retrauma.warning',
                  'Symulowane rozmowy mogą przywoływać trudne wspomnienia i emocje związane z realnymi doświadczeniami manipulacji.'
                )}
              </p>
              <div className="rounded-lg border border-amber-700/30 bg-amber-950/20 p-3">
                <p className="font-semibold text-amber-200">
                  {t('sim.ethics.retrauma.stop', 'Zatrzymaj się, jeśli:')}
                </p>
                <ul className="mt-2 space-y-1">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400" aria-hidden="true">
                      •
                    </span>
                    <span>
                      {t('sim.ethics.retrauma.feel', 'Czujesz się przytłoczony/a lub zdenerwowany/a')}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400" aria-hidden="true">
                      •
                    </span>
                    <span>
                      {t(
                        'sim.ethics.retrauma.memories',
                        'Pojawiają się nieprzyjemne flashbacki lub wspomnienia'
                      )}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400" aria-hidden="true">
                      •
                    </span>
                    <span>
                      {t(
                        'sim.ethics.retrauma.physical',
                        'Odczuwasz fizyczne symptomy stresu (przyspieszone bicie serca, tremor)'
                      )}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-base-100">
              <span
                className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-bold text-cyan-400"
                aria-hidden="true"
              >
                ℹ
              </span>
              {t('sim.ethics.purpose.title', 'Cel narzędzia')}
            </h3>
            <p className="text-sm text-base-200">
              {t(
                'sim.ethics.purpose.description',
                'Symulator pomaga rozpoznawać typowe techniki manipulacji w bezpiecznym, kontrolowanym środowisku. Może być pomocny jako narzędzie treningowe, ale nie powinien być używany jako forma terapii samodzielnej.'
              )}
            </p>
          </section>

          <div className="rounded-lg border border-cyan-700/30 bg-cyan-950/20 p-4">
            <h4 className="mb-2 text-sm font-semibold text-cyan-200">
              {t('sim.ethics.help.title', 'Profesjonalna pomoc')}
            </h4>
            <p className="mb-2 text-xs text-cyan-300/80">
              {t(
                'sim.ethics.help.message',
                'Jeśli przeżywasz trudną sytuację, skontaktuj się z profesjonalistą:'
              )}
            </p>
            <div className="space-y-1 text-xs">
              <p className="text-cyan-200">
                <strong>Niebieska Linia:</strong>{' '}
                <a
                  href="tel:800120002"
                  className="underline hover:text-cyan-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                >
                  800 120 002
                </a>
              </p>
              <p className="text-cyan-200">
                <strong>Telefon Zaufania:</strong>{' '}
                <a
                  href="tel:116123"
                  className="underline hover:text-cyan-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                >
                  116 123
                </a>
              </p>
            </div>
          </div>

          <div className="space-y-3 rounded-lg border border-base-700 bg-base-900/50 p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={hasReadEthics}
                onChange={(e) => setHasReadEthics(e.target.checked)}
                className="mt-1 h-4 w-4 cursor-pointer rounded border-base-600 bg-base-800 text-accent-500 focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-base-900"
              />
              <span className="text-sm text-base-200">
                {t(
                  'sim.ethics.consent.checkbox',
                  'Przeczytałem/am i rozumiem powyższe informacje. Jestem świadomy/a ograniczeń narzędzia i ryzyka retraumatyzacji.'
                )}
              </span>
            </label>
          </div>
        </div>

        <div className="sticky bottom-0 flex gap-3 border-t border-base-700 bg-base-900/95 p-6 backdrop-blur">
          <button
            type="button"
            onClick={handleDecline}
            className="flex-1 rounded-lg border border-base-600 px-5 py-3 text-sm font-semibold text-base-200 transition hover:border-base-500 hover:bg-base-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-base-400"
          >
            {t('sim.ethics.consent.decline', 'Wróć')}
          </button>
          <button
            type="button"
            onClick={handleAccept}
            disabled={!hasReadEthics}
            className="flex-1 rounded-lg bg-accent-500 px-5 py-3 text-sm font-semibold text-base-950 transition hover:bg-accent-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t('sim.ethics.consent.accept', 'Rozumiem i akceptuję')}
          </button>
        </div>
      </div>
    </div>
  );
}
