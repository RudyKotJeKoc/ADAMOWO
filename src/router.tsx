import { createBrowserRouter } from 'react-router-dom';

import { AppShell } from './components/AppShell';
import Community from './pages/Community';
import Guides from './pages/Guides';
import Home from './pages/Home';
import Lab from './pages/Lab';
import Live from './pages/Live';
import Shows from './pages/Shows';
import ViolenceLoop from './pages/ViolenceLoop';
import AnalysisPage from './features/analysis-archive/AnalysisPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Home /> },
      { path: 'live', element: <Live /> },
      { path: 'violence-loop', element: <ViolenceLoop /> },
      { path: 'shows', element: <Shows /> },
      { path: 'analysis', element: <AnalysisPage /> },
      { path: 'guides', element: <Guides /> },
      { path: 'lab', element: <Lab /> },
      { path: 'community', element: <Community /> }
    ]
  }
]);
