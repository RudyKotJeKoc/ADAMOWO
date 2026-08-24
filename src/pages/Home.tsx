import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import {
  HomeIcon,
  InformationCircleIcon,
  AcademicCapIcon,
  WrenchScrewdriverIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';

import { DocumentarySection } from '../features/documentary/DocumentarySection';
import { FinalLessonSection } from '../features/final-lesson/FinalLessonSection';
import { PlatformInfoSection } from '../features/platform-info/PlatformInfoSection';
import { TrackHighlightsSection } from '../features/track-highlights/TrackHighlightsSection';
import { ViolenceLoopSection } from '../features/violence-loop/ViolenceLoopSection';
import { AnalysisTeaser } from '../features/analizy/AnalysisTeaser';
import { ProgramsTeaser } from '../features/programy/ProgramsTeaser';
import { ExploreMore, type ExploreMoreLink } from '../components/ExploreMore';
import { VisitCounter } from '../features/analytics/VisitCounter';
import { Tabs, type TabItem } from '../components/Tabs';

/**
 * Home page component that serves as the main landing page for the ADAMOWO platform.
 *
 * Implements a modern tabbed interface to organize content into logical sections,
 * reducing cognitive load and improving user navigation. Content is divided into
 * "Above the Fold" hero section and categorized tabs for easy access.
 *
 * Key Features:
 * - Tabbed interface for organized content navigation
 * - "Above the Fold" hero section with key information
 * - Comprehensive project sections organized by category
 * - Dynamic explore more suggestions with badges
 * - Visit counter for tracking site engagement
 * - Multilingual support through i18n
 * - Mobile-first responsive design
 *
 * Architecture Changes (following UX best practices):
 * - Replaced long scrolling page with tab-based navigation
 * - Prioritized content visibility (Priority A content above fold)
 * - Grouped related sections together
 * - Improved information hierarchy
 *
 * @component
 * @returns {ReactElement} The restructured home page with tabbed interface
 */
export default function Home(): ReactElement {
  const { t } = useTranslation();

  const explorePaths: ExploreMoreLink[] = [
    {
      to: '/live',
      labelKey: 'exploreMore.suggestions.fromHome.live',
      descriptionKey: 'exploreMore.suggestions.fromHome.liveDesc',
      badge: '24/7',
    },
    {
      to: '/guides',
      labelKey: 'exploreMore.suggestions.fromHome.guides',
      descriptionKey: 'exploreMore.suggestions.fromHome.guidesDesc',
    },
    {
      to: '/violence-loop',
      labelKey: 'exploreMore.suggestions.fromHome.tools',
      descriptionKey: 'exploreMore.suggestions.fromHome.toolsDesc',
    },
    {
      to: '/analizy',
      labelKey: 'exploreMore.suggestions.fromHome.analizy',
      descriptionKey: 'exploreMore.suggestions.fromHome.analizyDesc',
    },
    {
      to: '/programy',
      labelKey: 'exploreMore.suggestions.fromHome.programy',
      descriptionKey: 'exploreMore.suggestions.fromHome.programyDesc',
    },
    {
      to: '/analysis',
      labelKey: 'exploreMore.suggestions.fromHome.analysis',
      descriptionKey: 'exploreMore.suggestions.fromHome.analysisDesc',
      badge: '100+ godz',
    },
    {
      to: '/lab',
      labelKey: 'exploreMore.suggestions.fromHome.lab',
      descriptionKey: 'exploreMore.suggestions.fromHome.labDesc',
    },
  ];

  const tabs: TabItem[] = [
    {
      id: 'start',
      label: t('pages.home.tabs.start.label', 'Start'),
      icon: <HomeIcon className="h-5 w-5" />,
      content: (
        <div className="space-y-8">
          {/* Above the Fold Hero Section - Priority A Content */}
          <section className="space-y-4">
            <h1 className="text-3xl font-bold text-base-50 sm:text-4xl">{t('pages.home.title')}</h1>
            <p className="max-w-4xl text-lg leading-relaxed text-base-200">
              {t('pages.home.lead')}
            </p>
            <div className="pt-4">
              <VisitCounter />
            </div>
          </section>

          {/* Quick Access Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ExploreMore
              title={t('pages.home.tabs.start.quickAccess', 'Szybki dostęp')}
              links={explorePaths.slice(0, 3)}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'about',
      label: t('pages.home.tabs.about.label', 'O Projekcie'),
      icon: <InformationCircleIcon className="h-5 w-5" />,
      content: (
        <div className="space-y-12">
          <PlatformInfoSection />
        </div>
      ),
    },
    {
      id: 'content',
      label: t('pages.home.tabs.content.label', 'Treści Edukacyjne'),
      icon: <AcademicCapIcon className="h-5 w-5" />,
      badge: 'Nowe',
      content: (
        <div className="space-y-12">
          <AnalysisTeaser />
          <TrackHighlightsSection />
          <DocumentarySection />
          <FinalLessonSection />
        </div>
      ),
    },
    {
      id: 'tools',
      label: t('pages.home.tabs.tools.label', 'Narzędzia'),
      icon: <WrenchScrewdriverIcon className="h-5 w-5" />,
      content: (
        <div className="space-y-12">
          <ViolenceLoopSection />
          <ProgramsTeaser />
        </div>
      ),
    },
    {
      id: 'explore',
      label: t('pages.home.tabs.explore.label', 'Poznaj Więcej'),
      icon: <RocketLaunchIcon className="h-5 w-5" />,
      content: (
        <div className="space-y-8">
          <ExploreMore title={t('exploreMore.title')} links={explorePaths} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Tabbed Interface */}
      <Tabs tabs={tabs} defaultActiveId="start" variant="pills" />
    </div>
  );
}
