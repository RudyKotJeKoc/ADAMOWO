import type { ReactElement } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface LessonResource {
  id: string;
  url: string;
  title: string;
  description: string;
}

interface CrisisContact {
  id: string;
  label: string;
  phone: string;
  description: string;
}

export function FinalLessonSection(): ReactElement {
  const { t } = useTranslation();

  const summaryItems = useMemo(
    () => [
      t('finalLesson.summary.cycle'),
      t('finalLesson.summary.breakingSilence'),
      t('finalLesson.summary.communityCare'),
      t('finalLesson.summary.documentation'),
      t('finalLesson.summary.boundaries')
    ],
    [t]
  );

  const resources = useMemo<LessonResource[]>(
    () => [
      {
        id: 'guide-blueprint',
        url: 'https://radio-adamowo.example.com/guides/survivor-blueprint',
        title: t('finalLesson.resources.blueprint.title'),
        description: t('finalLesson.resources.blueprint.description')
      },
      {
        id: 'de-escalation',
        url: 'https://radio-adamowo.example.com/guides/de-escalation',
        title: t('finalLesson.resources.deEscalation.title'),
        description: t('finalLesson.resources.deEscalation.description')
      },
      {
        id: 'legal-kit',
        url: 'https://radio-adamowo.example.com/guides/legal-kit',
        title: t('finalLesson.resources.legal.title'),
        description: t('finalLesson.resources.legal.description')
      }
    ],
    [t]
  );

  const crisisContacts = useMemo<CrisisContact[]>(
    () => [
      {
        id: 'niebieska-linia',
        label: t('finalLesson.crisis.niebieska.label'),
        phone: '800120002',
        description: t('finalLesson.crisis.niebieska.description')
      },
      {
        id: 'cpk',
        label: t('finalLesson.crisis.cpk.label'),
        phone: '800120226',
        description: t('finalLesson.crisis.cpk.description')
      }
    ],
    [t]
  );

  return (
    <section
      aria-labelledby="final-lesson-heading"
      className="rounded-3xl border border-base-800/60 bg-gradient-to-br from-base-950/80 to-base-900/70 px-4 py-10 shadow-[0_20px_70px_rgba(8,12,31,0.5)] sm:px-6 lg:px-10"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="space-y-3 text-base-100">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent-300">
            {t('finalLesson.sectionLabel')}
          </p>
          <h2 id="final-lesson-heading" className="text-3xl font-semibold text-base-50 sm:text-4xl">
            {t('finalLesson.title')}
          </h2>
          <p className="max-w-3xl text-base-200">{t('finalLesson.description')}</p>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-accent-500/40 bg-accent-500/10 p-6">
              <h3 className="text-lg font-semibold text-accent-100">{t('finalLesson.summary.title')}</h3>
              <ul className="mt-4 space-y-3 text-sm text-base-200">
                {summaryItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-1 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-accent-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-base-800/60 bg-base-950/50 p-6">
              <h3 className="text-lg font-semibold text-base-50">{t('finalLesson.resources.title')}</h3>
              <p className="mt-1 text-sm text-base-300">{t('finalLesson.resources.lead')}</p>
              <ul className="mt-4 space-y-4">
                {resources.map((resource) => (
                  <li key={resource.id}>
                    <a
                      href={resource.url}
                      className="group block rounded-xl border border-base-800/60 bg-base-900/50 p-4 transition hover:border-accent-400 hover:text-accent-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${resource.title} – ${t('finalLesson.resources.openExternal')}`}
                    >
                      <p className="text-base font-semibold text-base-50 group-hover:text-accent-100">{resource.title}</p>
                      <p className="mt-1 text-sm text-base-300">{resource.description}</p>
                      <span className="mt-2 inline-flex items-center gap-2 text-xs uppercase tracking-wide text-accent-300">
                        {t('finalLesson.resources.visit')}
                        <span aria-hidden="true">↗</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-base-800/60 bg-base-950/50 p-6">
              <h3 className="text-lg font-semibold text-base-50">{t('finalLesson.crisis.title')}</h3>
              <p className="mt-1 text-sm text-base-300">{t('finalLesson.crisis.description')}</p>
              <ul className="mt-4 space-y-4">
                {crisisContacts.map((contact) => (
                  <li key={contact.id} className="rounded-xl border border-base-800/60 bg-base-900/60 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-base font-semibold text-base-50">{contact.label}</p>
                        <p className="text-sm text-base-300">{contact.description}</p>
                      </div>
                      <a
                        href={`tel:${contact.phone}`}
                        className="inline-flex items-center justify-center rounded-full bg-accent-500 px-5 py-2 text-sm font-semibold text-base-950 transition hover:bg-accent-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300"
                        aria-label={t('finalLesson.crisis.callAction', { organization: contact.label, phone: contact.phone })}
                      >
                        {contact.phone}
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
