import { Outlet } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { AppFooter } from '../features/footer/AppFooter';
import { Header } from './Header';

export function AppShell(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-base-950 text-base-100">
      <a
        href="#main-content"
        className="skip-link absolute left-4 top-4 z-50 -translate-y-16 rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold text-base-950 opacity-0 shadow-lg transition focus:translate-y-0 focus:opacity-100 focus:outline-none focus-visible:shadow-focus"
      >
        {t('header.skipToContent')}
      </a>
      <Header />
      <main
        id="main-content"
        className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 pb-16 pt-10 md:px-6"
        tabIndex={-1}
      >
        <Outlet />
      </main>
      <AppFooter />
    </div>
  );
}
