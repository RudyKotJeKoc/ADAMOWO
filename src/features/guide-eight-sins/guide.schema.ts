export type QuestionType = 'yn' | 'scale' | 'multi';

export type Question = {
  id: string;
  type: QuestionType;
  textKey: string;
  helpKey?: string;
  weight?: number;
  scaleMax?: number;
  options?: { key: string; weight: number }[];
};

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

export type YesNoAnswer = boolean | undefined;
export type ScaleAnswer = number | undefined;
export type MultiAnswer = string[] | undefined;

export type AnswerValue = YesNoAnswer | ScaleAnswer | MultiAnswer;

export type ModuleAnswers = Record<string, AnswerValue>;

export type GuideStoragePayload = {
  answersByModule: Record<string, ModuleAnswers>;
  totals: Record<string, number>;
  updatedAt: string;
  version: number;
};

const DEFAULT_WEIGHT = 1;

export const getYesNoScore = (answer: YesNoAnswer, weight = DEFAULT_WEIGHT): number =>
  answer ? weight : 0;

export const getScaleScore = (
  answer: ScaleAnswer,
  weight = DEFAULT_WEIGHT,
  scaleMax = 5
): number => {
  if (!answer) {
    return 0;
  }

  const normalised = Math.max(1, Math.min(scaleMax, answer)) - 1;
  return normalised * weight;
};

export const getMultiScore = (answer: MultiAnswer, options: Question['options'] = []): number => {
  if (!answer?.length) {
    return 0;
  }

  const weights = new Map(options.map((option) => [option.key, option.weight] as const));
  return answer.reduce((total, key) => total + (weights.get(key) ?? 0), 0);
};

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
