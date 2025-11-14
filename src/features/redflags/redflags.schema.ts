/**
 * Red Flags Feature Type Definitions
 *
 * Type system for tracking and categorizing concerning behavioral patterns
 * in relationships. Supports journaling of red flag incidents with intensity
 * ratings and optional notes.
 */

/**
 * Categories of concerning behavioral patterns in relationships.
 *
 * Each category represents a distinct type of manipulative or abusive behavior:
 * - gaslighting: Reality distortion and psychological manipulation
 * - financial_abuse: Economic control or exploitation
 * - stalking: Unwanted surveillance or following
 * - legal_weaponization: Misuse of legal systems for harassment
 * - emotional_blackmail: Manipulation through guilt or threats
 * - devaluation: Systematic undermining of self-worth
 * - discard: Sudden abandonment or rejection
 * - hoovering: Attempts to re-engage after separation
 */
export type RedFlagCategory =
  | 'gaslighting'
  | 'financial_abuse'
  | 'stalking'
  | 'legal_weaponization'
  | 'emotional_blackmail'
  | 'devaluation'
  | 'discard'
  | 'hoovering';

/**
 * A recorded instance of a red flag behavior.
 *
 * @property id - Unique identifier for the entry
 * @property date - Date when the incident occurred (YYYY-MM-DD format)
 * @property category - Type of red flag behavior observed
 * @property intensity - Severity rating from 1 (mild) to 5 (severe)
 * @property note - Optional description or context (max 500 chars)
 * @property createdAt - ISO 8601 timestamp when entry was created
 */
export type RedFlagEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  category: RedFlagCategory;
  intensity: 1 | 2 | 3 | 4 | 5;
  note?: string;
  createdAt: string;
};

/**
 * Input data for creating a new red flag entry.
 *
 * @property date - Date when the incident occurred (YYYY-MM-DD format)
 * @property category - Type of red flag behavior observed
 * @property intensity - Severity rating from 1 (mild) to 5 (severe)
 * @property note - Optional description or context (max 500 chars)
 */
export type CreateRedFlagInput = {
  date: string;
  category: RedFlagCategory;
  intensity: 1 | 2 | 3 | 4 | 5;
  note?: string;
};
