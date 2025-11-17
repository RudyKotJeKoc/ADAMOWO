/**
 * Type definitions for the Analyses (Analizy) section.
 *
 * This schema defines the structure for deep-dive content analyses on the platform,
 * following the Information Architecture principles outlined in the UX documentation.
 */

export type AnalysisCategory =
  | 'manipulacja' // Manipulation techniques and patterns
  | 'dokumentacja' // Case documentation and evidence
  | 'psychologia' // Psychological analysis
  | 'prawo' // Legal aspects
  | 'wzorce' // Patterns and cycles
  | 'inne'; // Other

export interface AnalysisMetadata {
  /** Unique identifier for the analysis */
  id: string;

  /** Title of the analysis */
  title: string;

  /** Brief subtitle or tagline */
  subtitle?: string;

  /** Category classification */
  category: AnalysisCategory;

  /** Subcategory for hierarchical organization */
  subcategory?: string;

  /** Short description for teaser (1-2 sentences) */
  teaser: string;

  /** Icon or emoji representing the analysis */
  icon?: string;

  /** Estimated reading time in minutes */
  readingTime: number;

  /** Publication or last update date */
  date: string;

  /** Tags for search functionality */
  tags: string[];

  /** Featured/highlighted content */
  featured?: boolean;

  /** Path to full content component or route */
  contentPath: string;

  /** Badge text (e.g., "Nowe", "Popularne") */
  badge?: string;
}

export interface AnalysisCategoryInfo {
  id: AnalysisCategory;
  nameKey: string;
  descriptionKey: string;
  icon: string;
  color: string;
}
