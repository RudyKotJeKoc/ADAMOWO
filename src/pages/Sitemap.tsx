import { MapIcon } from '@heroicons/react/24/outline';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface SitemapSection {
  titleKey: string;
  descriptionKey: string;
  links: Array<{ labelKey: string; to: string }>;
}

export default function Sitemap(): JSX.Element {
  const { t } = useTranslation();

  const sections: SitemapSection[] = [
    {
      titleKey: 'pages.sitemap.sections.audioVideo.title',
      descriptionKey: 'pages.sitemap.sections.audioVideo.description',
      links: [
        { labelKey: 'pages.sitemap.links.live', to: '/live' },
        { labelKey: 'pages.sitemap.links.mediaHub', to: '/media' },
        { labelKey: 'pages.sitemap.links.lab', to: '/lab' },
      ],
    },
    {
      titleKey: 'pages.sitemap.sections.analysis.title',
      descriptionKey: 'pages.sitemap.sections.analysis.description',
      links: [
        { labelKey: 'pages.sitemap.links.analysis', to: '/analysis' },
        { labelKey: 'pages.sitemap.links.analizy', to: '/analizy' },
      ],
    },
    {
      titleKey: 'pages.sitemap.sections.research.title',
      descriptionKey: 'pages.sitemap.sections.research.description',
      links: [{ labelKey: 'pages.sitemap.links.studio', to: '/studio' }],
    },
    {
      titleKey: 'pages.sitemap.sections.support.title',
      descriptionKey: 'pages.sitemap.sections.support.description',
      links: [
        { labelKey: 'pages.sitemap.links.guides', to: '/guides' },
        { labelKey: 'pages.sitemap.links.help', to: '/pomoc' },
        { labelKey: 'pages.sitemap.links.community', to: '/community' },
      ],
    },
    {
      titleKey: 'pages.sitemap.sections.about.title',
      descriptionKey: 'pages.sitemap.sections.about.description',
      links: [
        { labelKey: 'pages.sitemap.links.about', to: '#about-team' },
        { labelKey: 'pages.sitemap.links.contact', to: '#contact' },
      ],
    },
  ];

  return (
    <section className="space-y-12">
      <header className="space-y-3">
        <p className="inline-flex items-center gap-2 rounded-full bg-accent-500/10 px-3 py-1 text-sm font-semibold text-accent-200">
          <MapIcon className="h-4 w-4" aria-hidden="true" />
          {t('pages.sitemap.badge', 'Mapa strony i kontakt')}
        </p>
        <h1 className="text-3xl font-bold text-base-50 sm:text-4xl">
          {t('pages.sitemap.title', 'Znajdź wszystko w jednym miejscu')}
        </h1>
        <p className="max-w-3xl text-lg leading-relaxed text-base-200">
          {t(
            'pages.sitemap.lead',
            'Szybki dostęp do wszystkich kluczowych sekcji: audycji, analiz, studia, narzędzi, laboratoriów AI oraz kontaktu z zespołem.'
          )}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {sections.map((section) => (
          <article
            key={section.titleKey}
            className="space-y-4 rounded-2xl border border-base-800 bg-base-900/70 p-6 shadow-lg shadow-indigo-950/30"
          >
            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-wide text-accent-200">
                {t(section.titleKey)}
              </p>
              <p className="text-base text-base-300">{t(section.descriptionKey)}</p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2" role="list">
              {section.links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className="group block rounded-xl border border-base-800/60 bg-base-850 px-4 py-3 text-base-100 transition hover:border-accent-400 hover:bg-base-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400"
                  >
                    <span className="text-base font-semibold">{t(link.labelKey)}</span>
                    <p className="mt-1 text-sm text-base-300 group-hover:text-base-100">
                      {t('pages.sitemap.cta', 'Przejdź do sekcji')}
                    </p>
                  </NavLink>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div
        id="about-team"
        className="space-y-4 rounded-2xl border border-base-800 bg-base-900/70 p-6 shadow-lg shadow-indigo-950/30"
      >
        <h2 className="text-2xl font-semibold text-base-50">
          {t('pages.sitemap.about.title', 'O nas')}
        </h2>
        <p className="text-base text-base-300">
          {t(
            'pages.sitemap.about.copy',
            'Radio Adamowo to interdyscyplinarny zespół: psycholożka specjalizująca się w przemocy emocjonalnej, dziennikarz śledczy oraz inżynier danych rozwijający Laboratorium AI.'
          )}
        </p>
        <ul className="grid gap-3 sm:grid-cols-3" role="list">
          <li className="rounded-xl border border-base-800/60 bg-base-850 px-4 py-3 text-base-100">
            <p className="text-sm uppercase tracking-wide text-accent-200">
              {t('pages.sitemap.about.roles.psychologist', 'Psycholożka')}
            </p>
            <p className="text-base font-semibold">
              {t('pages.sitemap.about.names.psychologist', 'dr Anna Kowalska')}
            </p>
            <p className="text-sm text-base-400">
              {t(
                'pages.sitemap.about.focus.psychologist',
                'profilaktyka przemocy, superwizja treści'
              )}
            </p>
          </li>
          <li className="rounded-xl border border-base-800/60 bg-base-850 px-4 py-3 text-base-100">
            <p className="text-sm uppercase tracking-wide text-accent-200">
              {t('pages.sitemap.about.roles.reporter', 'Dziennikarz')}
            </p>
            <p className="text-base font-semibold">
              {t('pages.sitemap.about.names.reporter', 'Jan Nowicki')}
            </p>
            <p className="text-sm text-base-400">
              {t('pages.sitemap.about.focus.reporter', 'reportaże, weryfikacja źródeł')}
            </p>
          </li>
          <li className="rounded-xl border border-base-800/60 bg-base-850 px-4 py-3 text-base-100">
            <p className="text-sm uppercase tracking-wide text-accent-200">
              {t('pages.sitemap.about.roles.engineer', 'Inżynier danych')}
            </p>
            <p className="text-base font-semibold">
              {t('pages.sitemap.about.names.engineer', 'Ewa Zielińska')}
            </p>
            <p className="text-sm text-base-400">
              {t('pages.sitemap.about.focus.engineer', 'AI Lab, automaty transkrypcji')}
            </p>
          </li>
        </ul>
      </div>

      <div
        id="contact"
        className="space-y-3 rounded-2xl border border-base-800 bg-base-900/70 p-6 shadow-lg shadow-indigo-950/30"
      >
        <h2 className="text-2xl font-semibold text-base-50">
          {t('pages.sitemap.contact.title', 'Kontakt')}
        </h2>
        <p className="text-base text-base-300">
          {t('pages.sitemap.contact.copy', 'Masz pytania lub chcesz współpracować? Napisz do nas:')}
        </p>
        <div className="flex flex-col gap-2 text-base-100">
          <a
            className="w-fit text-accent-200 underline hover:text-accent-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400"
            href="mailto:kontakt@radioadamowo.pl"
          >
            kontakt@radioadamowo.pl
          </a>
          <a
            className="w-fit text-accent-200 underline hover:text-accent-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400"
            href="tel:+48700111222"
          >
            +48 700 111 222
          </a>
        </div>
      </div>
    </section>
  );
}
