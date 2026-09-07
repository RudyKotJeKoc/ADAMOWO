export type CaseId = string;
export type SourceId = string;
export type DocumentId = string;
export type SegmentId = string;
export type ClaimId = string;
export type RelationId = string;
export type SourceGroupId = string;

export type SourceKind = 'person' | 'institution' | 'system';
export type SourceRole =
  | 'reporting-party'
  | 'accused-party'
  | 'hearsay-witness'
  | 'public-official'
  | 'automated-source';

export type EpistemicLayerId =
  | 'direct-observation'
  | 'party-claim'
  | 'official-finding'
  | 'motive-inference'
  | 'metadata';

export type DocumentType = 'reported-complaint' | 'witness-statement' | 'police-intervention-note';

export type LegalRigorCategory =
  | 'official-record-of-party-statement'
  | 'formal-witness-statement'
  | 'official-observation-and-reported-content';

export type ClaimType = 'event' | 'causation' | 'motive' | 'presence' | 'source-competence';

export type ExpectedAssessment =
  | 'supported'
  | 'unsupported'
  | 'weakened'
  | 'contradicted'
  | 'not-resolved';

export type EvidenceRelationType =
  | 'REPEATS'
  | 'SUPPORTS'
  | 'SUPPORTS_EXISTENCE_OF_ALLEGATION'
  | 'WEAKENS'
  | 'CONTRADICTS'
  | 'DOES_NOT_RESOLVE'
  | 'QUALIFIES';

export type EvidenceStrength = 'none' | 'weak' | 'medium' | 'strong';

export interface SourceNode {
  id: SourceId;
  label: string;
  kind: SourceKind;
  role: SourceRole;
  description: string;
}

export interface EpistemicLayerDefinition {
  id: EpistemicLayerId;
  label: string;
  definition: string;
  colorToken: string;
  icon: 'eye' | 'message' | 'stamp' | 'question' | 'clock';
}

export interface LegalRigor {
  category: LegalRigorCategory;
  description: string;
  proves: string[];
  doesNotProve: string[];
}

export interface TimeRange {
  from: string;
  to: string;
}

export interface EvidenceClaim {
  id: ClaimId;
  text: string;
  claimType: ClaimType;
  subjectSourceId: SourceId | null;
  timeRange: TimeRange | null;
  expectedAssessment: ExpectedAssessment;
}

export interface EvidenceSegment {
  id: SegmentId;
  text: string;
  speakerSourceId: SourceId | null;
  originSourceId: SourceId;
  epistemicLayer: EpistemicLayerId;
  secondaryLayer?: EpistemicLayerId;
  claimIds: ClaimId[];
  directKnowledge: boolean;
}

export interface EvidenceDocument {
  id: DocumentId;
  title: string;
  documentType: DocumentType;
  createdAt: string;
  eventTime: string | null;
  authorSourceId: SourceId;
  speakerSourceIds: SourceId[];
  legalRigor: LegalRigor;
  sourceGroupIds: SourceGroupId[];
  segments: EvidenceSegment[];
}

export interface SourceGroup {
  id: SourceGroupId;
  label: string;
  originSourceId: SourceId;
  memberSegmentIds: SegmentId[];
  independentForClaimIds: ClaimId[];
  explanation: string;
}

export interface EvidenceRelation {
  id: RelationId;
  fromId: SegmentId;
  toId: ClaimId | SegmentId;
  relationType: EvidenceRelationType;
  strength: EvidenceStrength;
  explanation: string;
}

export interface IndependentSourcesTask {
  claimId: ClaimId;
  expectedSupportingGroupIds: SourceGroupId[];
  expectedNonResolvingGroupIds: SourceGroupId[];
  expectedSupportingIndependentCount: number;
}

export interface LayerClassificationTask {
  segmentId: SegmentId;
  expectedPrimaryLayer: EpistemicLayerId;
  expectedSecondaryLayer?: EpistemicLayerId;
}

export interface PilotCase {
  schemaVersion: '1.0.0';
  case: {
    id: CaseId;
    slug: string;
    title: string;
    subtitle: string;
    language: 'pl';
    caseType: 'synthetic-training';
    publicationStatus: 'training-only';
    estimatedMinutes: number;
    disclaimer: string;
    auditQuestion: string;
    primaryClaimId: ClaimId;
  };
  sources: SourceNode[];
  epistemicLayers: EpistemicLayerDefinition[];
  claims: EvidenceClaim[];
  documents: EvidenceDocument[];
  sourceGroups: SourceGroup[];
  evidenceRelations: EvidenceRelation[];
  auditTasks: {
    independentSources: IndependentSourcesTask;
    layerClassification: LayerClassificationTask[];
  };
}
