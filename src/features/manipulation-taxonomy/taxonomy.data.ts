import type { ManipulationTactic, TacticCategoryInfo } from './taxonomy.schema';

/**
 * Category definitions for the Manipulation Taxonomy.
 *
 * Three main categories of systemic manipulation mechanisms:
 * - Corporate Environment (Industrial Sabotage)
 * - Legal and Family Engineering
 * - Institutional Pathology
 */
export const TACTIC_CATEGORIES: TacticCategoryInfo[] = [
  {
    id: 'corporate',
    nameKey: 'taxonomy.categories.corporate.name',
    descriptionKey: 'taxonomy.categories.corporate.description',
    icon: '🏢',
    color: '#f97316', // orange-500
  },
  {
    id: 'legal-family',
    nameKey: 'taxonomy.categories.legalFamily.name',
    descriptionKey: 'taxonomy.categories.legalFamily.description',
    icon: '⚖️',
    color: '#a855f7', // purple-500
  },
  {
    id: 'institutional',
    nameKey: 'taxonomy.categories.institutional.name',
    descriptionKey: 'taxonomy.categories.institutional.description',
    icon: '🏛️',
    color: '#ef4444', // red-500
  },
];

/**
 * Complete manipulation tactics taxonomy.
 *
 * Comprehensive lexicon of manipulation vectors identified through
 * the Adamowo investigation, organized by systemic category.
 */
export const MANIPULATION_TACTICS: ManipulationTactic[] = [
  // ════════════════════════════════════════════════════════════
  // CATEGORY 1: CORPORATE ENVIRONMENT (Industrial Sabotage)
  // ════════════════════════════════════════════════════════════
  {
    id: 'informational-corruption',
    nameKey: 'taxonomy.tactics.informationalCorruption.name',
    descriptionKey: 'taxonomy.tactics.informationalCorruption.description',
    category: 'corporate',
    icon: '💰',
  },
  {
    id: 'organic-gaslighting',
    nameKey: 'taxonomy.tactics.organicGaslighting.name',
    descriptionKey: 'taxonomy.tactics.organicGaslighting.description',
    category: 'corporate',
    icon: '🔥',
  },
  {
    id: 'procedural-fiction',
    nameKey: 'taxonomy.tactics.proceduralFiction.name',
    descriptionKey: 'taxonomy.tactics.proceduralFiction.description',
    category: 'corporate',
    icon: '📄',
  },
  {
    id: 'hostile-asset-liquidation',
    nameKey: 'taxonomy.tactics.hostileAssetLiquidation.name',
    descriptionKey: 'taxonomy.tactics.hostileAssetLiquidation.description',
    category: 'corporate',
    icon: '💣',
  },

  // ════════════════════════════════════════════════════════════
  // CATEGORY 2: LEGAL AND FAMILY ENGINEERING
  // ════════════════════════════════════════════════════════════
  {
    id: 'obsessive-documentation',
    nameKey: 'taxonomy.tactics.obsessiveDocumentation.name',
    descriptionKey: 'taxonomy.tactics.obsessiveDocumentation.description',
    category: 'legal-family',
    icon: '📅',
  },
  {
    id: 'evidential-provocation',
    nameKey: 'taxonomy.tactics.evidentialProvocation.name',
    descriptionKey: 'taxonomy.tactics.evidentialProvocation.description',
    category: 'legal-family',
    icon: '🎬',
  },
  {
    id: 'dependent-instrumentalization',
    nameKey: 'taxonomy.tactics.dependentInstrumentalization.name',
    descriptionKey: 'taxonomy.tactics.dependentInstrumentalization.description',
    category: 'legal-family',
    icon: '🔑',
  },
  {
    id: 'procedural-betrayal',
    nameKey: 'taxonomy.tactics.proceduralBetrayal.name',
    descriptionKey: 'taxonomy.tactics.proceduralBetrayal.description',
    category: 'legal-family',
    icon: '⚖️',
  },

  // ════════════════════════════════════════════════════════════
  // CATEGORY 3: INSTITUTIONAL PATHOLOGY
  // ════════════════════════════════════════════════════════════
  {
    id: 'systemic-context-blindness',
    nameKey: 'taxonomy.tactics.systemicContextBlindness.name',
    descriptionKey: 'taxonomy.tactics.systemicContextBlindness.description',
    category: 'institutional',
    icon: '👁️',
  },
  {
    id: 'institutional-intimidation',
    nameKey: 'taxonomy.tactics.institutionalIntimidation.name',
    descriptionKey: 'taxonomy.tactics.institutionalIntimidation.description',
    category: 'institutional',
    icon: '🚨',
  },
  {
    id: 'moral-relativism',
    nameKey: 'taxonomy.tactics.moralRelativism.name',
    descriptionKey: 'taxonomy.tactics.moralRelativism.description',
    category: 'institutional',
    icon: '⚖️',
  },
];

/**
 * Get tactics by category.
 */
export function getTacticsByCategory(categoryId: string): ManipulationTactic[] {
  return MANIPULATION_TACTICS.filter((tactic) => tactic.category === categoryId);
}

/**
 * Get category info by ID.
 */
export function getCategoryInfo(categoryId: string): TacticCategoryInfo | undefined {
  return TACTIC_CATEGORIES.find((cat) => cat.id === categoryId);
}
