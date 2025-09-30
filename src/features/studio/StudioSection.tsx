import { useId } from 'react';
import { useTranslation } from 'react-i18next';

import { PROGRAM_LIST } from './studio.data';
import { StudioProgramCard } from './StudioProgramCard';

export function StudioSection() {
  const { t } = useTranslation();
  const headingId = useId();

  return (
    <section
      id="studio"
      aria-labelledby={headingId}
      role="region"
      className="space-y-8 rounded-3xl border border-base-850 bg-[radial-gradient(circle_at_top,_#161a38,_#070912)] p-8 text-base-100 shadow-2xl shadow-black/40"
    >
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-accent-300">{t('studio.section.kicker')}</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id={headingId} className="text-3xl font-semibold text-base-50 sm:text-4xl">
              {t('studio.section.title')}
            </h2>
            <p className="mt-2 max-w-3xl text-base-300">{t('studio.section.lead')}</p>
          </div>
          <a
            href="#programs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent-200 hover:text-accent-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
          >
            {t('studio.section.skipToPrograms')}
          </a>
        </div>
      </div>

      <div id="programs" className="grid gap-6 sm:grid-cols-2">
        {PROGRAM_LIST.map((program) => (
          <StudioProgramCard key={program.id} program={program} />
        ))}
      </div>
    </section>
  );
}
