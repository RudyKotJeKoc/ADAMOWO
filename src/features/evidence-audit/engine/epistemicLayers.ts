import type { EpistemicLayerId, PilotCase, SegmentId } from '../types';
import { indexSegmentsById } from './graph';
import type { LayerClassificationAuditResult, LayerClassificationCheck } from './types';

/** Reads back the authored epistemic-layer classification of one segment. */
export function getSegmentLayers(
  pilotCase: PilotCase,
  segmentId: SegmentId
): { primary: EpistemicLayerId; secondary: EpistemicLayerId | null } {
  const segment = indexSegmentsById(pilotCase).get(segmentId);
  if (!segment) {
    throw new Error(`Unknown segment ${segmentId}.`);
  }
  return { primary: segment.epistemicLayer, secondary: segment.secondaryLayer ?? null };
}

/**
 * Grades a submitted (primary, secondary) classification for a segment against the
 * segment's authored layers — the check a learner's answer is scored against in the UI.
 */
export function checkSubmittedClassification(
  pilotCase: PilotCase,
  segmentId: SegmentId,
  submittedPrimary: EpistemicLayerId,
  submittedSecondary?: EpistemicLayerId | null
): { correct: boolean; correctPrimary: boolean; correctSecondary: boolean } {
  const actual = getSegmentLayers(pilotCase, segmentId);
  const correctPrimary = submittedPrimary === actual.primary;
  const correctSecondary = (submittedSecondary ?? null) === actual.secondary;
  return { correct: correctPrimary && correctSecondary, correctPrimary, correctSecondary };
}

function checkLayerClassificationTask(
  pilotCase: PilotCase,
  task: PilotCase['auditTasks']['layerClassification'][number]
): LayerClassificationCheck {
  const mismatches: string[] = [];
  let actualPrimaryLayer: EpistemicLayerId | null = null;
  let actualSecondaryLayer: EpistemicLayerId | null = null;

  try {
    const actual = getSegmentLayers(pilotCase, task.segmentId);
    actualPrimaryLayer = actual.primary;
    actualSecondaryLayer = actual.secondary;

    if (actual.primary !== task.expectedPrimaryLayer) {
      mismatches.push(
        `expected primary layer '${task.expectedPrimaryLayer}', got '${actual.primary}'`
      );
    }
    const expectedSecondary = task.expectedSecondaryLayer ?? null;
    if (actual.secondary !== expectedSecondary) {
      mismatches.push(
        `expected secondary layer '${expectedSecondary ?? 'none'}', got '${actual.secondary ?? 'none'}'`
      );
    }
  } catch (error) {
    mismatches.push(error instanceof Error ? error.message : String(error));
  }

  return {
    segmentId: task.segmentId,
    pass: mismatches.length === 0,
    expectedPrimaryLayer: task.expectedPrimaryLayer,
    expectedSecondaryLayer: task.expectedSecondaryLayer ?? null,
    actualPrimaryLayer,
    actualSecondaryLayer,
    mismatches,
  };
}

/**
 * Validates every `auditTasks.layerClassification` entry in a case against the segments'
 * authored layers, catching cases where the answer key and the segment data have drifted.
 */
export function auditLayerClassification(pilotCase: PilotCase): LayerClassificationAuditResult {
  const checks = pilotCase.auditTasks.layerClassification.map((task) =>
    checkLayerClassificationTask(pilotCase, task)
  );
  return { checks, pass: checks.every((check) => check.pass) };
}
