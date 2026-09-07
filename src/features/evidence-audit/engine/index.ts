export { auditCase, auditRepeatsIntegrity } from './auditEngine';
export {
  checkSubmittedClassification,
  getSegmentLayers,
  auditLayerClassification,
} from './epistemicLayers';
export {
  auditIndependentSources,
  computeClaimSupport,
  gradeIndependentSourcesSubmission,
} from './independentSources';
export {
  detectRepeatsCycles,
  findDocumentForSegment,
  indexSegmentsById,
  resolveOriginSegmentId,
  RepeatsCycleError,
} from './graph';
export type {
  CaseAuditReport,
  ClaimSupportContribution,
  ClaimSupportResult,
  IndependentSourcesAuditResult,
  LayerClassificationAuditResult,
  LayerClassificationCheck,
  RepeatsCycle,
  RepeatsIntegrityResult,
} from './types';
