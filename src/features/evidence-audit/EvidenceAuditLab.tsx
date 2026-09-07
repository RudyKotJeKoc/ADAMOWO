import clsx from 'clsx';

import rawCase from './cases/case-0-pilot.json';
import { EngineAuditPanel } from './components/EngineAuditPanel';
import { IndependentSourcesExercise } from './components/IndependentSourcesExercise';
import { LayerClassificationExercise } from './components/LayerClassificationExercise';
import type { EpistemicLayerId, PilotCase } from './types';

const pilotCase = rawCase as unknown as PilotCase;

const LAYER_BADGE_CLASSES: Record<string, string> = {
  cyan: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300',
  blue: 'border-blue-500/40 bg-blue-500/10 text-blue-300',
  violet: 'border-violet-500/40 bg-violet-500/10 text-violet-300',
  amber: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  slate: 'border-slate-500/40 bg-slate-500/10 text-slate-300',
};

function LayerBadge({
  layerId,
  pilotCase: currentCase,
}: {
  layerId: EpistemicLayerId;
  pilotCase: PilotCase;
}): JSX.Element {
  const layer = currentCase.epistemicLayers.find((l) => l.id === layerId);
  if (!layer) return <></>;
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        LAYER_BADGE_CLASSES[layer.colorToken] ?? LAYER_BADGE_CLASSES.slate
      )}
    >
      {layer.label}
    </span>
  );
}

export default function EvidenceAuditLab(): JSX.Element {
  return (
    <section className="space-y-10">
      <header className="space-y-3">
        <p className="inline-flex items-center rounded-full bg-accent-500/10 px-3 py-1 text-sm font-semibold text-accent-200">
          Laboratorium dowodów · przypadek treningowy
        </p>
        <h1 className="text-3xl font-bold text-base-50 sm:text-4xl">{pilotCase.case.title}</h1>
        <p className="max-w-3xl text-lg leading-relaxed text-base-200">{pilotCase.case.subtitle}</p>
        <p className="max-w-3xl rounded-xl border border-base-800 bg-base-900/50 p-4 text-sm text-base-400">
          {pilotCase.case.disclaimer}
        </p>
        <p className="max-w-3xl text-base font-medium text-base-100">
          Pytanie audytowe: <span className="text-accent-200">{pilotCase.case.auditQuestion}</span>
        </p>
      </header>

      <div className="rounded-2xl border border-base-800 bg-base-900/70 p-6">
        <h2 className="text-lg font-semibold text-base-100">Źródła w sprawie</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {pilotCase.sources.map((source) => (
            <li
              key={source.id}
              className="rounded-xl border border-base-800 bg-base-950/50 p-3 text-sm"
            >
              <p className="font-semibold text-base-100">{source.label}</p>
              <p className="mt-1 text-base-400">{source.description}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-base-800 bg-base-900/70 p-6">
        <h2 className="text-lg font-semibold text-base-100">Dokumenty</h2>
        <div className="mt-4 space-y-6">
          {pilotCase.documents.map((document) => (
            <div key={document.id} className="rounded-xl border border-base-800 bg-base-950/40 p-4">
              <p className="text-sm font-semibold text-base-100">{document.title}</p>
              <p className="mt-1 text-xs text-base-500">{document.legalRigor.description}</p>
              <ul className="mt-3 space-y-2">
                {document.segments.map((segment) => (
                  <li
                    key={segment.id}
                    className="flex flex-col gap-1 border-t border-base-800/60 pt-2 first:border-t-0 first:pt-0"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <LayerBadge layerId={segment.epistemicLayer} pilotCase={pilotCase} />
                      {segment.secondaryLayer && (
                        <LayerBadge layerId={segment.secondaryLayer} pilotCase={pilotCase} />
                      )}
                    </div>
                    <p className="text-sm text-base-300">{segment.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <IndependentSourcesExercise pilotCase={pilotCase} />
      <LayerClassificationExercise pilotCase={pilotCase} />
      <EngineAuditPanel pilotCase={pilotCase} />
    </section>
  );
}
