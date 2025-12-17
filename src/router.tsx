import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { AppShell } from './components/AppShell';

const Home = lazy(() => import('./pages/Home'));
const Live = lazy(() => import('./pages/Live'));
const ViolenceLoop = lazy(() => import('./pages/ViolenceLoop'));
const Studio = lazy(() => import('./pages/Studio'));
const Shows = lazy(() => import('./pages/Shows'));
const AnalysisPage = lazy(() => import('./features/analysis-archive/AnalysisPage'));
const Analyses = lazy(() => import('./pages/Analyses'));
const ManipulationTaxonomy = lazy(() => import('./pages/ManipulationTaxonomy'));
const CaseStudyReport = lazy(() => import('./pages/CaseStudyReport'));
const Programs = lazy(() => import('./pages/Programs'));
const Guides = lazy(() => import('./pages/Guides'));
const Lab = lazy(() => import('./pages/Lab'));
const Community = lazy(() => import('./pages/Community'));
const AnatomyPage = lazy(() => import('./pages/AnatomyPage'));
const Help = lazy(() => import('./pages/Help'));
const Support = lazy(() => import('./pages/Support'));
const Privacy = lazy(() => import('./pages/Privacy'));
const AIPolicy = lazy(() => import('./pages/AIPolicy'));
const Methodology = lazy(() => import('./pages/Methodology'));
const PolanaKlamstw = lazy(() => import('./pages/PolanaKlamstw'));
const CurseOfEightContent = lazy(() => import('./pages/CurseOfEightContent'));
const TimelineContent = lazy(() => import('./pages/TimelineContent'));
const MediaHub = lazy(() => import('./pages/MediaHub'));
const Sitemap = lazy(() => import('./pages/Sitemap'));
const TeatrAbsurdu = lazy(() => import('./pages/TeatrAbsurdu'));
const SpektaklPage = lazy(() => import('./features/teatr-absurdu/SpektaklPage'));
const AnalizaPage = lazy(() => import('./features/teatr-absurdu/AnalizaPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Home /> },
      { path: 'live', element: <Live /> },
      { path: 'violence-loop', element: <ViolenceLoop /> },
      { path: 'studio/:program?', element: <Studio /> },
      { path: 'shows', element: <Shows /> },
      { path: 'analysis', element: <AnalysisPage /> },
      { path: 'analizy', element: <Analyses /> },
      { path: 'taxonomy', element: <ManipulationTaxonomy /> },
      { path: 'taksonomia', element: <ManipulationTaxonomy /> },
      { path: 'case-study', element: <CaseStudyReport /> },
      { path: 'studium-przypadku', element: <CaseStudyReport /> },
      { path: 'casestudy', element: <CaseStudyReport /> },
      { path: 'programy', element: <Programs /> },
      { path: 'guides', element: <Guides /> },
      { path: 'polana-klamstw/:chapterId?', element: <PolanaKlamstw /> },
      { path: 'lab', element: <Lab /> },
      { path: 'community', element: <Community /> },
      { path: 'anatomy', element: <AnatomyPage /> },
      { path: 'help', element: <Help /> },
      { path: 'pomoc', element: <Help /> }, // Polish alias for /help
      { path: 'support', element: <Support /> },
      { path: 'privacy', element: <Privacy /> },
      { path: 'ai-policy', element: <AIPolicy /> },
      { path: 'methodology', element: <Methodology /> },
      { path: 'curse-of-eight-content', element: <CurseOfEightContent /> },
      { path: 'timeline-content', element: <TimelineContent /> },
      { path: 'media', element: <MediaHub /> },
      { path: 'mapa-strony', element: <Sitemap /> },
      // Teatr Absurdu section
      { path: 'teatr-absurdu', element: <TeatrAbsurdu /> },
      { path: 'teatr-absurdu/spektakl', element: <SpektaklPage /> },
      { path: 'teatr-absurdu/analiza', element: <AnalizaPage /> },
    ],
  },
]);
