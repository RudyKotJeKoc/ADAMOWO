/**
 * Violence Loop Feature Data
 *
 * Data definitions for the narcissistic abuse cycle phases.
 * Models the four-phase loop: love bombing, devaluation, discard, hoovering.
 * All content uses i18n keys for multilingual support.
 */

/**
 * Identifiers for the four phases of the narcissistic abuse cycle.
 *
 * - love_bombing: Idealization phase with excessive affection
 * - devaluation: Criticism and undermining phase
 * - discard: Abandonment or rejection phase
 * - hoovering: Re-engagement attempts after discard
 */
export type PhaseId = 'love_bombing' | 'devaluation' | 'discard' | 'hoovering';

/**
 * A phase in the narcissistic abuse cycle.
 *
 * @property id - Unique phase identifier
 * @property titleKey - i18n key for the phase name
 * @property summaryKey - i18n key for phase description
 * @property examplesKeys - Array of i18n keys for concrete examples
 * @property tipsKeys - Array of i18n keys for recognition and response tips
 * @property position - Visual position on the cycle diagram (0-1 range)
 */
export type Phase = {
  id: PhaseId;
  titleKey: string;
  summaryKey: string;
  examplesKeys: string[];
  tipsKeys: string[];
  position: number;
};

/**
 * Complete data for all four phases of the abuse cycle.
 *
 * Defines the repeating pattern of narcissistic abuse:
 * 1. Love Bombing (position 0.0) - Initial idealization
 * 2. Devaluation (position 0.25) - Gradual criticism
 * 3. Discard (position 0.5) - Rejection or abandonment
 * 4. Hoovering (position 0.75) - Re-engagement attempts
 *
 * Each phase includes examples of behaviors and tips for recognition.
 * Position values place phases on a circular visualization (0-1 range).
 */
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

/**
 * Ordered array of phase IDs for sequential iteration.
 *
 * Provides a consistent order for rendering the cycle:
 * love_bombing → devaluation → discard → hoovering → (repeat)
 */
export const phaseOrder: PhaseId[] = phases.map((phase) => phase.id);
