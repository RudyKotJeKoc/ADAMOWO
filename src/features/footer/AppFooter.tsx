import type { ReactElement } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface FooterLink {
  id: string;
  href: string;
  label: string;
}

export function AppFooter(): ReactElement {
  const { t } = useTranslation();

  const links = useMemo<FooterLink[]>(
    () => [
      {
        id: 'documentation',
        href: '/docs',
        label: t('footer.links.documentation'),
      },
      {
        id: 'privacy',
        href: '/privacy',
        label: t('footer.links.privacy'),
      },
      {
        id: 'methodology',
        href: '/methodology',
        label: t('footer.links.methodology'),
      },
      {
        id: 'support',
        href: '/support',
        label: t('footer.links.support'),
      },
    ],
    [t]
  );

  return (
    <footer className="border-t border-base-900/80 bg-base-950/80 text-base-300">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
        {/* Helpline Numbers Section - Critical Information */}
        <div className="mb-8 rounded-lg border border-cyan-700/40 bg-cyan-950/20 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-cyan-200">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            {t('footer.helpline.title', 'Potrzebujesz pomocy?')}
          </h2>
          <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:gap-8">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-cyan-300">
                {t('footer.helpline.niebiekskaLinia', 'Niebieska Linia')}:
              </span>
              <a
                href="tel:800120002"
                className="font-mono text-lg font-bold text-cyan-100 hover:text-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                800 120 002
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-cyan-300">
                {t('footer.helpline.telefonZaufania', 'Telefon Zaufania')}:
              </span>
              <a
                href="tel:116123"
                className="font-mono text-lg font-bold text-cyan-100 hover:text-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                116 123
              </a>
            </div>
            <a
              href="/help"
              className="text-sm font-medium text-cyan-200 underline hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              {t('footer.helpline.moreResources', 'Więcej zasobów pomocy')} →
            </a>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <nav aria-label={t('footer.navigation')} className="flex-1">
            <ul className="flex flex-col gap-3 sm:flex-row sm:gap-6">
              {links.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    className="text-sm font-medium text-base-200 transition hover:text-accent-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-3 text-sm text-base-400 md:items-end">
            <a
              href="#main-content"
              className="inline-flex items-center gap-2 self-start rounded-full border border-accent-500/40 bg-accent-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-accent-200 transition hover:bg-accent-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 md:self-auto"
            >
              {t('footer.backToTop')}
            </a>
            <p className="text-xs text-base-500">{t('footer.rights')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
