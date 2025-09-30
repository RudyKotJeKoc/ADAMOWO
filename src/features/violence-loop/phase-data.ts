export type PhaseId = 'love_bombing' | 'devaluation' | 'discard' | 'hoovering';

export type Phase = {
  id: PhaseId;
  titleKey: string;
  summaryKey: string;
  examplesKeys: string[];
  tipsKeys: string[];
  position: number;
};

export const phases: Phase[] = [
  {
    id: 'love_bombing',
    titleKey: 'loop.phase.loveBombing.title',
    summaryKey: 'loop.phase.loveBombing.summary',
    examplesKeys: [
      'loop.phase.loveBombing.examples.0',
      'loop.phase.loveBombing.examples.1',
      'loop.phase.loveBombing.examples.2'
    ],
    tipsKeys: [
      'loop.phase.loveBombing.tips.0',
      'loop.phase.loveBombing.tips.1',
      'loop.phase.loveBombing.tips.2'
    ],
    position: 0
  },
  {
    id: 'devaluation',
    titleKey: 'loop.phase.devaluation.title',
    summaryKey: 'loop.phase.devaluation.summary',
    examplesKeys: [
      'loop.phase.devaluation.examples.0',
      'loop.phase.devaluation.examples.1',
      'loop.phase.devaluation.examples.2'
    ],
    tipsKeys: [
      'loop.phase.devaluation.tips.0',
      'loop.phase.devaluation.tips.1',
      'loop.phase.devaluation.tips.2'
    ],
    position: 0.25
  },
  {
    id: 'discard',
    titleKey: 'loop.phase.discard.title',
    summaryKey: 'loop.phase.discard.summary',
    examplesKeys: [
      'loop.phase.discard.examples.0',
      'loop.phase.discard.examples.1',
      'loop.phase.discard.examples.2'
    ],
    tipsKeys: [
      'loop.phase.discard.tips.0',
      'loop.phase.discard.tips.1',
      'loop.phase.discard.tips.2'
    ],
    position: 0.5
  },
  {
    id: 'hoovering',
    titleKey: 'loop.phase.hoovering.title',
    summaryKey: 'loop.phase.hoovering.summary',
    examplesKeys: [
      'loop.phase.hoovering.examples.0',
      'loop.phase.hoovering.examples.1',
      'loop.phase.hoovering.examples.2'
    ],
    tipsKeys: [
      'loop.phase.hoovering.tips.0',
      'loop.phase.hoovering.tips.1',
      'loop.phase.hoovering.tips.2'
    ],
    position: 0.75
  }
];

export const phaseOrder: PhaseId[] = phases.map((phase) => phase.id);
