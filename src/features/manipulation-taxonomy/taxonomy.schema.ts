/**
 * Type definitions for the Manipulation Taxonomy lexicon.
 *
 * Defines the structure for the systematic categorization of manipulation tactics
 * identified in the Adamowo investigation. This taxonomy serves as a reference
 * framework for understanding corporate, legal, and institutional manipulation vectors.
 */

export type TacticCategory = 'corporate' | 'legal-family' | 'institutional';

export interface ManipulationTactic {
  /** Unique identifier for the tactic */
  id: string;

  /** Name/title of the tactic (translation key) */
  nameKey: string;

  /** Detailed description (translation key) */
  descriptionKey: string;

  /** Category classification */
  category: TacticCategory;

  /** Icon/emoji representing the tactic */
  icon?: string;
}

export interface TacticCategoryInfo {
  /** Category identifier */
  id: TacticCategory;

  /** Category name (translation key) */
  nameKey: string;

  /** Category description (translation key) */
  descriptionKey: string;

  /** Icon/emoji for the category */
  icon: string;

  /** Accent color for the category */
  color: string;
}
