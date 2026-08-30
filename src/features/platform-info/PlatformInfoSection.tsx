import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

export function PlatformInfoSection(): ReactElement {
  const { t } = useTranslation();

  const features = [
    {
      id: 'podcasts',
      titleKey: 'platformInfo.features.podcasts.title',
      descKey: 'platformInfo.features.podcasts.description',
    },
    {
      id: 'interactive',
      titleKey: 'platformInfo.features.interactive.title',
      descKey: 'platformInfo.features.interactive.description',
    },
    {
      id: 'community',
      titleKey: 'platformInfo.features.community.title',
      descKey: 'platformInfo.features.community.description',
    },
    {
      id: 'multilingual',
      titleKey: 'platformInfo.features.multilingual.title',
      descKey: 'platformInfo.features.multilingual.description',
    },
    {
      id: 'pwa',
      titleKey: 'platformInfo.features.pwa.title',
      descKey: 'platformInfo.features.pwa.description',
    },
  ];

  const tools = [
    {
      id: 'eightSins',
      titleKey: 'platformInfo.tools.eightSins.title',
      descKey: 'platformInfo.tools.eightSins.description',
      link: '/guides',
    },
    {
      id: 'violenceLoop',
      titleKey: 'platformInfo.tools.violenceLoop.title',
      descKey: 'platformInfo.tools.violenceLoop.description',
      link: '/violence-loop',
    },
    {
      id: 'aiLab',
      titleKey: 'platformInfo.tools.aiLab.title',
      descKey: 'platformInfo.tools.aiLab.description',
      link: '/lab',
    },
    {
      id: 'calendar',
      titleKey: 'platformInfo.tools.calendar.title',
      descKey: 'platformInfo.tools.calendar.description',
      link: '/community',
    },
  ];

  const programs = [
    {
      id: 'team',
      titleKey: 'platformInfo.programs.team.title',
      descKey: 'platformInfo.programs.team.description',
    },
    {
      id: 'heart',
      titleKey: 'platformInfo.programs.heart.title',
      descKey: 'platformInfo.programs.heart.description',
    },
    {
      id: 'psychology',
      titleKey: 'platformInfo.programs.psychology.title',
      descKey: 'platformInfo.programs.psychology.description',
    },
    {
      id: 'welcome',
      titleKey: 'platformInfo.programs.welcome.title',
      description:
        'Materiały wprowadzające, przewodniki po serwisie i najważniejsze nagrania z biblioteki Adamowo.',
    },
  ];

  return (
    <section
      aria-labelledby="platform-info-heading"
      className="space-y-16 rounded-3xl border border-base-800/60 bg-gradient-to-br from-base-950/90 to-base-900/80 px-4 py-12 shadow-2xl sm:px-6 lg:px-10"
    >
      <div className="mx-auto w-full max-w-7xl space-y-16">
        {/* Mission Statement */}
        <header className="space-y-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-accent-300">
            {t('platformInfo.label')}
          </p>
          <h2 id="platform-info-heading" className="text-4xl font-bold text-base-50 sm:text-5xl">
            {t('platformInfo.title')}
          </h2>
          <p className="mx-auto max-w-4xl text-lg leading-relaxed text-base-200">
            Adamowo.com łączy uporządkowaną bazę wiedzy, narzędzia interaktywne, analizy i
            bibliotekę audycji. Celem jest precyzyjne wyjaśnianie prawa, procedur oraz mechanizmów
            manipulacji bez mieszania faktów, interpretacji i ocen.
          </p>
        </header>

        {/* Key Features */}
        <div className="space-y-8">
          <h3 className="text-center text-2xl font-semibold text-base-50 sm:text-3xl">
            {t('platformInfo.features.heading')}
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="group rounded-2xl border border-base-800/60 bg-base-950/60 p-6 transition-all hover:border-accent-500/40 hover:bg-base-900/70 hover:shadow-lg hover:shadow-accent-500/10"
              >
                <h4 className="mb-3 text-xl font-semibold text-base-50 group-hover:text-accent-200">
                  {t(feature.titleKey)}
                </h4>
                <p className="text-sm leading-relaxed text-base-300">{t(feature.descKey)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Tools */}
        <div className="space-y-8">
          <h3 className="text-center text-2xl font-semibold text-base-50 sm:text-3xl">
            {t('platformInfo.tools.heading')}
          </h3>
          <p className="mx-auto max-w-3xl text-center text-base-300">
            {t('platformInfo.tools.description')}
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className="rounded-2xl border border-accent-500/30 bg-accent-500/5 p-6 transition-all hover:border-accent-400 hover:bg-accent-500/10"
              >
                <h4 className="mb-2 text-lg font-semibold text-accent-100">{t(tool.titleKey)}</h4>
                <p className="mb-4 text-sm text-base-300">{t(tool.descKey)}</p>
                <a
                  href={tool.link}
                  className="inline-flex items-center gap-2 text-sm font-medium text-accent-200 transition hover:text-accent-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                >
                  {t('platformInfo.tools.explore')}
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Radio Programs */}
        <div className="space-y-8">
          <h3 className="text-center text-2xl font-semibold text-base-50 sm:text-3xl">
            {t('platformInfo.programs.heading')}
          </h3>
          <p className="mx-auto max-w-3xl text-center text-base-300">
            {t('platformInfo.programs.description')}
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {programs.map((program) => (
              <div
                key={program.id}
                className="rounded-2xl border border-base-800/60 bg-base-900/50 p-5 transition hover:border-base-700 hover:bg-base-900/70"
              >
                <h4 className="mb-2 text-base font-semibold text-base-50">{t(program.titleKey)}</h4>
                <p className="text-xs leading-relaxed text-base-400">
                  {'description' in program ? program.description : t(program.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Technology & Accessibility */}
        <div className="rounded-2xl border border-base-800/60 bg-base-950/40 p-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-base-50">
                {t('platformInfo.technology.title')}
              </h3>
              <ul className="space-y-3 text-sm text-base-300">
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-400" />
                  <span>{t('platformInfo.technology.webAudio')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-400" />
                  <span>{t('platformInfo.technology.pwa')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-400" />
                  <span>{t('platformInfo.technology.responsive')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-400" />
                  <span>{t('platformInfo.technology.offline')}</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-base-50">
                {t('platformInfo.accessibility.title')}
              </h3>
              <ul className="space-y-3 text-sm text-base-300">
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-400" />
                  <span>{t('platformInfo.accessibility.wcag')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-400" />
                  <span>{t('platformInfo.accessibility.keyboard')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-400" />
                  <span>{t('platformInfo.accessibility.screenReader')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-400" />
                  <span>{t('platformInfo.accessibility.reducedMotion')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="rounded-2xl border border-accent-500/40 bg-gradient-to-br from-accent-500/10 to-accent-600/5 p-8 text-center">
          <h3 className="mb-4 text-2xl font-semibold text-accent-100">
            {t('platformInfo.cta.title')}
          </h3>
          <p className="mx-auto mb-6 max-w-2xl text-base-300">
            Zacznij od katalogu pojęć albo przejdź do nagranych audycji i poradników.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/shows"
              className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-6 py-3 font-semibold text-base-950 transition hover:bg-accent-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300"
            >
              Przeglądaj audycje
            </a>
            <a
              href="/guides"
              className="inline-flex items-center gap-2 rounded-full border border-accent-500 bg-transparent px-6 py-3 font-semibold text-accent-200 transition hover:bg-accent-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300"
            >
              {t('platformInfo.cta.exploreGuides')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
