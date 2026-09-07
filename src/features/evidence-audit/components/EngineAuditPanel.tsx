import { useState } from 'react';
import clsx from 'clsx';

import { auditCase } from '../engine';
import type { PilotCase } from '../types';

interface EngineAuditPanelProps {
  pilotCase: PilotCase;
}

function StatusLine({ label, pass }: { label: string; pass: boolean }): JSX.Element {
  return (
    <li className="flex items-center gap-2">
      <span
        className={clsx(
          'inline-flex h-5 w-5 flex-none items-center justify-center rounded-full text-xs font-bold',
          pass ? 'bg-emerald-500/20 text-emerald-300' : 'bg-danger-500/20 text-danger-400'
        )}
        aria-hidden="true"
      >
        {pass ? '✓' : '✕'}
      </span>
      <span className="text-base-200">{label}</span>
    </li>
  );
}

/**
 * Runs the full engine audit over the case's own answer key and shows the result —
 * a transparency panel proving the case file is internally consistent with the graph
 * logic the exercises above are graded against, not just hand-authored numbers.
 */
export function EngineAuditPanel({ pilotCase }: EngineAuditPanelProps): JSX.Element {
  const [report, setReport] = useState<ReturnType<typeof auditCase> | null>(null);

  return (
    <article className="rounded-2xl border border-base-800 bg-base-900/40 p-6">
      <h2 className="text-lg font-semibold text-base-100">Silnik: audyt spójności przypadku</h2>
      <p className="mt-2 text-sm text-base-400">
        Uruchamia ten sam silnik logiczny na kluczu odpowiedzi zapisanym w pliku przypadku, aby
        potwierdzić, że odpowiedzi nie zostały po prostu wpisane ręcznie, lecz wynikają z grafu
        źródeł i relacji.
      </p>

      <button
        type="button"
        onClick={() => setReport(auditCase(pilotCase))}
        className="mt-4 min-h-11 rounded-xl border border-base-700 px-5 py-2 text-sm font-semibold text-base-200 transition hover:border-accent-500/50 hover:text-accent-200"
      >
        Uruchom audyt silnika
      </button>

      {report && (
        <ul className="mt-4 space-y-2 text-sm">
          <StatusLine
            label="Liczenie niezależnych źródeł zgodne z kluczem odpowiedzi"
            pass={report.independentSources.pass}
          />
          <StatusLine
            label="Klasyfikacja warstw epistemicznych zgodna z kluczem odpowiedzi"
            pass={report.layerClassification.pass}
          />
          <StatusLine label="Graf relacji REPEATS bez pętli" pass={report.repeatsIntegrity.pass} />
        </ul>
      )}
    </article>
  );
}
