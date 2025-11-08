// Type definitions for Anatomy of Manipulation feature

export type ManipulationCategory = 'cognitive' | 'emotional' | 'institutional';

export type SeverityLevel = 'low' | 'medium' | 'high';

export interface RedFlag {
  id: string;
  translationKey: string;
}

export interface Example {
  id: string;
  context: string;
  behavior: string;
  analysis: string;
  sourceDocs?: string[];
}

export interface QuizOption {
  textKey: string;
  isCorrect: boolean;
  explanationKey: string;
}

export interface Quiz {
  questionKey: string;
  options: QuizOption[];
}

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

export interface AnalysisStep {
  number: number;
  titleKey: string;
  descriptionKey: string;
  placeholderKey: string;
}

export interface AnalysisFramework {
  steps: AnalysisStep[];
}

// Icon mapping reference
export const SCHEMA_ICONS = {
  MasksIcon: '🎭',
  BrokenHeartIcon: '💔',
  ScalesIcon: '⚖️',
  MirrorIcon: '🪞',
  NotebookIcon: '📔',
  ShieldIcon: '🛡️',
} as const;

export type SchemaIcon = keyof typeof SCHEMA_ICONS;
