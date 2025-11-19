import type { MythSymbol } from './mythology.schema';

/**
 * Collection of mythological symbols and their interpretations.
 *
 * Defines the four sacred numbers (7, 4, 8, 13) with comprehensive
 * guidance on their meanings, when they appear, and how to respond.
 * All content uses i18n keys for multilingual support.
 *
 * Symbol meanings:
 * - 7: Completion of cycles, spiritual completion, divine timing
 * - 4: Foundation, stability, four cardinal directions, balance
 * - 8: Infinity, eternal return, Ouroboros, transformation
 * - 13: Death and rebirth, transformation, breaking of old patterns
 *
 * Each symbol includes:
 * - Core meanings and interpretations
 * - Situations when the symbol manifests
 * - Recommended actions and responses
 */
export const MYTH_SYMBOLS: MythSymbol[] = [
  {
    id: 7,
    titleKey: 'mythology.symbol.7.title',
    subtitleKey: 'mythology.symbol.7.subtitle',
    meaningKeys: [
      'mythology.symbol.7.meaning.0',
      'mythology.symbol.7.meaning.1'
    ],
    whenKeys: [
      'mythology.symbol.7.when.0',
      'mythology.symbol.7.when.1',
      'mythology.symbol.7.when.2'
    ],
    actionKeys: [
      'mythology.symbol.7.action.0',
      'mythology.symbol.7.action.1'
    ],
    icon: 'seven'
  },
  {
    id: 4,
    titleKey: 'mythology.symbol.4.title',
    subtitleKey: 'mythology.symbol.4.subtitle',
    meaningKeys: [
      'mythology.symbol.4.meaning.0',
      'mythology.symbol.4.meaning.1'
    ],
    whenKeys: [
      'mythology.symbol.4.when.0',
      'mythology.symbol.4.when.1'
    ],
    actionKeys: [
      'mythology.symbol.4.action.0',
      'mythology.symbol.4.action.1',
      'mythology.symbol.4.action.2'
    ],
    icon: 'four'
  },
  {
    id: 8,
    titleKey: 'mythology.symbol.8.title',
    subtitleKey: 'mythology.symbol.8.subtitle',
    meaningKeys: [
      'mythology.symbol.8.meaning.0',
      'mythology.symbol.8.meaning.1',
      'mythology.symbol.8.meaning.2'
    ],
    whenKeys: [
      'mythology.symbol.8.when.0',
      'mythology.symbol.8.when.1',
      'mythology.symbol.8.when.2'
    ],
    actionKeys: [
      'mythology.symbol.8.action.0',
      'mythology.symbol.8.action.1'
    ],
    icon: 'eight'
  },
  {
    id: 13,
    titleKey: 'mythology.symbol.13.title',
    subtitleKey: 'mythology.symbol.13.subtitle',
    meaningKeys: [
      'mythology.symbol.13.meaning.0',
      'mythology.symbol.13.meaning.1'
    ],
    whenKeys: [
      'mythology.symbol.13.when.0',
      'mythology.symbol.13.when.1',
      'mythology.symbol.13.when.2'
    ],
    actionKeys: [
      'mythology.symbol.13.action.0',
      'mythology.symbol.13.action.1',
      'mythology.symbol.13.action.2'
    ],
    icon: 'thirteen'
  }
];
