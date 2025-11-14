import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  ShieldExclamationIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline';

/**
 * AI Policy page component detailing AI usage and ethical guidelines.
 *
 * Displays comprehensive information about how AI is used in the ADAMOWO project,
 * including voice reconstruction ethics, deepfake prevention measures, AI Lab tool
 * data processing, security practices, and user control options. Features a critical
 * warning about non-professional advice and organized sections with icons.
 *
 * Key Features:
 * - Critical warning about AI limitations and professional help
 * - Five core principles (educational, consent, transparency, safety, accountability)
 * - Voice reconstruction and deepfake prevention safeguards
 * - AI Lab tool data processing transparency
 * - Comprehensive data security measures
 * - User control and opt-out options
 * - Contact information for AI ethics inquiries
 * - Links to related Privacy and Methodology pages
 *
 * @component
 * @returns {JSX.Element} The AI policy page with ethical guidelines and safeguards
 */
export function AIPolicy(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="space-y-6 text-center">
        <h1 className="text-4xl font-bold text-base-50 sm:text-5xl">
          {t('aiPolicy.title')}
        </h1>
        <p className="mx-auto max-w-3xl text-lg leading-relaxed text-base-300">
          {t('aiPolicy.description')}
        </p>
        <p className="text-sm text-base-400">
          {t('aiPolicy.lastUpdated')}: {t('aiPolicy.updateDate')}
        </p>
      </header>

      {/* Critical Notice */}
      <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6">
        <div className="flex items-start gap-3">
          <ExclamationTriangleIcon className="h-6 w-6 flex-shrink-0 text-red-300" aria-hidden="true" />
          <div>
            <h2 className="mb-2 text-xl font-semibold text-red-100">
              {t('aiPolicy.warning.title')}
            </h2>
            <p className="text-base-200">{t('aiPolicy.warning.content')}</p>
          </div>
        </div>
      </div>

      {/* Our Principles */}
      <section className="rounded-2xl border border-base-800/60 bg-base-900/50 p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <ShieldExclamationIcon className="h-6 w-6 text-accent-300" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-base-50">
            {t('aiPolicy.principles.title')}
          </h2>
        </div>
        <div className="space-y-4 text-base-300">
          <p>{t('aiPolicy.principles.description')}</p>
          <ul className="space-y-3">
            {['educational', 'consent', 'transparency', 'safety', 'accountability'].map((principle) => (
              <li key={principle} className="flex items-start gap-3">
                <CheckCircleIcon className="h-5 w-5 flex-shrink-0 text-accent-400" aria-hidden="true" />
                <div>
                  <strong className="text-base-100">{t(`aiPolicy.principles.${principle}.title`)}</strong>
                  <p className="mt-1">{t(`aiPolicy.principles.${principle}.description`)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Voice Reconstruction & Deepfake Prevention */}
      <section className="rounded-2xl border border-purple-500/40 bg-purple-500/10 p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <LockClosedIcon className="h-6 w-6 text-purple-300" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-purple-100">
            {t('aiPolicy.voiceReconstruction.title')}
          </h2>
        </div>
        <div className="space-y-4 text-base-200">
          <p>{t('aiPolicy.voiceReconstruction.description')}</p>

          <h3 className="text-lg font-semibold text-purple-100">
            {t('aiPolicy.voiceReconstruction.dataSource.title')}
          </h3>
          <p>{t('aiPolicy.voiceReconstruction.dataSource.content')}</p>

          <h3 className="text-lg font-semibold text-purple-100">
            {t('aiPolicy.voiceReconstruction.consent.title')}
          </h3>
          <ul className="list-inside list-disc space-y-2 pl-4">
            <li>{t('aiPolicy.voiceReconstruction.consent.point1')}</li>
            <li>{t('aiPolicy.voiceReconstruction.consent.point2')}</li>
            <li>{t('aiPolicy.voiceReconstruction.consent.point3')}</li>
          </ul>

          <h3 className="text-lg font-semibold text-purple-100">
            {t('aiPolicy.voiceReconstruction.safeguards.title')}
          </h3>
          <ul className="list-inside list-disc space-y-2 pl-4">
            <li>{t('aiPolicy.voiceReconstruction.safeguards.watermarking')}</li>
            <li>{t('aiPolicy.voiceReconstruction.safeguards.disclosure')}</li>
            <li>{t('aiPolicy.voiceReconstruction.safeguards.noExport')}</li>
            <li>{t('aiPolicy.voiceReconstruction.safeguards.monitoring')}</li>
            <li>{t('aiPolicy.voiceReconstruction.safeguards.encryption')}</li>
          </ul>
        </div>
      </section>

      {/* AI Lab Tool */}
      <section className="rounded-2xl border border-base-800/60 bg-base-900/50 p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <DocumentCheckIcon className="h-6 w-6 text-accent-300" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-base-50">
            {t('aiPolicy.aiLab.title')}
          </h2>
        </div>
        <div className="space-y-4 text-base-300">
          <p>{t('aiPolicy.aiLab.description')}</p>

          <h3 className="text-lg font-semibold text-base-100">
            {t('aiPolicy.aiLab.dataProcessing.title')}
          </h3>
          <ul className="list-inside list-disc space-y-2 pl-4">
            <li>{t('aiPolicy.aiLab.dataProcessing.local')}</li>
            <li>{t('aiPolicy.aiLab.dataProcessing.noStorage')}</li>
            <li>{t('aiPolicy.aiLab.dataProcessing.noTraining')}</li>
            <li>{t('aiPolicy.aiLab.dataProcessing.anonymized')}</li>
          </ul>

          <h3 className="text-lg font-semibold text-base-100">
            {t('aiPolicy.aiLab.limitations.title')}
          </h3>
          <p>{t('aiPolicy.aiLab.limitations.content')}</p>
        </div>
      </section>

      {/* Data Security */}
      <section className="rounded-2xl border border-base-800/60 bg-base-900/50 p-6 sm:p-8">
        <h2 className="mb-4 text-2xl font-semibold text-base-50">
          {t('aiPolicy.security.title')}
        </h2>
        <div className="space-y-4 text-base-300">
          <p>{t('aiPolicy.security.description')}</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {['encryption', 'access', 'audit', 'retention', 'breach', 'thirdParty'].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 inline-flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-400" />
                <span>{t(`aiPolicy.security.measures.${item}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* User Control */}
      <section className="rounded-2xl border border-accent-500/40 bg-accent-500/10 p-6">
        <h2 className="mb-3 text-xl font-semibold text-accent-100">
          {t('aiPolicy.userControl.title')}
        </h2>
        <p className="mb-4 text-base-200">{t('aiPolicy.userControl.description')}</p>
        <ul className="space-y-2 text-base-200">
          <li className="flex items-start gap-2">
            <span className="mt-1 inline-flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-400" />
            <span>{t('aiPolicy.userControl.optOut')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 inline-flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-400" />
            <span>{t('aiPolicy.userControl.deleteData')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 inline-flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-400" />
            <span>{t('aiPolicy.userControl.report')}</span>
          </li>
        </ul>
      </section>

      {/* Contact */}
      <div className="rounded-2xl border border-base-800/60 bg-base-900/50 p-6 text-center">
        <h2 className="mb-3 text-xl font-semibold text-base-50">
          {t('aiPolicy.contact.title')}
        </h2>
        <p className="mb-4 text-base-300">{t('aiPolicy.contact.description')}</p>
        <p className="text-sm text-base-400">
          {t('aiPolicy.contact.email')}: <a href="mailto:ai-ethics@radioadamowo.org" className="text-accent-300 hover:text-accent-200 underline">ai-ethics@radioadamowo.org</a>
        </p>
      </div>

      {/* Related Links */}
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          to="/privacy"
          className="inline-flex items-center gap-2 rounded-full border border-accent-500 bg-transparent px-6 py-3 font-semibold text-accent-200 transition hover:bg-accent-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300"
        >
          {t('aiPolicy.relatedLinks.privacy')}
        </Link>
        <Link
          to="/methodology"
          className="inline-flex items-center gap-2 rounded-full border border-accent-500 bg-transparent px-6 py-3 font-semibold text-accent-200 transition hover:bg-accent-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300"
        >
          {t('aiPolicy.relatedLinks.methodology')}
        </Link>
      </div>
    </div>
  );
}

export default AIPolicy;
