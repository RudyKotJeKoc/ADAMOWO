import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { AppShell } from './components/AppShell';

const Home = lazy(() => import('./pages/Home'));
const Live = lazy(() => import('./pages/Live'));
const ViolenceLoop = lazy(() => import('./pages/ViolenceLoop'));
const Studio = lazy(() => import('./pages/Studio'));
const Shows = lazy(() => import('./pages/Shows'));
const AnalysisPage = lazy(() => import('./features/analysis-archive/AnalysisPage'));
const PolanaKlamstw = lazy(() => import('./pages/PolanaKlamstw'));
const Guides = lazy(() => import('./pages/Guides'));
const Lab = lazy(() => import('./pages/Lab'));
const Community = lazy(() => import('./pages/Community'));
const AnatomyPage = lazy(() => import('./pages/AnatomyPage'));
const Help = lazy(() => import('./pages/Help'));
const Privacy = lazy(() => import('./pages/Privacy'));
const AIPolicy = lazy(() => import('./pages/AIPolicy'));
const Methodology = lazy(() => import('./pages/Methodology'));

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
      { path: 'polana-klamstw/:chapterId?', element: <PolanaKlamstw /> },
      { path: 'guides', element: <Guides /> },
      { path: 'lab', element: <Lab /> },
      { path: 'community', element: <Community /> },
      { path: 'anatomy', element: <AnatomyPage /> },
      { path: 'help', element: <Help /> },
      { path: 'privacy', element: <Privacy /> },
      { path: 'ai-policy', element: <AIPolicy /> },
      { path: 'methodology', element: <Methodology /> },
    ],
  },
]);
