import type { ClaimId, EvidenceRelationType, PilotCase, SourceGroupId, SourceId } from '../types';
import {
  findDocumentForSegment,
  indexRepeatsBySource,
  indexSegmentsById,
  resolveOriginSegmentId,
} from './graph';
import type {
  ClaimSupportContribution,
  ClaimSupportResult,
  IndependentSourcesAuditResult,
} from './types';

/** Relation types that count as material actually bearing on whether a claim is true. */
const SUPPORTING_RELATION_TYPES: readonly EvidenceRelationType[] = [
  'SUPPORTS',
  'SUPPORTS_EXISTENCE_OF_ALLEGATION',
];

const NON_RESOLVING_RELATION_TYPES: readonly EvidenceRelationType[] = ['DOES_NOT_RESOLVE'];

function findGroupIdForSource(pilotCase: PilotCase, sourceId: SourceId): SourceGroupId | null {
  return pilotCase.sourceGroups.find((group) => group.originSourceId === sourceId)?.id ?? null;
}

function distinct<T>(values: T[]): T[] {
  return [...new Set(values)];
}

/**
 * Computes, from raw segments and relations alone, how many *independent* origin sources
 * actually support a claim. Segments that merely REPEATS an earlier account are resolved
 * back to their root before counting, so an allegation echoed across three documents by
 * one witness still counts as one source — the core anti-inflation check of an evidence audit.
 */
export function computeClaimSupport(pilotCase: PilotCase, claimId: ClaimId): ClaimSupportResult {
  const segmentsById = indexSegmentsById(pilotCase);
  const repeatsBySource = indexRepeatsBySource(pilotCase.evidenceRelations);

  const buildContribution = (
    relation: (typeof pilotCase.evidenceRelations)[number]
  ): ClaimSupportContribution => {
    const segment = segmentsById.get(relation.fromId);
    if (!segment) {
      throw new Error(`Relation ${relation.id} references unknown segment ${relation.fromId}.`);
    }

    const originSegmentId = resolveOriginSegmentId(relation.fromId, repeatsBySource);
    const originSegment = segmentsById.get(originSegmentId);
    if (!originSegment) {
      throw new Error(
        `Segment ${relation.fromId} resolves to unknown origin segment ${originSegmentId}.`
      );
    }

    const document = findDocumentForSegment(pilotCase, relation.fromId);
    const originSourceId = originSegment.originSourceId;

    return {
      segmentId: relation.fromId,
      documentId: document?.id ?? '',
      relationId: relation.id,
      relationType: relation.relationType,
      originSegmentId,
      originSourceId,
      sourceGroupId: findGroupIdForSource(pilotCase, originSourceId),
    };
  };

  const relationsForClaim = pilotCase.evidenceRelations.filter(
    (relation) => relation.toId === claimId
  );

  const supportingContributions = relationsForClaim
    .filter((relation) => SUPPORTING_RELATION_TYPES.includes(relation.relationType))
    .map(buildContribution);

  const nonResolvingContributions = relationsForClaim
    .filter((relation) => NON_RESOLVING_RELATION_TYPES.includes(relation.relationType))
    .map(buildContribution);

  const supportingSourceIds = distinct(supportingContributions.map((c) => c.originSourceId));
  const nonResolvingSourceIds = distinct(nonResolvingContributions.map((c) => c.originSourceId));

  return {
    claimId,
    supportingContributions,
    nonResolvingContributions,
    supportingSourceIds,
    nonResolvingSourceIds,
    supportingGroupIds: distinct(
      supportingContributions
        .map((c) => c.sourceGroupId)
        .filter((id): id is SourceGroupId => id !== null)
    ),
    nonResolvingGroupIds: distinct(
      nonResolvingContributions
        .map((c) => c.sourceGroupId)
        .filter((id): id is SourceGroupId => id !== null)
    ),
    independentSupportingCount: supportingSourceIds.length,
  };
}

function sameSet(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const setB = new Set(b);
  return a.every((value) => setB.has(value));
}

/**
 * Runs the independent-sources task described in a case's `auditTasks.independentSources`
 * and checks the derived answer against the authored expectation, so a case file that
 * claims "1 independent source" is held to the same graph logic a learner would be.
 */
export function auditIndependentSources(pilotCase: PilotCase): IndependentSourcesAuditResult {
  const task = pilotCase.auditTasks.independentSources;
  const actual = computeClaimSupport(pilotCase, task.claimId);

  const mismatches: string[] = [];

  if (actual.independentSupportingCount !== task.expectedSupportingIndependentCount) {
    mismatches.push(
      `expected ${task.expectedSupportingIndependentCount} independent supporting source(s), computed ${actual.independentSupportingCount}`
    );
  }
  if (!sameSet(actual.supportingGroupIds, task.expectedSupportingGroupIds)) {
    mismatches.push(
      `expected supporting groups [${task.expectedSupportingGroupIds.join(', ')}], computed [${actual.supportingGroupIds.join(', ')}]`
    );
  }
  if (!sameSet(actual.nonResolvingGroupIds, task.expectedNonResolvingGroupIds)) {
    mismatches.push(
      `expected non-resolving groups [${task.expectedNonResolvingGroupIds.join(', ')}], computed [${actual.nonResolvingGroupIds.join(', ')}]`
    );
  }

  return { actual, pass: mismatches.length === 0, mismatches };
}

/**
 * Grades a learner's own selection of "independently supporting" source groups for a
 * claim against the groups the graph actually derives — the check the interactive
 * exercise UI runs when someone submits an answer.
 */
export function gradeIndependentSourcesSubmission(
  pilotCase: PilotCase,
  claimId: ClaimId,
  submittedGroupIds: SourceGroupId[]
): { correct: boolean; actual: ClaimSupportResult } {
  const actual = computeClaimSupport(pilotCase, claimId);
  return { correct: sameSet(submittedGroupIds, actual.supportingGroupIds), actual };
}
