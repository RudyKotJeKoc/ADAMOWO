import { useState } from 'react';
import clsx from 'clsx';

import { checkSubmittedClassification, findDocumentForSegment, indexSegmentsById } from '../engine';
import type { EpistemicLayerId, PilotCase, SegmentId } from '../types';

interface LayerClassificationExerciseProps {
  pilotCase: PilotCase;
}

const NO_SECONDARY = 'none' as const;

type Answer = { primary: EpistemicLayerId | ''; secondary: EpistemicLayerId | typeof NO_SECONDARY };

export function LayerClassificationExercise({
  pilotCase,
}: LayerClassificationExerciseProps): JSX.Element {
  const tasks = pilotCase.auditTasks.layerClassification;
  const segmentsById = indexSegmentsById(pilotCase);

  const [answers, setAnswers] = useState<Record<SegmentId, Answer>>(() =>
    Object.fromEntries(
      tasks.map((task) => [task.segmentId, { primary: '', secondary: NO_SECONDARY }])
    )
  );
  const [graded, setGraded] = useState(false);

  const setAnswer = (segmentId: SegmentId, patch: Partial<Answer>) => {
    setAnswers((prev) => ({ ...prev, [segmentId]: { ...prev[segmentId], ...patch } }));
    setGraded(false);
  };

  const grades = graded
    ? tasks.map((task) => {
        const answer = answers[task.segmentId];
        const submittedSecondary = answer.secondary === NO_SECONDARY ? null : answer.secondary;
        return {
          segmentId: task.segmentId,
          ...checkSubmittedClassification(
            pilotCase,
            task.segmentId,
            answer.primary as EpistemicLayerId,
            submittedSecondary
          ),
        };
      })
    : [];

  const score = grades.filter((g) => g.correct).length;
  const allAnswered = tasks.every((task) => answers[task.segmentId]?.primary !== '');

  return (
    <article className="rounded-2xl border border-base-800 bg-base-900/70 p-6">
      <h2 className="text-xl font-semibold text-base-50">Zakwalifikuj warstwy epistemiczne</h2>
      <p className="mt-2 text-sm leading-relaxed text-base-300">
        Dla każdego fragmentu wybierz, czym on jest: bezpośrednią obserwacją, twierdzeniem strony,
        ustaleniem organu, przypisaniem motywu czy metadanymi. Niektóre fragmenty mają też warstwę
        drugorzędną.
      </p>

      <div className="mt-5 space-y-4">
        {tasks.map((task) => {
          const segment = segmentsById.get(task.segmentId);
          const document = findDocumentForSegment(pilotCase, task.segmentId);
          const answer = answers[task.segmentId];
          const grade = grades.find((g) => g.segmentId === task.segmentId);

          return (
            <div
              key={task.segmentId}
              className="rounded-xl border border-base-800 bg-base-950/50 p-4"
            >
              <p className="text-xs uppercase tracking-wide text-base-500">
                {document?.title} · {task.segmentId}
              </p>
              <p className="mt-1 text-sm text-base-100">{segment?.text}</p>

              <div className="mt-3 flex flex-wrap gap-3">
                <label className="flex flex-col text-xs text-base-400">
                  Warstwa główna
                  <select
                    value={answer.primary}
                    onChange={(e) =>
                      setAnswer(task.segmentId, { primary: e.target.value as EpistemicLayerId })
                    }
                    className="mt-1 min-h-11 rounded-lg border border-base-700 bg-base-900 px-3 py-2 text-sm text-base-100"
                  >
                    <option value="" disabled>
                      Wybierz…
                    </option>
                    {pilotCase.epistemicLayers.map((layer) => (
                      <option key={layer.id} value={layer.id}>
                        {layer.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col text-xs text-base-400">
                  Warstwa drugorzędna
                  <select
                    value={answer.secondary}
                    onChange={(e) =>
                      setAnswer(task.segmentId, {
                        secondary: e.target.value as EpistemicLayerId | typeof NO_SECONDARY,
                      })
                    }
                    className="mt-1 min-h-11 rounded-lg border border-base-700 bg-base-900 px-3 py-2 text-sm text-base-100"
                  >
                    <option value={NO_SECONDARY}>Brak</option>
                    {pilotCase.epistemicLayers.map((layer) => (
                      <option key={layer.id} value={layer.id}>
                        {layer.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {graded && grade && (
                <p
                  className={clsx(
                    'mt-3 text-sm font-medium',
                    grade.correct ? 'text-emerald-300' : 'text-danger-400'
                  )}
                >
                  {grade.correct
                    ? 'Poprawnie.'
                    : 'Niepoprawnie — sprawdź definicje warstw powyżej.'}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button
          type="button"
          disabled={!allAnswered}
          onClick={() => setGraded(true)}
          className="min-h-11 rounded-xl bg-accent-500 px-5 py-2 text-sm font-semibold text-base-950 transition hover:bg-accent-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Sprawdź klasyfikację
        </button>
        {graded && (
          <p className="text-sm text-base-200">
            Wynik: <strong>{score}</strong> / {tasks.length}
          </p>
        )}
      </div>
    </article>
  );
}
