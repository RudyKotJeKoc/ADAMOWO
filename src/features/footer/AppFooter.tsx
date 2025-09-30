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
        label: t('footer.links.documentation')
      },
      {
        id: 'privacy',
        href: '/privacy',
        label: t('footer.links.privacy')
      },
      {
        id: 'methodology',
        href: '/methodology',
        label: t('footer.links.methodology')
      }
    ],
    [t]
  );

  return (
    <footer className="border-t border-base-900/80 bg-base-950/80 text-base-300">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-6">
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
    </footer>
  );
}
