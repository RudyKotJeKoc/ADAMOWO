import { describe, expect, it } from 'vitest';

import type { PilotCase } from '../../types';
import {
  auditLayerClassification,
  checkSubmittedClassification,
  getSegmentLayers,
} from '../epistemicLayers';

async function loadPilotCase(): Promise<PilotCase> {
  const rawCase = (await import('../../cases/case-0-pilot.json')).default;
  return rawCase as unknown as PilotCase;
}

describe('getSegmentLayers', () => {
  it('reads the primary and secondary layer of a segment that has both', async () => {
    const pilotCase = await loadPilotCase();
    expect(getSegmentLayers(pilotCase, 'D001:S003')).toEqual({
      primary: 'party-claim',
      secondary: 'motive-inference',
    });
  });

  it('returns null secondary layer when a segment has only a primary layer', async () => {
    const pilotCase = await loadPilotCase();
    expect(getSegmentLayers(pilotCase, 'D003:S002')).toEqual({
      primary: 'direct-observation',
      secondary: null,
    });
  });

  it('throws for an unknown segment id', async () => {
    const pilotCase = await loadPilotCase();
    expect(() => getSegmentLayers(pilotCase, 'DOES-NOT-EXIST')).toThrow(/Unknown segment/);
  });
});

describe('checkSubmittedClassification', () => {
  it('grades a fully correct submission as correct', async () => {
    const pilotCase = await loadPilotCase();
    const grade = checkSubmittedClassification(
      pilotCase,
      'D001:S003',
      'party-claim',
      'motive-inference'
    );
    expect(grade).toEqual({ correct: true, correctPrimary: true, correctSecondary: true });
  });

  it('flags a plausible but wrong primary layer — direct observation mistaken for a party claim', async () => {
    const pilotCase = await loadPilotCase();
    const grade = checkSubmittedClassification(pilotCase, 'D003:S002', 'party-claim');
    expect(grade.correctPrimary).toBe(false);
    expect(grade.correct).toBe(false);
  });

  it('flags a missed secondary layer even when the primary layer is right', async () => {
    const pilotCase = await loadPilotCase();
    const grade = checkSubmittedClassification(pilotCase, 'D001:S003', 'party-claim');
    expect(grade.correctPrimary).toBe(true);
    expect(grade.correctSecondary).toBe(false);
    expect(grade.correct).toBe(false);
  });
});

describe('auditLayerClassification — case-0-pilot.json', () => {
  it('passes every authored layer-classification task', async () => {
    const pilotCase = await loadPilotCase();
    const result = auditLayerClassification(pilotCase);

    expect(result.checks).toHaveLength(6);
    expect(result.checks.every((check) => check.pass)).toBe(true);
    expect(result.pass).toBe(true);
  });

  it('fails a task when the segment data drifts from the answer key', async () => {
    const pilotCase = await loadPilotCase();
    const mutated: PilotCase = {
      ...pilotCase,
      documents: pilotCase.documents.map((document) =>
        document.id === 'D003'
          ? {
              ...document,
              segments: document.segments.map((segment) =>
                segment.id === 'D003:S002' ? { ...segment, epistemicLayer: 'party-claim' } : segment
              ),
            }
          : document
      ),
    };

    const result = auditLayerClassification(mutated);
    const failing = result.checks.find((check) => check.segmentId === 'D003:S002');

    expect(result.pass).toBe(false);
    expect(failing?.pass).toBe(false);
    expect(failing?.mismatches[0]).toMatch(/expected primary layer 'direct-observation'/);
  });
});
