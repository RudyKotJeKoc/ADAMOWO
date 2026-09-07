import type {
  ClaimId,
  EpistemicLayerId,
  EvidenceRelationType,
  SegmentId,
  SourceGroupId,
  SourceId,
} from '../types';

/** One resolved contribution toward a claim: a segment traced back to its origin source. */
export interface ClaimSupportContribution {
  segmentId: SegmentId;
  documentId: string;
  relationId: string;
  relationType: EvidenceRelationType;
  /** Root segment reached after walking every REPEATS edge from `segmentId`. */
  originSegmentId: SegmentId;
  originSourceId: SourceId;
  sourceGroupId: SourceGroupId | null;
}

/** Independent-source analysis for a single claim, derived from segments and relations. */
export interface ClaimSupportResult {
  claimId: ClaimId;
  supportingContributions: ClaimSupportContribution[];
  nonResolvingContributions: ClaimSupportContribution[];
  /** Distinct origin sources whose testimony actually bears on the claim. */
  supportingSourceIds: SourceId[];
  /** Distinct origin sources whose material does not resolve the claim either way. */
  nonResolvingSourceIds: SourceId[];
  supportingGroupIds: SourceGroupId[];
  nonResolvingGroupIds: SourceGroupId[];
  /** The number that matters: how many *independent* origins actually support the claim. */
  independentSupportingCount: number;
}

export interface IndependentSourcesAuditResult {
  actual: ClaimSupportResult;
  pass: boolean;
  mismatches: string[];
}

export interface LayerClassificationCheck {
  segmentId: SegmentId;
  pass: boolean;
  expectedPrimaryLayer: EpistemicLayerId;
  expectedSecondaryLayer: EpistemicLayerId | null;
  actualPrimaryLayer: EpistemicLayerId | null;
  actualSecondaryLayer: EpistemicLayerId | null;
  mismatches: string[];
}

export interface LayerClassificationAuditResult {
  checks: LayerClassificationCheck[];
  pass: boolean;
}

/** A REPEATS chain that loops back on itself instead of terminating at a root segment. */
export interface RepeatsCycle {
  segmentIds: SegmentId[];
}

export interface RepeatsIntegrityResult {
  pass: boolean;
  cycles: RepeatsCycle[];
}

export interface CaseAuditReport {
  independentSources: IndependentSourcesAuditResult;
  layerClassification: LayerClassificationAuditResult;
  repeatsIntegrity: RepeatsIntegrityResult;
  pass: boolean;
}
