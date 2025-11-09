import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import clsx from 'clsx';

export interface KeyFinding {
  id: string;
  labelKey: string;
  descriptionKey?: string;
  linkTo?: string; // Optional anchor link for navigation
}

interface KeyFindingsProps {
  titleKey?: string;
  findings: KeyFinding[];
  summaryKey?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

/**
 * KeyFindings Component
 *
 * Displays a summary of key findings with quick navigation links.
 * Helps users quickly find specific practical knowledge without reading
 * through entire sections.
 *
 * Addresses the recommendation: "Dodać krótkie streszczenia każdej dłuższej sekcji
 * i linki do 'kluczowych wniosków' lub 'co zrobić teraz'"
 */
export function KeyFindings({
  titleKey = 'keyFindings.title',
  findings,
  summaryKey,
  collapsible = false,
  defaultExpanded = true,
}: KeyFindingsProps): JSX.Element {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleFindingClick = (linkTo?: string) => {
    if (linkTo) {
      const element = document.getElementById(linkTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const content = (
    <>
      {summaryKey && (
        <p className="mb-4 text-sm leading-relaxed text-base-300">{t(summaryKey)}</p>
      )}

      <ul className="space-y-3" role="list">
        {findings.map((finding) => (
          <li key={finding.id}>
            {finding.linkTo ? (
              <button
                type="button"
                onClick={() => handleFindingClick(finding.linkTo)}
                className="group flex w-full items-start gap-3 rounded-lg border border-base-700/50 bg-base-900/40 p-3 text-left transition hover:border-accent-500/50 hover:bg-base-800/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
              >
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-500/20 text-xs font-bold text-accent-300"
                  aria-hidden="true"
                >
                  →
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-base-100 group-hover:text-accent-200">
                    {t(finding.labelKey)}
                  </p>
                  {finding.descriptionKey && (
                    <p className="mt-1 text-xs text-base-400">{t(finding.descriptionKey)}</p>
                  )}
                </div>
              </button>
            ) : (
              <div className="flex items-start gap-3 rounded-lg border border-base-700/50 bg-base-900/40 p-3">
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-500/20 text-xs font-bold text-accent-300"
                  aria-hidden="true"
                >
                  •
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-base-100">{t(finding.labelKey)}</p>
                  {finding.descriptionKey && (
                    <p className="mt-1 text-xs text-base-400">{t(finding.descriptionKey)}</p>
                  )}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  );

  return (
    <aside
      className="rounded-2xl border border-accent-500/30 bg-[radial-gradient(circle_at_top,_#1a1f3a,_#080b1e)] p-6 shadow-lg shadow-accent-950/40"
      aria-label={t(titleKey)}
    >
      {collapsible ? (
        <>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mb-4 flex w-full items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
            aria-expanded={isExpanded}
          >
            <h3 className="text-lg font-semibold text-base-50">{t(titleKey)}</h3>
            <span
              className={clsx(
                'text-accent-400 transition-transform',
                isExpanded && 'rotate-180'
              )}
              aria-hidden="true"
            >
              ▼
            </span>
          </button>
          {isExpanded && content}
        </>
      ) : (
        <>
          <h3 className="mb-4 text-lg font-semibold text-base-50">{t(titleKey)}</h3>
          {content}
        </>
      )}
    </aside>
  );
}
