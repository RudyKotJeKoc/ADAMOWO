import type {
  EvidenceDocument,
  EvidenceRelation,
  EvidenceSegment,
  PilotCase,
  SegmentId,
} from '../types';
import type { RepeatsCycle } from './types';

/** Thrown when a REPEATS chain loops back on itself instead of reaching a root segment. */
export class RepeatsCycleError extends Error {
  readonly cycle: SegmentId[];

  constructor(cycle: SegmentId[]) {
    super(`REPEATS cycle detected: ${cycle.join(' -> ')}`);
    this.name = 'RepeatsCycleError';
    this.cycle = cycle;
  }
}

/** Flattens every segment across every document in a case into one array. */
export function flattenSegments(pilotCase: PilotCase): EvidenceSegment[] {
  return pilotCase.documents.flatMap((document) => document.segments);
}

/** Indexes every segment in a case by its id for O(1) lookup. */
export function indexSegmentsById(pilotCase: PilotCase): Map<SegmentId, EvidenceSegment> {
  const index = new Map<SegmentId, EvidenceSegment>();
  for (const segment of flattenSegments(pilotCase)) {
    index.set(segment.id, segment);
  }
  return index;
}

/** Finds the document that owns a given segment id. */
export function findDocumentForSegment(
  pilotCase: PilotCase,
  segmentId: SegmentId
): EvidenceDocument | undefined {
  return pilotCase.documents.find((document) =>
    document.segments.some((segment) => segment.id === segmentId)
  );
}

/**
 * Indexes REPEATS relations by their source segment.
 * A segment can REPEATS at most one other segment; that constraint is what lets a chain resolve.
 */
export function indexRepeatsBySource(
  relations: EvidenceRelation[]
): Map<SegmentId, EvidenceRelation> {
  const index = new Map<SegmentId, EvidenceRelation>();
  for (const relation of relations) {
    if (relation.relationType !== 'REPEATS') continue;
    if (index.has(relation.fromId)) {
      throw new Error(`Segment ${relation.fromId} has more than one outgoing REPEATS relation.`);
    }
    index.set(relation.fromId, relation);
  }
  return index;
}

/**
 * Walks the REPEATS chain starting at `segmentId` until it reaches a segment with no
 * outgoing REPEATS relation (the root — the segment that actually originates the account).
 * This is the "unmasking" step: three documents echoing one witness must resolve to one root,
 * not be counted as three independent segments.
 */
export function resolveOriginSegmentId(
  segmentId: SegmentId,
  repeatsBySource: Map<SegmentId, EvidenceRelation>
): SegmentId {
  const visited = new Set<SegmentId>();
  let current = segmentId;

  while (repeatsBySource.has(current)) {
    if (visited.has(current)) {
      throw new RepeatsCycleError([...visited, current]);
    }
    visited.add(current);
    current = repeatsBySource.get(current)!.toId;
  }

  return current;
}

/**
 * Scans the full REPEATS graph for cycles without throwing, so a malformed case can be
 * reported diagnostically instead of crashing the caller.
 */
export function detectRepeatsCycles(relations: EvidenceRelation[]): RepeatsCycle[] {
  const repeatsBySource = new Map<SegmentId, EvidenceRelation>();
  for (const relation of relations) {
    if (relation.relationType !== 'REPEATS') continue;
    if (!repeatsBySource.has(relation.fromId)) {
      repeatsBySource.set(relation.fromId, relation);
    }
  }

  const cycles: RepeatsCycle[] = [];
  const globallySeen = new Set<SegmentId>();

  for (const start of repeatsBySource.keys()) {
    if (globallySeen.has(start)) continue;

    const path: SegmentId[] = [];
    const pathIndex = new Map<SegmentId, number>();
    let current: SegmentId | undefined = start;

    while (current !== undefined && !globallySeen.has(current)) {
      if (pathIndex.has(current)) {
        cycles.push({ segmentIds: path.slice(pathIndex.get(current)!).concat(current) });
        break;
      }
      pathIndex.set(current, path.length);
      path.push(current);
      current = repeatsBySource.get(current)?.toId;
    }

    for (const id of path) globallySeen.add(id);
  }

  return cycles;
}
