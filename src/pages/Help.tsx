import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { HelpResources } from '../components/HelpResources';

export default function Help(): ReactElement {
  const { t } = useTranslation();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="space-y-4">
        <h1 className="text-3xl font-bold text-base-50 sm:text-4xl">
          {t('pages.help.title', 'Pomoc i Wsparcie')}
        </h1>
        <p className="max-w-4xl text-lg leading-relaxed text-base-200">
          {t(
            'pages.help.lead',
            'Jeśli doświadczasz przemocy, toksycznej relacji lub potrzebujesz wsparcia emocjonalnego, nie jesteś sam/sama. Poniżej znajdziesz listę zasobów i numerów telefonów, które mogą pomóc.'
          )}
        </p>
      </section>

      {/* Emergency Alert */}
      <div
        className="rounded-2xl border-2 border-red-700/50 bg-gradient-to-br from-red-950/30 to-red-900/20 p-8 shadow-xl"
        role="alert"
      >
        <div className="mb-4 flex items-start gap-4">
          <div
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-500/20 text-red-300"
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
            <h2 className="text-2xl font-bold text-red-200">
              {t('pages.help.emergency.title', 'Bezpośrednie zagrożenie życia lub zdrowia?')}
            </h2>
            <p className="mt-2 text-base text-red-100">
              {t(
                'pages.help.emergency.description',
                'Jeśli znajdujesz się w sytuacji bezpośredniego zagrożenia, natychmiast zadzwoń pod numer alarmowy:'
              )}
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <a
                href="tel:112"
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-lg font-bold text-white shadow-lg transition hover:bg-red-500 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2 focus-visible:ring-offset-red-950"
              >
                <svg
                  className="h-6 w-6"
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
                112
                <span className="text-sm font-normal">
                  ({t('pages.help.emergency.number', 'Numer alarmowy')})
                </span>
              </a>
              <a
                href="tel:997"
                className="inline-flex items-center gap-2 rounded-full bg-red-700 px-6 py-3 text-lg font-bold text-white shadow-lg transition hover:bg-red-600 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2 focus-visible:ring-offset-red-950"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                997
                <span className="text-sm font-normal">
                  ({t('pages.help.emergency.police', 'Policja')})
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Help Resources */}
      <HelpResources />

      {/* Additional Resources */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-base-50">
          {t('pages.help.additionalResources.title', 'Dodatkowe Zasoby')}
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Online Support */}
          <div className="rounded-xl border border-base-800 bg-gradient-to-br from-base-900/50 to-base-850/30 p-6 shadow-lg">
            <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-accent-200">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              {t('pages.help.online.title', 'Pomoc Online')}
            </h3>
            <ul className="space-y-3 text-sm text-base-200">
              <li className="flex items-start gap-2">
                <span className="text-accent-400" aria-hidden="true">
                  ▸
                </span>
                <div>
                  <a
                    href="https://www.niebieskalinia.pl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-accent-300 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-300"
                  >
                    NiebieskaLinia.pl
                  </a>
                  <p className="mt-1 text-base-300">
                    {t(
                      'pages.help.online.blueLine',
                      'Chat online, informacje o przemocy domowej i punktach pomocy'
                    )}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-400" aria-hidden="true">
                  ▸
                </span>
                <div>
                  <a
                    href="https://www.cpk.org.pl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-accent-300 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-300"
                  >
                    Centrum Praw Kobiet
                  </a>
                  <p className="mt-1 text-base-300">
                    {t(
                      'pages.help.online.womenRights',
                      'Bezpłatna pomoc prawna i psychologiczna dla kobiet'
                    )}
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Crisis Centers */}
          <div className="rounded-xl border border-base-800 bg-gradient-to-br from-base-900/50 to-base-850/30 p-6 shadow-lg">
            <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-accent-200">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              {t('pages.help.centers.title', 'Ośrodki Interwencji Kryzysowej')}
            </h3>
            <p className="mb-3 text-sm text-base-300">
              {t(
                'pages.help.centers.description',
                'Ośrodki Interwencji Kryzysowej oferują bezpłatną pomoc psychologiczną, prawną i socjalną. Znajdź najbliższy ośrodek:'
              )}
            </p>
            <a
              href="https://www.gov.pl/web/rodzina/gdzie-szukac-pomocy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-accent-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-300"
            >
              {t('pages.help.centers.findNearest', 'Znajdź najbliższy ośrodek')}
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
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>

          {/* Legal Help */}
          <div className="rounded-xl border border-base-800 bg-gradient-to-br from-base-900/50 to-base-850/30 p-6 shadow-lg">
            <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-accent-200">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                />
              </svg>
              {t('pages.help.legal.title', 'Pomoc Prawna')}
            </h3>
            <ul className="space-y-2 text-sm text-base-200">
              <li className="flex items-start gap-2">
                <span className="text-accent-400" aria-hidden="true">
                  ▸
                </span>
                <span>
                  {t(
                    'pages.help.legal.freeHelp',
                    'Punkty Nieodpłatnej Pomocy Prawnej - bezpłatna pomoc prawna dla wszystkich'
                  )}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-400" aria-hidden="true">
                  ▸
                </span>
                <span>
                  {t(
                    'pages.help.legal.restrainingOrder',
                    'Możliwość uzyskania nakazu zbliżenia się do sprawcy przemocy'
                  )}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-400" aria-hidden="true">
                  ▸
                </span>
                <span>
                  {t('pages.help.legal.divorce', 'Pomoc w sprawach rozwodowych i alimentacyjnych')}
                </span>
              </li>
            </ul>
          </div>

          {/* Shelters */}
          <div className="rounded-xl border border-base-800 bg-gradient-to-br from-base-900/50 to-base-850/30 p-6 shadow-lg">
            <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-accent-200">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              {t('pages.help.shelters.title', 'Domy i Ośrodki Wsparcia')}
            </h3>
            <p className="mb-3 text-sm text-base-300">
              {t(
                'pages.help.shelters.description',
                'Jeśli potrzebujesz bezpiecznego miejsca do mieszkania, skontaktuj się z:'
              )}
            </p>
            <ul className="space-y-2 text-sm text-base-200">
              <li className="flex items-start gap-2">
                <span className="text-accent-400" aria-hidden="true">
                  ▸
                </span>
                <span>
                  {t(
                    'pages.help.shelters.womenShelter',
                    'Domy dla Kobiet - schronienie dla kobiet z dziećmi'
                  )}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-400" aria-hidden="true">
                  ▸
                </span>
                <span>
                  {t(
                    'pages.help.shelters.supportCenter',
                    'Ośrodki Wsparcia - pomoc w odzyskaniu samodzielności'
                  )}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Safety Planning */}
      <section className="rounded-xl border border-amber-700/50 bg-gradient-to-br from-amber-950/30 to-amber-900/20 p-8 shadow-lg">
        <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-amber-200">
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          {t('pages.help.safety.title', 'Plan Bezpieczeństwa')}
        </h2>
        <p className="mb-4 text-base text-amber-100">
          {t(
            'pages.help.safety.intro',
            'Jeśli znajdujesz się w toksycznej lub niebezpiecznej relacji, przygotowanie planu bezpieczeństwa może uratować Ci życie:'
          )}
        </p>
        <ul className="space-y-3 text-sm text-amber-200">
          <li className="flex items-start gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-300">
              1
            </span>
            <span>
              {t(
                'pages.help.safety.documents',
                'Przygotuj kopie ważnych dokumentów (dowód osobisty, dokumenty dzieci, umowy) i przechowuj je w bezpiecznym miejscu'
              )}
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-300">
              2
            </span>
            <span>
              {t(
                'pages.help.safety.money',
                'Odłóż trochę pieniędzy w bezpiecznym miejscu (u przyjaciela, w schowku w pracy)'
              )}
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-300">
              3
            </span>
            <span>
              {t(
                'pages.help.safety.codeWord',
                'Ustal z zaufaną osobą "słowo kodowe", które będzie sygnałem, że potrzebujesz pomocy'
              )}
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-300">
              4
            </span>
            <span>
              {t(
                'pages.help.safety.escapeRoute',
                'Zaplanuj trasę ucieczki i bezpieczne miejsce, do którego możesz się udać'
              )}
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-300">
              5
            </span>
            <span>
              {t(
                'pages.help.safety.evidence',
                'Dokumentuj przemoc (zdjęcia obrażeń, SMS-y, nagrania) - mogą być dowodem w sprawie'
              )}
            </span>
          </li>
        </ul>
      </section>

      {/* Important Note */}
      <div className="rounded-lg border border-base-700 bg-base-900/50 p-6 text-sm text-base-300">
        <p className="font-semibold text-base-200">{t('pages.help.note.title', 'Ważna uwaga:')}</p>
        <p className="mt-2">
          {t(
            'pages.help.note.content',
            'Treści na tej stronie mają charakter informacyjny i edukacyjny. Nie zastępują profesjonalnej pomocy psychologicznej, prawnej ani medycznej. Jeśli potrzebujesz pomocy, skontaktuj się z odpowiednimi służbami lub specjalistami.'
          )}
        </p>
      </div>
    </div>
  );
}
