import { useTranslation } from 'react-i18next';

import { LibrarySection } from '../features/library/LibrarySection';
import { MythologySection } from '../features/mythology/MythologySection';

export default function Guides(): JSX.Element {
  const { t } = useTranslation();

  return (
    <section className="space-y-12">
      <header className="space-y-6">
        <div className="space-y-4">
          <h1 className="font-display text-4xl font-semibold text-base-50 sm:text-5xl">
            {t('pages.guides.title')}
          </h1>
          <p className="max-w-3xl text-base text-base-200">{t('pages.guides.lede')}</p>
        </div>
        <nav
          aria-label={t('pages.guides.anchorNav')}
          className="flex flex-wrap gap-3"
        >
          <a
            href="#library"
            className="inline-flex items-center gap-2 rounded-full border border-accent-500/50 bg-base-925/60 px-4 py-2 text-sm font-semibold text-accent-100 transition motion-safe:hover:border-accent-400 motion-safe:hover:text-accent-50 focus-visible:shadow-focus"
          >
            <span aria-hidden="true">📚</span>
            <span>{t('pages.guides.links.library')}</span>
          </a>
          <a
            href="#mythology"
            className="inline-flex items-center gap-2 rounded-full border border-accent-500/50 bg-base-925/60 px-4 py-2 text-sm font-semibold text-accent-100 transition motion-safe:hover:border-accent-400 motion-safe:hover:text-accent-50 focus-visible:shadow-focus"
          >
            <span aria-hidden="true">✨</span>
            <span>{t('pages.guides.links.mythology')}</span>
          </a>
        </nav>
      </header>

      <div className="space-y-12">
        <LibrarySection sectionId="library" />
        <MythologySection sectionId="mythology" />
      </div>
    </section>
  );
}
