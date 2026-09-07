import { describe, expect, it } from 'vitest';

import type {
  EvidenceDocument,
  EvidenceRelation,
  PilotCase,
  SourceGroup,
  SourceNode,
} from '../../types';
import {
  auditIndependentSources,
  computeClaimSupport,
  gradeIndependentSourcesSubmission,
} from '../independentSources';

function makeSource(id: string): SourceNode {
  return { id, label: id, kind: 'person', role: 'reporting-party', description: '' };
}

function makeSegment(
  id: string,
  originSourceId: string,
  claimIds: string[]
): EvidenceDocument['segments'][number] {
  return {
    id,
    text: '',
    speakerSourceId: originSourceId,
    originSourceId,
    epistemicLayer: 'party-claim',
    claimIds,
    directKnowledge: true,
  };
}

function makeDocument(id: string, segments: EvidenceDocument['segments']): EvidenceDocument {
  return {
    id,
    title: id,
    documentType: 'witness-statement',
    createdAt: '2026-01-01T00:00:00+01:00',
    eventTime: null,
    authorSourceId: 'X',
    speakerSourceIds: [],
    legalRigor: {
      category: 'formal-witness-statement',
      description: '',
      proves: [],
      doesNotProve: [],
    },
    sourceGroupIds: [],
    segments,
  };
}

function makeGroup(id: string, originSourceId: string): SourceGroup {
  return {
    id,
    label: id,
    originSourceId,
    memberSegmentIds: [],
    independentForClaimIds: [],
    explanation: '',
  };
}

/** Builds a minimal well-formed PilotCase around the given documents/relations/groups for isolated math tests. */
function buildCase(options: {
  sources: string[];
  documents: EvidenceDocument[];
  relations: EvidenceRelation[];
  groups: SourceGroup[];
}): PilotCase {
  return {
    schemaVersion: '1.0.0',
    case: {
      id: 'case-test',
      slug: 'test',
      title: 'Test',
      subtitle: '',
      language: 'pl',
      caseType: 'synthetic-training',
      publicationStatus: 'training-only',
      estimatedMinutes: 1,
      disclaimer: '',
      auditQuestion: '',
      primaryClaimId: 'C1',
    },
    sources: options.sources.map(makeSource),
    epistemicLayers: [],
    claims: [
      {
        id: 'C1',
        text: '',
        claimType: 'event',
        subjectSourceId: null,
        timeRange: null,
        expectedAssessment: 'not-resolved',
      },
    ],
    documents: options.documents,
    sourceGroups: options.groups,
    evidenceRelations: options.relations,
    auditTasks: {
      independentSources: {
        claimId: 'C1',
        expectedSupportingGroupIds: [],
        expectedNonResolvingGroupIds: [],
        expectedSupportingIndependentCount: 0,
      },
      layerClassification: [],
    },
  };
}

describe('computeClaimSupport — pure math on synthetic cases', () => {
  it('counts each independent source once when nothing repeats', () => {
    const pilotCase = buildCase({
      sources: ['A', 'B', 'C'],
      documents: [
        makeDocument('D1', [makeSegment('D1:S1', 'A', ['C1'])]),
        makeDocument('D2', [makeSegment('D2:S1', 'B', ['C1'])]),
        makeDocument('D3', [makeSegment('D3:S1', 'C', ['C1'])]),
      ],
      relations: [
        {
          id: 'R1',
          fromId: 'D1:S1',
          toId: 'C1',
          relationType: 'SUPPORTS',
          strength: 'strong',
          explanation: '',
        },
        {
          id: 'R2',
          fromId: 'D2:S1',
          toId: 'C1',
          relationType: 'SUPPORTS',
          strength: 'strong',
          explanation: '',
        },
        {
          id: 'R3',
          fromId: 'D3:S1',
          toId: 'C1',
          relationType: 'SUPPORTS',
          strength: 'strong',
          explanation: '',
        },
      ],
      groups: [makeGroup('G-A', 'A'), makeGroup('G-B', 'B'), makeGroup('G-C', 'C')],
    });

    const result = computeClaimSupport(pilotCase, 'C1');
    expect(result.independentSupportingCount).toBe(3);
    expect(new Set(result.supportingSourceIds)).toEqual(new Set(['A', 'B', 'C']));
  });

  it('collapses a REPEATS chain to a single independent source', () => {
    const pilotCase = buildCase({
      sources: ['A', 'B'],
      documents: [
        makeDocument('D1', [makeSegment('D1:S1', 'A', ['C1'])]),
        makeDocument('D2', [makeSegment('D2:S1', 'A', ['C1'])]),
        makeDocument('D3', [makeSegment('D3:S1', 'A', ['C1'])]),
      ],
      relations: [
        {
          id: 'R1',
          fromId: 'D1:S1',
          toId: 'C1',
          relationType: 'SUPPORTS',
          strength: 'strong',
          explanation: '',
        },
        {
          id: 'R2',
          fromId: 'D2:S1',
          toId: 'C1',
          relationType: 'SUPPORTS',
          strength: 'strong',
          explanation: '',
        },
        {
          id: 'R3',
          fromId: 'D3:S1',
          toId: 'C1',
          relationType: 'SUPPORTS',
          strength: 'strong',
          explanation: '',
        },
        {
          id: 'R4',
          fromId: 'D2:S1',
          toId: 'D1:S1',
          relationType: 'REPEATS',
          strength: 'strong',
          explanation: '',
        },
        {
          id: 'R5',
          fromId: 'D3:S1',
          toId: 'D1:S1',
          relationType: 'REPEATS',
          strength: 'strong',
          explanation: '',
        },
      ],
      groups: [makeGroup('G-A', 'A')],
    });

    const result = computeClaimSupport(pilotCase, 'C1');
    expect(result.independentSupportingCount).toBe(1);
    expect(result.supportingGroupIds).toEqual(['G-A']);
  });

  it('does not let a WEAKENS or CONTRADICTS relation inflate the supporting count', () => {
    const pilotCase = buildCase({
      sources: ['A', 'B'],
      documents: [
        makeDocument('D1', [makeSegment('D1:S1', 'A', ['C1'])]),
        makeDocument('D2', [makeSegment('D2:S1', 'B', ['C1'])]),
      ],
      relations: [
        {
          id: 'R1',
          fromId: 'D1:S1',
          toId: 'C1',
          relationType: 'SUPPORTS',
          strength: 'strong',
          explanation: '',
        },
        {
          id: 'R2',
          fromId: 'D2:S1',
          toId: 'C1',
          relationType: 'CONTRADICTS',
          strength: 'strong',
          explanation: '',
        },
      ],
      groups: [makeGroup('G-A', 'A'), makeGroup('G-B', 'B')],
    });

    const result = computeClaimSupport(pilotCase, 'C1');
    expect(result.independentSupportingCount).toBe(1);
    expect(result.supportingSourceIds).toEqual(['A']);
  });

  it('tracks DOES_NOT_RESOLVE contributions separately from supporting ones', () => {
    const pilotCase = buildCase({
      sources: ['A', 'D'],
      documents: [
        makeDocument('D1', [makeSegment('D1:S1', 'A', ['C1'])]),
        makeDocument('D2', [makeSegment('D2:S1', 'D', ['C1'])]),
      ],
      relations: [
        {
          id: 'R1',
          fromId: 'D1:S1',
          toId: 'C1',
          relationType: 'SUPPORTS',
          strength: 'strong',
          explanation: '',
        },
        {
          id: 'R2',
          fromId: 'D2:S1',
          toId: 'C1',
          relationType: 'DOES_NOT_RESOLVE',
          strength: 'none',
          explanation: '',
        },
      ],
      groups: [makeGroup('G-A', 'A'), makeGroup('G-D', 'D')],
    });

    const result = computeClaimSupport(pilotCase, 'C1');
    expect(result.independentSupportingCount).toBe(1);
    expect(result.nonResolvingSourceIds).toEqual(['D']);
    expect(result.nonResolvingGroupIds).toEqual(['G-D']);
  });

  it('returns zero support when no relation targets the claim', () => {
    const pilotCase = buildCase({
      sources: ['A'],
      documents: [makeDocument('D1', [makeSegment('D1:S1', 'A', [])])],
      relations: [],
      groups: [],
    });

    const result = computeClaimSupport(pilotCase, 'C1');
    expect(result.independentSupportingCount).toBe(0);
    expect(result.supportingSourceIds).toEqual([]);
  });
});

describe('auditIndependentSources — case-0-pilot.json', () => {
  it('confirms the pilot case answer key: three documents echoing Osoba A count as one source', async () => {
    const rawCase = (await import('../../cases/case-0-pilot.json')).default;
    const pilotCase = rawCase as unknown as PilotCase;

    const result = auditIndependentSources(pilotCase);

    expect(result.mismatches).toEqual([]);
    expect(result.pass).toBe(true);
    expect(result.actual.independentSupportingCount).toBe(1);
    expect(result.actual.supportingGroupIds).toEqual(['G-A']);
    expect(result.actual.nonResolvingGroupIds).toEqual(['G-D']);
  });
});

describe('gradeIndependentSourcesSubmission — case-0-pilot.json', () => {
  it('marks the single-source answer correct and the naive three-document answer wrong', async () => {
    const rawCase = (await import('../../cases/case-0-pilot.json')).default;
    const pilotCase = rawCase as unknown as PilotCase;

    const correct = gradeIndependentSourcesSubmission(pilotCase, 'C002', ['G-A']);
    expect(correct.correct).toBe(true);

    const naive = gradeIndependentSourcesSubmission(pilotCase, 'C002', ['G-A', 'G-C', 'G-D']);
    expect(naive.correct).toBe(false);
  });
});
