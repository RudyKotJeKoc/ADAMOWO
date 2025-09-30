
import { EightSinsPage } from '../features/guide-eight-sins/EightSinsPage';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { LibrarySection } from '../features/library/LibrarySection';
import { MythologySection } from '../features/mythology/MythologySection';

export default function Guides(): JSX.Element {
  return (

    <section className="space-y-6">
      <EightSinsPage />

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
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-base-50 sm:text-4xl">{t('pages.guides.title')}</h1>
        <p className="mt-4 max-w-2xl text-base-200">
          Guidance and educational modules will appear here.
        </p>
      </div>

      <div className="rounded-2xl border border-base-800 bg-base-900/40 p-6 text-base-100">
        <h2 className="text-xl font-semibold text-accent-300">{t('analysis.page.title')}</h2>
        <p className="mt-2 text-sm text-base-300">{t('analysis.page.lead')}</p>
        <Link
          to="/analysis"
          className="mt-4 inline-flex items-center justify-center rounded-full border border-accent-400 px-5 py-2 text-sm font-semibold text-accent-200 transition hover:bg-accent-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
        >
          {t('analysis.actions.listen')}
        </Link>
      </div>

    </section>
  );
}
