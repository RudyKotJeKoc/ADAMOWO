import type { PilotCase } from '../types';
import { auditLayerClassification } from './epistemicLayers';
import { detectRepeatsCycles } from './graph';
import { auditIndependentSources } from './independentSources';
import type { CaseAuditReport, RepeatsIntegrityResult } from './types';

/** Checks the REPEATS graph of a case for cycles — a malformed chain that never reaches a root. */
export function auditRepeatsIntegrity(pilotCase: PilotCase): RepeatsIntegrityResult {
  const cycles = detectRepeatsCycles(pilotCase.evidenceRelations);
  return { pass: cycles.length === 0, cycles };
}

/**
 * Runs the full evidence-audit engine over a case: independent-source counting,
 * REPEATS-loop integrity, and epistemic-layer classification. This is both the grading
 * engine for a learner's answers and a self-consistency check for the case's answer key.
 */
export function auditCase(pilotCase: PilotCase): CaseAuditReport {
  const independentSources = auditIndependentSources(pilotCase);
  const layerClassification = auditLayerClassification(pilotCase);
  const repeatsIntegrity = auditRepeatsIntegrity(pilotCase);

  return {
    independentSources,
    layerClassification,
    repeatsIntegrity,
    pass: independentSources.pass && layerClassification.pass && repeatsIntegrity.pass,
  };
}
