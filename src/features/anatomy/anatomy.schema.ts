// Type definitions for Anatomy of Manipulation feature

/**
 * Category of manipulation technique.
 *
 * Classifies manipulation patterns by their primary mechanism:
 * - cognitive: Targets thinking and perception
 * - emotional: Exploits feelings and attachments
 * - institutional: Weaponizes systems and authority
 */
export type ManipulationCategory = 'cognitive' | 'emotional' | 'institutional';

/**
 * Severity level of a manipulation pattern.
 *
 * Indicates the potential harm and urgency:
 * - low: Minor impact, awareness recommended
 * - medium: Moderate concern, intervention suggested
 * - high: Serious risk, immediate action advised
 */
export type SeverityLevel = 'low' | 'medium' | 'high';

/**
 * Warning sign indicating manipulative behavior.
 *
 * @property id - Unique identifier for the red flag
 * @property translationKey - i18n key for the warning text
 */
export interface RedFlag {
  id: string;
  translationKey: string;
}

/**
 * Real-world example demonstrating a manipulation pattern.
 *
 * @property id - Unique identifier for the example
 * @property context - Translation key describing the situation
 * @property behavior - Translation key describing the manipulative action
 * @property analysis - Translation key explaining why this is manipulative
 * @property sourceDocs - Optional references to supporting documentation
 */
export interface Example {
  id: string;
  context: string;
  behavior: string;
  analysis: string;
  sourceDocs?: string[];
}

/**
 * Single choice in a quiz question.
 *
 * @property textKey - Translation key for the option text
 * @property isCorrect - Whether this is the correct answer
 * @property explanationKey - Translation key for feedback when selected
 */
export interface QuizOption {
  textKey: string;
  isCorrect: boolean;
  explanationKey: string;
}

/**
 * Knowledge check quiz for a manipulation schema.
 *
 * @property questionKey - Translation key for the question prompt
 * @property options - Array of possible answers with feedback
 */
export interface Quiz {
  questionKey: string;
  options: QuizOption[];
}

/**
 * Complete manipulation pattern definition.
 *
 * Describes a specific manipulation technique with educational content,
 * examples, and assessment materials.
 *
 * @property id - Unique identifier for the schema
 * @property icon - Icon name from SCHEMA_ICONS
 * @property category - Type of manipulation (cognitive/emotional/institutional)
 * @property severity - Risk level (low/medium/high)
 * @property titleKey - Translation key for the schema name
 * @property definitionKey - Translation key for the detailed explanation
 * @property redFlags - Warning signs that indicate this pattern
 * @property examples - Real-world demonstrations
 * @property quiz - Knowledge assessment
 */
export interface ManipulationSchema {
  id: string;
  icon: string;
  category: ManipulationCategory;
  severity: SeverityLevel;
  titleKey: string;
  definitionKey: string;
  redFlags: RedFlag[];
  examples: Example[];
  quiz: Quiz;
}

/**
 * Step in the manipulation analysis framework.
 *
 * @property number - Step sequence (1-based index)
 * @property titleKey - Translation key for step heading
 * @property descriptionKey - Translation key for step instructions
 * @property placeholderKey - Translation key for input placeholder text
 */
export interface AnalysisStep {
  number: number;
  titleKey: string;
  descriptionKey: string;
  placeholderKey: string;
}

/**
 * Structured framework for analyzing manipulative situations.
 *
 * @property steps - Ordered sequence of analysis steps
 */
export interface AnalysisFramework {
  steps: AnalysisStep[];
}

/**
 * Icon mapping reference for manipulation schemas.
 *
 * Maps symbolic icon names to emoji representations for visual
 * identification of manipulation patterns.
 */
export const SCHEMA_ICONS = {
  MasksIcon: '🎭',
  BrokenHeartIcon: '💔',
  ScalesIcon: '⚖️',
  MirrorIcon: '🪞',
  NotebookIcon: '📔',
  ShieldIcon: '🛡️',
} as const;

/**
 * Valid icon name from the SCHEMA_ICONS map.
 */
export type SchemaIcon = keyof typeof SCHEMA_ICONS;
