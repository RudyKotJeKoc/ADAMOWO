import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ShieldCheckIcon, UserGroupIcon, CogIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export function Privacy(): JSX.Element {
  const { t } = useTranslation();

  const sections = [
    {
      icon: ShieldCheckIcon,
      titleKey: 'privacy.dataProtection.title',
      contentKey: 'privacy.dataProtection.content'
    },
    {
      icon: UserGroupIcon,
      titleKey: 'privacy.personalData.title',
      contentKey: 'privacy.personalData.content'
    },
    {
      icon: CogIcon,
      titleKey: 'privacy.interactiveTools.title',
      contentKey: 'privacy.interactiveTools.content'
    },
    {
      icon: DocumentTextIcon,
      titleKey: 'privacy.cookies.title',
      contentKey: 'privacy.cookies.content'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="space-y-6 text-center">
        <h1 className="text-4xl font-bold text-base-50 sm:text-5xl">
          {t('privacy.title')}
        </h1>
        <p className="mx-auto max-w-3xl text-lg leading-relaxed text-base-300">
          {t('privacy.description')}
        </p>
        <p className="text-sm text-base-400">
          {t('privacy.lastUpdated')}: {t('privacy.updateDate')}
        </p>
      </header>

      {/* Important Notice */}
      <div className="rounded-2xl border border-accent-500/40 bg-accent-500/10 p-6">
        <h2 className="mb-3 text-xl font-semibold text-accent-100">
          {t('privacy.notice.title')}
        </h2>
        <p className="text-base-200">{t('privacy.notice.content')}</p>
      </div>

      {/* Main Sections */}
      <div className="space-y-8">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <section
              key={section.titleKey}
              className="rounded-2xl border border-base-800/60 bg-base-900/50 p-6 sm:p-8"
            >
              <div className="mb-4 flex items-center gap-3">
                <Icon className="h-6 w-6 text-accent-300" aria-hidden="true" />
                <h2 className="text-2xl font-semibold text-base-50">
                  {t(section.titleKey)}
                </h2>
              </div>
              <div
                className="prose prose-invert max-w-none space-y-4 text-base-300"
                dangerouslySetInnerHTML={{ __html: t(section.contentKey) }}
              />
            </section>
          );
        })}
      </div>

      {/* Interactive Tools Consent */}
      <div className="rounded-2xl border border-purple-500/40 bg-purple-500/10 p-6 sm:p-8">
        <h2 className="mb-4 text-2xl font-semibold text-purple-100">
          {t('privacy.consent.title')}
        </h2>
        <div className="space-y-4 text-base-200">
          <p>{t('privacy.consent.description')}</p>
          <ul className="list-inside list-disc space-y-2 pl-4">
            <li>{t('privacy.consent.points.aiLab')}</li>
            <li>{t('privacy.consent.points.violenceLoop')}</li>
            <li>{t('privacy.consent.points.analytics')}</li>
            <li>{t('privacy.consent.points.storage')}</li>
          </ul>
          <p className="font-medium text-purple-100">
            {t('privacy.consent.userControl')}
          </p>
        </div>
      </div>

      {/* User Rights */}
      <div className="rounded-2xl border border-base-800/60 bg-base-900/50 p-6 sm:p-8">
        <h2 className="mb-4 text-2xl font-semibold text-base-50">
          {t('privacy.rights.title')}
        </h2>
        <div className="space-y-4 text-base-300">
          <p>{t('privacy.rights.description')}</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-400" />
              <span>{t('privacy.rights.access')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-400" />
              <span>{t('privacy.rights.rectification')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-400" />
              <span>{t('privacy.rights.erasure')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-400" />
              <span>{t('privacy.rights.portability')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-400" />
              <span>{t('privacy.rights.objection')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-400" />
              <span>{t('privacy.rights.withdraw')}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Contact */}
      <div className="rounded-2xl border border-base-800/60 bg-base-900/50 p-6 text-center">
        <h2 className="mb-3 text-xl font-semibold text-base-50">
          {t('privacy.contact.title')}
        </h2>
        <p className="mb-4 text-base-300">{t('privacy.contact.description')}</p>
        <p className="text-sm text-base-400">
          {t('privacy.contact.email')}: <a href="mailto:privacy@radioadamowo.org" className="text-accent-300 hover:text-accent-200 underline">privacy@radioadamowo.org</a>
        </p>
      </div>

      {/* Related Links */}
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          to="/ai-policy"
          className="inline-flex items-center gap-2 rounded-full border border-accent-500 bg-transparent px-6 py-3 font-semibold text-accent-200 transition hover:bg-accent-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300"
        >
          {t('privacy.relatedLinks.aiPolicy')}
        </Link>
        <Link
          to="/methodology"
          className="inline-flex items-center gap-2 rounded-full border border-accent-500 bg-transparent px-6 py-3 font-semibold text-accent-200 transition hover:bg-accent-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300"
        >
          {t('privacy.relatedLinks.methodology')}
        </Link>
      </div>
    </div>
  );
}
