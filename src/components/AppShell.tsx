import { Outlet } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { AppFooter } from '../features/footer/AppFooter';
import { Breadcrumbs } from './Breadcrumbs';
import { Header } from './Header';
import { EmergencyBanner } from './EmergencyBanner';
import { AdamowoHeader } from './AdamowoHeader';
import { usePageTracking } from '../hooks/usePageTracking';

/**
 * Main application layout shell component that wraps all pages.
 *
 * Provides the consistent layout structure for the entire application, including
 * the emergency banner, Adamowo header with audio player, main navigation header,
 * breadcrumb navigation, main content area, and footer. Also implements accessibility
 * features like skip-to-content links and automatic page tracking.
 *
 * @component
 * @returns {JSX.Element} The complete application shell with nested routing
 *
 * @example
 * ```tsx
 * <BrowserRouter>
 *   <Routes>
 *     <Route path="/" element={<AppShell />}>
 *       <Route index element={<Home />} />
 *       <Route path="live" element={<Live />} />
 *     </Route>
 *   </Routes>
 * </BrowserRouter>
 * ```
 *
 * Features:
 * - Skip-to-content link for keyboard navigation accessibility
 * - Emergency banner for important announcements
 * - Adamowo branding header with integrated audio player
 * - Main navigation header with menu and search
 * - Breadcrumb navigation for context awareness
 * - Main content area with React Router outlet
 * - Application footer
 * - Automatic page visit tracking via analytics
 * - Responsive container layout
 * - Semantic HTML structure with ARIA attributes
 */
export function AppShell(): JSX.Element {
  const { t } = useTranslation();

  // Track page visits automatically
  usePageTracking();

  return (
    <div className="min-h-screen bg-base-950 text-base-100">
      <a
        href="#main-content"
        className="skip-link absolute left-4 top-4 z-50 -translate-y-16 rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold text-base-950 opacity-0 shadow-lg transition focus-visible:translate-y-0 focus-visible:opacity-100"
      >
        {t('header.skipToContent')}
      </a>
      <EmergencyBanner />
      <AdamowoHeader />
      <Header />
      <Breadcrumbs />
      <main
        id="main-content"
        className="container-responsive flex flex-1 flex-col gap-10 pb-16 pt-8"
        tabIndex={-1}
      >
        <Outlet />
      </main>
      <AppFooter />
    </div>
  );
}
