import { useTranslation } from 'react-i18next';
import { SCIENTIFIC_REFERENCES } from './family-psychology.data';

export function ScientificReferences(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="my-8 rounded-xl border border-base-800 bg-base-925/60 p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xl" aria-hidden="true">
          📚
        </span>
        <h3 className="font-display text-lg font-semibold text-accent-300">
          {t('familyPsychology.references.title')}
        </h3>
      </div>
      <div className="flex flex-wrap gap-3">
        {SCIENTIFIC_REFERENCES.map((ref, index) => (
          <a
            key={index}
            href={t(ref.urlKey)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-accent-500/50 bg-base-925/60 px-4 py-2 text-sm font-semibold text-accent-200 transition hover:border-accent-400 hover:bg-accent-500/10 hover:text-accent-100 focus-visible:shadow-focus"
          >
            <span>{t(ref.termKey)}</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}
