import { useState } from 'react';
import clsx from 'clsx';

import { gradeIndependentSourcesSubmission } from '../engine';
import type { PilotCase, SourceGroupId } from '../types';

interface IndependentSourcesExerciseProps {
  pilotCase: PilotCase;
}

function toggle(ids: SourceGroupId[], id: SourceGroupId): SourceGroupId[] {
  return ids.includes(id) ? ids.filter((existing) => existing !== id) : [...ids, id];
}

export function IndependentSourcesExercise({
  pilotCase,
}: IndependentSourcesExerciseProps): JSX.Element {
  const task = pilotCase.auditTasks.independentSources;
  const claim = pilotCase.claims.find((c) => c.id === task.claimId);
  const [selected, setSelected] = useState<SourceGroupId[]>([]);
  const [result, setResult] = useState<ReturnType<typeof gradeIndependentSourcesSubmission> | null>(
    null
  );

  const check = () => {
    setResult(gradeIndependentSourcesSubmission(pilotCase, task.claimId, selected));
  };

  const reset = () => {
    setSelected([]);
    setResult(null);
  };

  return (
    <article className="rounded-2xl border border-base-800 bg-base-900/70 p-6">
      <h2 className="text-xl font-semibold text-base-50">
        Ile niezależnych źródeł popiera ten zarzut?
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-base-300">{claim?.text}</p>

      <p className="mt-4 text-sm text-base-400">
        Zaznacz grupy źródeł, które Twoim zdaniem{' '}
        <strong className="text-base-200">niezależnie</strong> potwierdzają zarzut — czyli mają
        własną, pierwotną wiedzę, a nie tylko powtarzają cudzą relację.
      </p>

      <ul className="mt-4 space-y-2">
        {pilotCase.sourceGroups.map((group) => {
          const source = pilotCase.sources.find((s) => s.id === group.originSourceId);
          const checked = selected.includes(group.id);
          return (
            <li key={group.id}>
              <label
                className={clsx(
                  'flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm transition',
                  checked
                    ? 'border-accent-500/60 bg-accent-500/10 text-base-50'
                    : 'border-base-800 bg-base-950/50 text-base-200 hover:border-base-700'
                )}
              >
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-accent-400"
                  checked={checked}
                  onChange={() => {
                    setSelected((prev) => toggle(prev, group.id));
                    setResult(null);
                  }}
                />
                <span>
                  <span className="font-semibold">{group.label}</span>
                  {source && <span className="text-base-400"> — {source.label}</span>}
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={check}
          className="min-h-11 rounded-xl bg-accent-500 px-5 py-2 text-sm font-semibold text-base-950 transition hover:bg-accent-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300"
        >
          Sprawdź odpowiedź
        </button>
        <button
          type="button"
          onClick={reset}
          className="min-h-11 rounded-xl border border-base-700 px-5 py-2 text-sm font-semibold text-base-200 transition hover:border-base-600"
        >
          Wyczyść
        </button>
      </div>

      {result && (
        <div
          role="status"
          className={clsx(
            'mt-5 rounded-xl border p-4 text-sm',
            result.correct
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
              : 'border-danger-500/40 bg-danger-500/10 text-danger-400'
          )}
        >
          <p className="font-semibold">
            {result.correct
              ? 'Poprawnie — silnik wyliczył tę samą liczbę niezależnych źródeł.'
              : 'To jeszcze nie to — silnik namierzył inny zestaw niezależnych źródeł.'}
          </p>
          <p className="mt-2 text-base-200">
            Silnik: <strong>{result.actual.independentSupportingCount}</strong> niezależn
            {result.actual.independentSupportingCount === 1 ? 'e źródło' : 'ych źródeł'} (
            {result.actual.supportingGroupIds.join(', ') || 'brak'}).
          </p>
          <ul className="mt-3 space-y-1 text-base-300">
            {result.actual.supportingContributions.map((contribution) => (
              <li key={contribution.relationId}>
                <code className="text-accent-300">{contribution.segmentId}</code> → wraca do{' '}
                <code className="text-accent-300">{contribution.originSegmentId}</code> (źródło{' '}
                {contribution.originSourceId})
                {contribution.segmentId !== contribution.originSegmentId &&
                  ' — to powtórzenie, nie nowe źródło'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
