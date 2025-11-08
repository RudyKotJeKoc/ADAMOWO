import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { DocumentarySection } from '../features/documentary/DocumentarySection';
import { FinalLessonSection } from '../features/final-lesson/FinalLessonSection';
import { PlatformInfoSection } from '../features/platform-info/PlatformInfoSection';
import { StudioSection } from '../features/studio/StudioSection';
import { TrackHighlightsSection } from '../features/track-highlights/TrackHighlightsSection';
import { ViolenceLoopSection } from '../features/violence-loop/ViolenceLoopSection';
import { ExploreMore, type ExploreMoreLink } from '../components/ExploreMore';

export default function Home(): ReactElement {
  const { t } = useTranslation();

  const explorePaths: ExploreMoreLink[] = [
    {
      to: '/live',
      labelKey: 'exploreMore.suggestions.fromHome.live',
      descriptionKey: 'exploreMore.suggestions.fromHome.liveDesc',
      badge: '24/7'
    },
    {
      to: '/guides',
      labelKey: 'exploreMore.suggestions.fromHome.guides',
      descriptionKey: 'exploreMore.suggestions.fromHome.guidesDesc'
    },
    {
      to: '/violence-loop',
      labelKey: 'exploreMore.suggestions.fromHome.tools',
      descriptionKey: 'exploreMore.suggestions.fromHome.toolsDesc'
    },
    {
      to: '/studio',
      labelKey: 'exploreMore.suggestions.fromHome.studio',
      descriptionKey: 'exploreMore.suggestions.fromHome.studioDesc'
    },
    {
      to: '/analysis',
      labelKey: 'exploreMore.suggestions.fromHome.analysis',
      descriptionKey: 'exploreMore.suggestions.fromHome.analysisDesc',
      badge: '100+ godz'
    },
    {
      to: '/lab',
      labelKey: 'exploreMore.suggestions.fromHome.lab',
      descriptionKey: 'exploreMore.suggestions.fromHome.labDesc'
    }
  ];

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold text-base-50 sm:text-4xl">{t('pages.home.title')}</h1>
        <p className="max-w-4xl text-lg leading-relaxed text-base-200">{t('pages.home.lead')}</p>
      </section>

      <PlatformInfoSection />
      <TrackHighlightsSection />
      <DocumentarySection />
      <FinalLessonSection />
      <StudioSection />
      <ViolenceLoopSection />

      <ExploreMore title={t('exploreMore.title')} links={explorePaths} />
    </div>
  );
}
