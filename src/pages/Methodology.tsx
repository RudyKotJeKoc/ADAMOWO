import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  BookOpenIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export function Methodology(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="space-y-6 text-center">
        <h1 className="text-4xl font-bold text-base-50 sm:text-5xl">
          {t('methodology.title')}
        </h1>
        <p className="mx-auto max-w-3xl text-lg leading-relaxed text-base-300">
          {t('methodology.description')}
        </p>
      </header>

      {/* Our Approach */}
      <section className="rounded-2xl border border-base-800/60 bg-base-900/50 p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <BookOpenIcon className="h-6 w-6 text-accent-300" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-base-50">
            {t('methodology.approach.title')}
          </h2>
        </div>
        <div className="space-y-4 text-base-300">
          <p>{t('methodology.approach.description')}</p>
          <ul className="space-y-3">
            {['evidence', 'multidisciplinary', 'practical', 'accessible'].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-400" />
                <div>
                  <strong className="text-base-100">{t(`methodology.approach.${item}.title`)}</strong>
                  <p className="mt-1">{t(`methodology.approach.${item}.description`)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Sources & Research */}
      <section className="rounded-2xl border border-base-800/60 bg-base-900/50 p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <AcademicCapIcon className="h-6 w-6 text-accent-300" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-base-50">
            {t('methodology.sources.title')}
          </h2>
        </div>
        <div className="space-y-4 text-base-300">
          <p>{t('methodology.sources.description')}</p>

          <h3 className="text-lg font-semibold text-base-100">
            {t('methodology.sources.categories.psychology')}
          </h3>
          <ul className="list-inside list-disc space-y-1 pl-4">
            <li>{t('methodology.sources.examples.psychology1')}</li>
            <li>{t('methodology.sources.examples.psychology2')}</li>
            <li>{t('methodology.sources.examples.psychology3')}</li>
          </ul>

          <h3 className="text-lg font-semibold text-base-100">
            {t('methodology.sources.categories.trauma')}
          </h3>
          <ul className="list-inside list-disc space-y-1 pl-4">
            <li>{t('methodology.sources.examples.trauma1')}</li>
            <li>{t('methodology.sources.examples.trauma2')}</li>
          </ul>

          <h3 className="text-lg font-semibold text-base-100">
            {t('methodology.sources.categories.legal')}
          </h3>
          <ul className="list-inside list-disc space-y-1 pl-4">
            <li>{t('methodology.sources.examples.legal1')}</li>
            <li>{t('methodology.sources.examples.legal2')}</li>
          </ul>
        </div>
      </section>

      {/* Expert Consultation */}
      <section className="rounded-2xl border border-base-800/60 bg-base-900/50 p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <UserGroupIcon className="h-6 w-6 text-accent-300" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-base-50">
            {t('methodology.experts.title')}
          </h2>
        </div>
        <div className="space-y-4 text-base-300">
          <p>{t('methodology.experts.description')}</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {['psychologists', 'therapists', 'legal', 'survivors'].map((expert) => (
              <li key={expert} className="flex items-start gap-2">
                <span className="mt-1 inline-flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-400" />
                <span>{t(`methodology.experts.types.${expert}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Quality Assurance */}
      <section className="rounded-2xl border border-base-800/60 bg-base-900/50 p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <ChartBarIcon className="h-6 w-6 text-accent-300" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-base-50">
            {t('methodology.quality.title')}
          </h2>
        </div>
        <div className="space-y-4 text-base-300">
          <p>{t('methodology.quality.description')}</p>
          <ul className="space-y-2">
            {['review', 'feedback', 'updates', 'accuracy'].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 inline-flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-400" />
                <span>{t(`methodology.quality.measures.${item}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Limitations & Disclaimers */}
      <div className="rounded-2xl border border-yellow-500/40 bg-yellow-500/10 p-6">
        <h2 className="mb-3 text-xl font-semibold text-yellow-100">
          {t('methodology.limitations.title')}
        </h2>
        <div className="space-y-2 text-base-200">
          <p>{t('methodology.limitations.content')}</p>
          <ul className="list-inside list-disc space-y-1 pl-4">
            <li>{t('methodology.limitations.point1')}</li>
            <li>{t('methodology.limitations.point2')}</li>
            <li>{t('methodology.limitations.point3')}</li>
          </ul>
        </div>
      </div>

      {/* Contact for Feedback */}
      <div className="rounded-2xl border border-base-800/60 bg-base-900/50 p-6 text-center">
        <h2 className="mb-3 text-xl font-semibold text-base-50">
          {t('methodology.feedback.title')}
        </h2>
        <p className="mb-4 text-base-300">{t('methodology.feedback.description')}</p>
        <p className="text-sm text-base-400">
          {t('methodology.feedback.email')}: <a href="mailto:research@radioadamowo.org" className="text-accent-300 hover:text-accent-200 underline">research@radioadamowo.org</a>
        </p>
      </div>

      {/* Related Links */}
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          to="/privacy"
          className="inline-flex items-center gap-2 rounded-full border border-accent-500 bg-transparent px-6 py-3 font-semibold text-accent-200 transition hover:bg-accent-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300"
        >
          {t('methodology.relatedLinks.privacy')}
        </Link>
        <Link
          to="/ai-policy"
          className="inline-flex items-center gap-2 rounded-full border border-accent-500 bg-transparent px-6 py-3 font-semibold text-accent-200 transition hover:bg-accent-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300"
        >
          {t('methodology.relatedLinks.aiPolicy')}
        </Link>
      </div>
    </div>
  );
}

export default Methodology;
