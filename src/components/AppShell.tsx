import { Outlet } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { AppFooter } from '../features/footer/AppFooter';
import { Breadcrumbs } from './Breadcrumbs';
import { Header } from './Header';
import { usePageTracking } from '../hooks/usePageTracking';

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
