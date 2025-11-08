
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { EightSinsPage } from '../features/guide-eight-sins/EightSinsPage';
import { LibrarySection } from '../features/library/LibrarySection';
import { MythologySection } from '../features/mythology/MythologySection';
import { FamilyPsychologySection } from '../features/family-psychology/FamilyPsychologySection';
import { ExploreMore, type ExploreMoreLink } from '../components/ExploreMore';

export default function Guides(): JSX.Element {
  const { t } = useTranslation();

  const exploreTools: ExploreMoreLink[] = [
    {
      to: '/violence-loop',
      labelKey: 'exploreMore.suggestions.fromGuides.violenceLoop',
      descriptionKey: 'exploreMore.suggestions.fromGuides.violenceLoopDesc'
    },
    {
      to: '/community',
      labelKey: 'exploreMore.suggestions.fromTools.community',
      descriptionKey: 'exploreMore.suggestions.fromTools.communityDesc'
    },
    {
      to: '/analysis',
      labelKey: 'exploreMore.suggestions.fromTools.analysis',
      descriptionKey: 'exploreMore.suggestions.fromTools.analysisDesc',
      badge: '100+ godz'
    },
    {
      to: '/studio',
      labelKey: 'exploreMore.suggestions.fromTools.studio',
      descriptionKey: 'exploreMore.suggestions.fromTools.studioDesc'
    }
  ];

  return (
    <section className="space-y-12">
      <header className="space-y-6">
        <div className="space-y-4">
          <h1 className="font-display text-4xl font-semibold text-base-50 sm:text-5xl">
            {t('pages.guides.title')}
          </h1>
          <p className="max-w-3xl text-base text-base-200">{t('pages.guides.lede')}</p>
        </div>
        <nav aria-label={t('pages.guides.anchorNav')} className="flex flex-wrap gap-3">
          <a
            href="#library"
            className="inline-flex items-center gap-2 rounded-full border border-accent-500/50 bg-base-925/60 px-4 py-2 text-sm font-semibold text-accent-100 transition motion-safe:hover:border-accent-400 motion-safe:hover:text-accent-50 focus-visible:shadow-focus"
          >
            <span className="text-base-300">→</span>
            <span>{t('pages.guides.links.library')}</span>
          </a>
          <a
            href="#mythology"
            className="inline-flex items-center gap-2 rounded-full border border-accent-500/50 bg-base-925/60 px-4 py-2 text-sm font-semibold text-accent-100 transition motion-safe:hover:border-accent-400 motion-safe:hover:text-accent-50 focus-visible:shadow-focus"
          >
            <span className="text-base-300">→</span>
            <span>{t('pages.guides.links.mythology')}</span>
          </a>
          <a
            href="#family-psychology"
            className="inline-flex items-center gap-2 rounded-full border border-accent-500/50 bg-base-925/60 px-4 py-2 text-sm font-semibold text-accent-100 transition motion-safe:hover:border-accent-400 motion-safe:hover:text-accent-50 focus-visible:shadow-focus"
          >
            <span className="text-base-300">→</span>
            <span>{t('pages.guides.links.familyPsychology')}</span>
          </a>
        </nav>
      </header>

      <div className="space-y-12">
        <LibrarySection sectionId="library" />
        <MythologySection sectionId="mythology" />
        <FamilyPsychologySection sectionId="family-psychology" />
        <EightSinsPage />

        <ExploreMore title={t('exploreMore.title')} links={exploreTools} compact />

        <div className="rounded-2xl border border-base-800 bg-base-900/40 p-6 text-base-100">
          <h2 className="text-xl font-semibold text-accent-300">{t('analysis.page.title')}</h2>
          <p className="mt-2 text-sm text-base-300">{t('analysis.page.lead')}</p>
          <Link
            to="/analysis"
            className="mt-4 inline-flex items-center justify-center rounded-full border border-accent-400 px-5 py-2 text-sm font-semibold text-accent-200 transition hover:bg-accent-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
          >
            {t('analysis.actions.listen')}
          </Link>
        </div>
      </div>
    </section>
  );
}
