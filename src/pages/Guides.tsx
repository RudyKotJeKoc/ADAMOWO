import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function Guides(): JSX.Element {
  const { t } = useTranslation();

  return (
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
