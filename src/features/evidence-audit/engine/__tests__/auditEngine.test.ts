import { describe, expect, it } from 'vitest';

import type { EvidenceRelation, PilotCase } from '../../types';
import { auditCase, auditRepeatsIntegrity } from '../auditEngine';

async function loadPilotCase(): Promise<PilotCase> {
  const rawCase = (await import('../../cases/case-0-pilot.json')).default;
  return rawCase as unknown as PilotCase;
}

describe('auditRepeatsIntegrity', () => {
  it('finds the pilot case REPEATS graph free of cycles', async () => {
    const pilotCase = await loadPilotCase();
    expect(auditRepeatsIntegrity(pilotCase)).toEqual({ pass: true, cycles: [] });
  });

  it('reports a cycle if one is introduced into the REPEATS graph', async () => {
    const pilotCase = await loadPilotCase();
    const loopRelation: EvidenceRelation = {
      id: 'R-INJECTED',
      fromId: 'D001:S003',
      toId: 'D002:S002',
      relationType: 'REPEATS',
      strength: 'strong',
      explanation: 'synthetic loop for testing',
    };
    const mutated: PilotCase = {
      ...pilotCase,
      evidenceRelations: [...pilotCase.evidenceRelations, loopRelation],
    };

    const result = auditRepeatsIntegrity(mutated);
    expect(result.pass).toBe(false);
    expect(result.cycles.length).toBeGreaterThan(0);
  });
});

describe('auditCase — case-0-pilot.json end to end', () => {
  it('passes the full audit: independent sources, layer classification, and REPEATS integrity', async () => {
    const pilotCase = await loadPilotCase();
    const report = auditCase(pilotCase);

    expect(report.independentSources.pass).toBe(true);
    expect(report.layerClassification.pass).toBe(true);
    expect(report.repeatsIntegrity.pass).toBe(true);
    expect(report.pass).toBe(true);
  });

  it('flags the overall report as failing when any single sub-check fails', async () => {
    const pilotCase = await loadPilotCase();
    const mutated: PilotCase = {
      ...pilotCase,
      auditTasks: {
        ...pilotCase.auditTasks,
        independentSources: {
          ...pilotCase.auditTasks.independentSources,
          expectedSupportingIndependentCount: 99,
        },
      },
    };

    const report = auditCase(mutated);
    expect(report.independentSources.pass).toBe(false);
    expect(report.pass).toBe(false);
  });
});
