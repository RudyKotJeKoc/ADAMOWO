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
const MediaHub = lazy(() => import('./pages/MediaHub'));
const Sitemap = lazy(() => import('./pages/Sitemap'));
const AdamowoSection = lazy(() => import('./pages/AdamowoSection'));

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
      { path: 'programy', element: <Programs /> },
      { path: 'guides', element: <Guides /> },
      { path: 'lab', element: <Lab /> },
      { path: 'community', element: <Community /> },
      { path: 'anatomy', element: <AnatomyPage /> },
      { path: 'help', element: <Help /> },
      { path: 'pomoc', element: <Help /> }, // Polish alias for /help
      { path: 'support', element: <Support /> },
      { path: 'privacy', element: <Privacy /> },
      { path: 'ai-policy', element: <AIPolicy /> },
      { path: 'methodology', element: <Methodology /> },
      { path: 'media', element: <MediaHub /> },
      { path: 'mapa-strony', element: <Sitemap /> },
      { path: 'analiza', element: <AdamowoSection section="analiza" /> },
      { path: 'debaty', element: <AdamowoSection section="debaty" /> },
      { path: 'argumenty', element: <AdamowoSection section="argumenty" /> },
      { path: 'materialy', element: <AdamowoSection section="materialy" /> },
      { path: 'orzeczenia', element: <AdamowoSection section="orzeczenia" /> },
      { path: 'wykladnie', element: <AdamowoSection section="wykladnie" /> },
      { path: 'opinie', element: <AdamowoSection section="opinie" /> },
    ],
  },
]);
