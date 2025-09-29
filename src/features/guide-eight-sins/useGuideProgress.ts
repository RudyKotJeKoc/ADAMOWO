import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  AnswerValue,
  GuideStoragePayload,
  ModuleAnswers,
  Question,
  SinModuleData,
  calculateModuleScore
} from './guide.schema';

const STORAGE_KEY = 'ra.guide.v1';
const STORAGE_VERSION = 1;

type InternalState = {
  answersByModule: Record<string, ModuleAnswers>;
  totals: Record<string, number>;
  updatedAt: string;
};

const defaultState: InternalState = {
  answersByModule: {},
  totals: {},
  updatedAt: ''
};

const withDefaultTotals = (modules: SinModuleData[], totals: Record<string, number>) => {
  return modules.reduce<Record<string, number>>((acc, module) => {
    acc[module.id] = totals[module.id] ?? 0;
    return acc;
  }, {});
};

const isAnswered = (question: Question, value: AnswerValue): boolean => {
  if (value === undefined) {
    return false;
  }

  if (question.type === 'multi') {
    return Array.isArray(value) && value.length > 0;
  }

  return true;
};

const computeTotals = (
  modules: SinModuleData[],
  answersByModule: Record<string, ModuleAnswers>
): Record<string, number> => {
  return modules.reduce<Record<string, number>>((acc, module) => {
    const answers = answersByModule[module.id];
    const { total } = calculateModuleScore(module, answers);
    acc[module.id] = total;
    return acc;
  }, {});
};

const readStorage = (): GuideStoragePayload | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const payload = JSON.parse(raw) as GuideStoragePayload;
    if (payload.version !== STORAGE_VERSION) {
      return null;
    }

    return payload;
  } catch (error) {
    console.warn('Failed to read guide progress', error);
    return null;
  }
};

const writeStorage = (state: GuideStoragePayload) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to persist guide progress', error);
  }
};

const createPayload = (
  modules: SinModuleData[],
  answersByModule: Record<string, ModuleAnswers>,
  totals: Record<string, number>
): GuideStoragePayload => ({
  version: STORAGE_VERSION,
  answersByModule,
  totals: withDefaultTotals(modules, totals),
  updatedAt: new Date().toISOString()
});

export type ModuleProgress = {
  moduleId: string;
  answered: number;
  total: number;
  completion: number;
};

export type UseGuideProgressResult = {
  answersByModule: Record<string, ModuleAnswers>;
  totals: Record<string, number>;
  moduleProgress: ModuleProgress[];
  overallProgress: number;
  updatedAt: string;
  setAnswer: (moduleId: string, questionId: string, value: AnswerValue) => void;
  reset: () => void;
};

export const useGuideProgress = (modules: SinModuleData[]): UseGuideProgressResult => {
  const [state, setState] = useState<InternalState>(defaultState);

  useEffect(() => {
    const persisted = readStorage();
    if (!persisted) {
      return;
    }

    setState({
      answersByModule: persisted.answersByModule ?? {},
      totals: withDefaultTotals(modules, persisted.totals ?? {}),
      updatedAt: persisted.updatedAt ?? ''
    });
  }, [modules]);

  const setAnswer = useCallback(
    (moduleId: string, questionId: string, value: AnswerValue) => {
      setState((prev) => {
        const nextAnswersByModule = { ...prev.answersByModule };
        const moduleAnswers = { ...(nextAnswersByModule[moduleId] ?? {}) };

        if (value === undefined) {
          delete moduleAnswers[questionId];
        } else {
          moduleAnswers[questionId] = value;
        }

        nextAnswersByModule[moduleId] = moduleAnswers;
        const totals = computeTotals(modules, nextAnswersByModule);
        const payload = createPayload(modules, nextAnswersByModule, totals);
        void writeStorage(payload);

        return {
          answersByModule: nextAnswersByModule,
          totals,
          updatedAt: payload.updatedAt
        };
      });
    },
    [modules]
  );

  const reset = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }

    setState(defaultState);
  }, []);

  const moduleProgress = useMemo(() => {
    return modules.map<ModuleProgress>((module) => {
      const answers = state.answersByModule[module.id] ?? {};
      const answered = module.questions.reduce((count, question) => {
        const value = answers[question.id];
        return count + (isAnswered(question, value) ? 1 : 0);
      }, 0);

      const total = module.questions.length;
      const completion = total > 0 ? answered / total : 0;

      return {
        moduleId: module.id,
        answered,
        total,
        completion
      };
    });
  }, [modules, state.answersByModule]);

  const overallProgress = useMemo(() => {
    const totalsQuestions = modules.reduce((sum, module) => sum + module.questions.length, 0);
    if (totalsQuestions === 0) {
      return 0;
    }

    const answeredQuestions = moduleProgress.reduce(
      (sum, progress) => sum + progress.answered,
      0
    );

    return answeredQuestions / totalsQuestions;
  }, [moduleProgress, modules]);

  return {
    answersByModule: state.answersByModule,
    totals: withDefaultTotals(modules, state.totals),
    moduleProgress,
    overallProgress,
    updatedAt: state.updatedAt,
    setAnswer,
    reset
  };
};
