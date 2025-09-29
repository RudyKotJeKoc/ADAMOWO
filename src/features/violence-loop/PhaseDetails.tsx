import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';

type PhaseDetailsProps = {
  title: string;
  summary: string;
  examples: string[];
  tips: string[];
  definitionLabel: string;
  examplesLabel: string;
  tipsLabel: string;
  ctaLabel: string;
  resourcesLabel: string;
};

export function PhaseDetails({
  title,
  summary,
  examples,
  tips,
  definitionLabel,
  examplesLabel,
  tipsLabel,
  ctaLabel,
  resourcesLabel
}: PhaseDetailsProps): ReactElement {
  return (
    <section className="space-y-4 rounded-2xl border border-base-800/60 bg-base-900/60 p-6 shadow-lg shadow-base-950/30 backdrop-blur">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-accent-400">{definitionLabel}</p>
        <h3 className="text-2xl font-semibold text-base-50">{title}</h3>
        <p className="text-base-200">{summary}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-accent-400">
            {examplesLabel}
          </h4>
          <ul className="mt-2 space-y-2 text-sm text-base-100">
            {examples.map((example) => (
              <li key={example} className="rounded-md border border-base-800/60 bg-base-900/60 p-3">
                {example}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-accent-400">{tipsLabel}</h4>
          <ul className="mt-2 space-y-2 text-sm text-base-100">
            {tips.map((tip) => (
              <li key={tip} className="rounded-md border border-accent-500/30 bg-base-900/70 p-3">
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <Link
          to="/guides"
          className="inline-flex items-center gap-2 rounded-full border border-accent-500 px-4 py-2 text-sm font-semibold text-accent-300 transition hover:bg-accent-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-base-900"
        >
          <span aria-hidden="true">↗</span>
          <span>{ctaLabel}</span>
          <span className="sr-only">{resourcesLabel}</span>
        </Link>
      </div>
    </section>
  );
}
