/**
 * Mythology Feature Type Definitions
 *
 * Type system for symbolic number interpretation and mythological
 * guidance. Covers the sacred numbers (7, 4, 8, 13) with their
 * meanings, occurrences, and actionable insights.
 */

/**
 * Sacred symbolic numbers used in the mythology system.
 *
 * Each number carries specific meaning:
 * - 7: Completion, cycles, spiritual awakening
 * - 4: Stability, foundation, turning points
 * - 8: Infinity, eternal cycles, transformation
 * - 13: Death/rebirth, transformation, endings as beginnings
 */
export type SymbolId = 7 | 4 | 8 | 13;

/**
 * A symbolic number with its mythological interpretation.
 *
 * @property id - The numeric symbol (7, 4, 8, or 13)
 * @property titleKey - i18n key for the symbol's primary title
 * @property subtitleKey - i18n key for the symbol's subtitle or tagline
 * @property meaningKeys - Array of i18n keys explaining symbolic meanings
 * @property whenKeys - Array of i18n keys describing when this symbol appears
 * @property actionKeys - Array of i18n keys for recommended actions/responses
 * @property icon - Visual icon identifier for rendering
 */
export type MythSymbol = {
  id: SymbolId;
  titleKey: string;
  subtitleKey: string;
  meaningKeys: string[];
  whenKeys: string[];
  actionKeys: string[];
  icon: 'seven' | 'four' | 'eight' | 'thirteen';
};
