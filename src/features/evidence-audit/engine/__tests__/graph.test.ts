import { describe, expect, it } from 'vitest';

import type { EvidenceRelation } from '../../types';
import {
  RepeatsCycleError,
  detectRepeatsCycles,
  indexRepeatsBySource,
  resolveOriginSegmentId,
} from '../graph';

function repeats(id: string, fromId: string, toId: string): EvidenceRelation {
  return { id, fromId, toId, relationType: 'REPEATS', strength: 'strong', explanation: '' };
}

describe('indexRepeatsBySource', () => {
  it('rejects a segment with two outgoing REPEATS relations', () => {
    const relations = [repeats('R1', 'S1', 'S2'), repeats('R2', 'S1', 'S3')];
    expect(() => indexRepeatsBySource(relations)).toThrow(/more than one outgoing REPEATS/);
  });
});

describe('resolveOriginSegmentId', () => {
  it('returns the segment itself when it has no outgoing REPEATS relation', () => {
    const repeatsBySource = indexRepeatsBySource([]);
    expect(resolveOriginSegmentId('S1', repeatsBySource)).toBe('S1');
  });

  it('walks a single REPEATS hop to the root', () => {
    const repeatsBySource = indexRepeatsBySource([repeats('R1', 'S2', 'S1')]);
    expect(resolveOriginSegmentId('S2', repeatsBySource)).toBe('S1');
  });

  it('walks a multi-hop REPEATS chain to the ultimate root', () => {
    const repeatsBySource = indexRepeatsBySource([
      repeats('R1', 'S3', 'S2'),
      repeats('R2', 'S2', 'S1'),
    ]);
    expect(resolveOriginSegmentId('S3', repeatsBySource)).toBe('S1');
    expect(resolveOriginSegmentId('S2', repeatsBySource)).toBe('S1');
  });

  it('throws RepeatsCycleError when a chain loops back on itself', () => {
    const repeatsBySource = indexRepeatsBySource([
      repeats('R1', 'S1', 'S2'),
      repeats('R2', 'S2', 'S3'),
      repeats('R3', 'S3', 'S1'),
    ]);
    expect(() => resolveOriginSegmentId('S1', repeatsBySource)).toThrow(RepeatsCycleError);
  });
});

describe('detectRepeatsCycles', () => {
  it('reports no cycles for an acyclic REPEATS graph', () => {
    const relations = [repeats('R1', 'S3', 'S2'), repeats('R2', 'S2', 'S1')];
    expect(detectRepeatsCycles(relations)).toEqual([]);
  });

  it('unmasks a REPEATS loop that never reaches a root segment', () => {
    const relations = [
      repeats('R1', 'S1', 'S2'),
      repeats('R2', 'S2', 'S3'),
      repeats('R3', 'S3', 'S1'),
    ];
    const cycles = detectRepeatsCycles(relations);
    expect(cycles).toHaveLength(1);
    expect(new Set(cycles[0].segmentIds)).toEqual(new Set(['S1', 'S2', 'S3']));
  });

  it('finds a cycle even when a non-cyclic chain feeds into it', () => {
    const relations = [
      repeats('R1', 'S0', 'S1'),
      repeats('R2', 'S1', 'S2'),
      repeats('R3', 'S2', 'S1'),
    ];
    const cycles = detectRepeatsCycles(relations);
    expect(cycles).toHaveLength(1);
    expect(new Set(cycles[0].segmentIds)).toEqual(new Set(['S1', 'S2']));
  });
});
