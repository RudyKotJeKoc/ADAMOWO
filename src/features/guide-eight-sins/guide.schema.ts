/**
 * Type of assessment question.
 *
 * - yn: Yes/No binary choice
 * - scale: Numeric rating (typically 1-5)
 * - multi: Multiple choice with weighted options
 */
export type QuestionType = 'yn' | 'scale' | 'multi';

/**
 * Single assessment question in a module.
 *
 * @property id - Unique question identifier
 * @property type - Question format (yn/scale/multi)
 * @property textKey - Translation key for question text
 * @property helpKey - Optional translation key for explanatory text
 * @property weight - Score multiplier (defaults to DEFAULT_WEIGHT)
 * @property scaleMax - Maximum value for scale questions (default 5)
 * @property options - Weighted choices for multi questions
 */
export type Question = {
  id: string;
  type: QuestionType;
  textKey: string;
  helpKey?: string;
  weight?: number;
  scaleMax?: number;
  options?: { key: string; weight: number }[];
};

/**
 * Complete module definition for one of the eight sins.
 *
 * @property id - Unique module identifier (e.g., 'sin_1')
 * @property titleKey - Translation key for module name
 * @property descriptionKey - Translation key for module explanation
 * @property examplesKeys - Array of translation keys for examples
 * @property questions - Assessment questions for this sin
 * @property thresholds - Score boundaries for low/medium/high severity
 * @property resourcesKeys - Translation keys for helpful resources
 */
export type SinModuleData = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  examplesKeys: string[];
  questions: Question[];
  thresholds: {
    low: number;
    medium: number;
    high: number;
  };
  resourcesKeys: string[];
};

/**
 * Yes/No question answer.
 */
export type YesNoAnswer = boolean | undefined;

/**
 * Scale question answer (typically 1-5).
 */
export type ScaleAnswer = number | undefined;

/**
 * Multiple choice question answer (selected option keys).
 */
export type MultiAnswer = string[] | undefined;

/**
 * Union of all possible answer value types.
 */
export type AnswerValue = YesNoAnswer | ScaleAnswer | MultiAnswer;

/**
 * Map of question IDs to their answers for a single module.
 */
export type ModuleAnswers = Record<string, AnswerValue>;

/**
 * Persisted guide progress data.
 *
 * @property answersByModule - Map of module ID to its answers
 * @property totals - Map of module ID to calculated score
 * @property updatedAt - ISO 8601 timestamp of last modification
 * @property version - Storage schema version for migration support
 */
export type GuideStoragePayload = {
  answersByModule: Record<string, ModuleAnswers>;
  totals: Record<string, number>;
  updatedAt: string;
  version: number;
};

/**
 * Default score multiplier when weight is not specified.
 *
 * @internal
 */
const DEFAULT_WEIGHT = 1;

/**
 * Calculates score for a yes/no question.
 *
 * Returns the full weight if answer is true, 0 otherwise.
 *
 * @param answer - True/false/undefined
 * @param weight - Score multiplier (default 1)
 * @returns Calculated score
 */
export const getYesNoScore = (answer: YesNoAnswer, weight = DEFAULT_WEIGHT): number =>
  answer ? weight : 0;

/**
 * Calculates score for a scale question.
 *
 * Normalizes the answer to 0-based scale (e.g., 1-5 becomes 0-4)
 * and multiplies by weight.
 *
 * @param answer - Selected scale value (undefined if unanswered)
 * @param weight - Score multiplier (default 1)
 * @param scaleMax - Maximum scale value (default 5)
 * @returns Calculated score (0 if unanswered)
 */
export const getScaleScore = (
  answer: ScaleAnswer,
  weight = DEFAULT_WEIGHT,
  scaleMax = 5
): number => {
  if (answer === undefined || answer === null) {
    return 0;
  }

  const normalised = Math.max(1, Math.min(scaleMax, answer)) - 1;
  return normalised * weight;
};

/**
 * Calculates score for a multiple choice question.
 *
 * Sums the weights of all selected options.
 *
 * @param answer - Array of selected option keys (undefined if unanswered)
 * @param options - Available options with their weights
 * @returns Total score from selected options (0 if none selected)
 */
export const getMultiScore = (answer: MultiAnswer, options: Question['options'] = []): number => {
  if (!answer?.length) {
    return 0;
  }

  const weights = new Map(options.map((option) => [option.key, option.weight] as const));
  return answer.reduce((total, key) => total + (weights.get(key) ?? 0), 0);
};

/**
 * Calculates the maximum possible score for a question.
 *
 * Returns the theoretical maximum based on question type:
 * - yn: weight value
 * - scale: (scaleMax - 1) * weight
 * - multi: sum of all option weights
 *
 * @param question - Question configuration
 * @returns Maximum achievable score
 */
export const getQuestionMaxScore = (question: Question): number => {
  const weight = question.weight ?? DEFAULT_WEIGHT;

  if (question.type === 'yn') {
    return weight;
  }

  if (question.type === 'scale') {
    const max = (question.scaleMax ?? 5) - 1;
    return max * weight;
  }

  return (question.options ?? []).reduce((total, option) => total + option.weight, 0);
};

/**
 * Calculates total and maximum scores for a module.
 *
 * Processes all questions in the module, summing actual scores
 * from answers and theoretical maximum scores.
 *
 * @param module - Module definition with questions
 * @param answers - User's answers for this module (defaults to empty)
 * @returns Object with total score achieved and max possible score
 */
export const calculateModuleScore = (
  module: SinModuleData,
  answers: ModuleAnswers = {}
): { total: number; max: number } => {
  const total = module.questions.reduce((sum, question) => {
    const answer = answers[question.id];

    if (question.type === 'yn') {
      return sum + getYesNoScore(answer as YesNoAnswer, question.weight);
    }

    if (question.type === 'scale') {
      return (
        sum +
        getScaleScore(answer as ScaleAnswer, question.weight, question.scaleMax)
      );
    }

    return sum + getMultiScore(answer as MultiAnswer, question.options);
  }, 0);

  const max = module.questions.reduce((sum, question) => sum + getQuestionMaxScore(question), 0);

  return { total, max };
};
