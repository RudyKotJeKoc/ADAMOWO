import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  AnswerValue,
  GuideStoragePayload,
  ModuleAnswers,
  Question,
  SinModuleData,
  calculateModuleScore
} from './guide.schema';

/**
 * localStorage key for persisted guide progress.
 *
 * @internal
 */
const STORAGE_KEY = 'ra.guide.v1';

/**
 * Current storage schema version.
 *
 * Increment when making breaking changes to support data migration.
 *
 * @internal
 */
const STORAGE_VERSION = 1;

/**
 * Internal state structure for the hook.
 *
 * @property answersByModule - Map of module ID to its answers
 * @property totals - Map of module ID to calculated score
 * @property updatedAt - ISO 8601 timestamp of last change
 *
 * @internal
 */
type InternalState = {
  answersByModule: Record<string, ModuleAnswers>;
  totals: Record<string, number>;
  updatedAt: string;
};

/**
 * Initial empty state for new users.
 *
 * @internal
 */
const defaultState: InternalState = {
  answersByModule: {},
  totals: {},
  updatedAt: ''
};

/**
 * Ensures all modules have a total score entry.
 *
 * Fills in 0 for modules not present in the totals map.
 *
 * @param modules - All available modules
 * @param totals - Existing totals (may be incomplete)
 * @returns Complete totals map with defaults
 *
 * @internal
 */
const withDefaultTotals = (modules: SinModuleData[], totals: Record<string, number>) => {
  return modules.reduce<Record<string, number>>((acc, module) => {
    acc[module.id] = totals[module.id] ?? 0;
    return acc;
  }, {});
};

/**
 * Checks if a question has been answered.
 *
 * Multi-choice questions require at least one selection.
 * Other types just need a defined value.
 *
 * @param question - Question definition
 * @param value - User's answer
 * @returns True if answer is complete and valid
 *
 * @internal
 */
const isAnswered = (question: Question, value: AnswerValue): boolean => {
  if (value === undefined) {
    return false;
  }

  if (question.type === 'multi') {
    return Array.isArray(value) && value.length > 0;
  }

  return true;
};

/**
 * Recalculates scores for all modules.
 *
 * @param modules - All module definitions
 * @param answersByModule - Current answer state
 * @returns Map of module ID to total score
 *
 * @internal
 */
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

/**
 * Reads persisted guide progress from localStorage.
 *
 * Returns null if:
 * - Running in SSR environment
 * - No saved data exists
 * - Storage version mismatch (migration needed)
 * - Parse error occurs
 *
 * @returns Saved progress or null
 *
 * @internal
 */
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

/**
 * Persists guide progress to localStorage.
 *
 * Silently fails in SSR or if storage is unavailable.
 *
 * @param state - Current progress to save
 *
 * @internal
 */
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

/**
 * Creates a storage payload from current state.
 *
 * @param modules - All module definitions
 * @param answersByModule - Current answers
 * @param totals - Current scores
 * @returns Serializable payload ready for persistence
 *
 * @internal
 */
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

/**
 * Progress information for a single module.
 *
 * @property moduleId - Module identifier
 * @property answered - Number of questions answered
 * @property total - Total number of questions in module
 * @property completion - Fraction of questions answered (0-1)
 */
export type ModuleProgress = {
  moduleId: string;
  answered: number;
  total: number;
  completion: number;
};

/**
 * Return value from useGuideProgress hook.
 *
 * @property answersByModule - Map of module ID to its answers
 * @property totals - Map of module ID to calculated score
 * @property moduleProgress - Per-module completion statistics
 * @property overallProgress - Overall completion fraction (0-1)
 * @property updatedAt - ISO 8601 timestamp of last modification
 * @property setAnswer - Function to record an answer
 * @property reset - Function to clear all progress
 */
export type UseGuideProgressResult = {
  answersByModule: Record<string, ModuleAnswers>;
  totals: Record<string, number>;
  moduleProgress: ModuleProgress[];
  overallProgress: number;
  updatedAt: string;
  setAnswer: (moduleId: string, questionId: string, value: AnswerValue) => void;
  reset: () => void;
};

/**
 * Manages user progress through the Eight Sins guide.
 *
 * Provides:
 * - Automatic persistence to localStorage
 * - Score calculation on each answer
 * - Completion tracking per module and overall
 * - Reset functionality
 *
 * Progress is loaded from storage on mount and saved after each change.
 * All scores are recalculated from answers on every update to ensure
 * consistency.
 *
 * @param modules - Array of all sin modules to track
 * @returns Progress state and control functions
 *
 * @example
 * ```tsx
 * import { eightSinsModules } from './guide.data';
 * import { useGuideProgress } from './useGuideProgress';
 *
 * function GuideApp() {
 *   const {
 *     answersByModule,
 *     totals,
 *     moduleProgress,
 *     overallProgress,
 *     setAnswer,
 *     reset
 *   } = useGuideProgress(eightSinsModules);
 *
 *   const handleYesNoAnswer = (moduleId: string, questionId: string, value: boolean) => {
 *     setAnswer(moduleId, questionId, value);
 *   };
 *
 *   const handleScaleAnswer = (moduleId: string, questionId: string, value: number) => {
 *     setAnswer(moduleId, questionId, value);
 *   };
 *
 *   const handleMultiAnswer = (moduleId: string, questionId: string, values: string[]) => {
 *     setAnswer(moduleId, questionId, values);
 *   };
 *
 *   return (
 *     <div>
 *       <p>Overall: {(overallProgress * 100).toFixed(0)}% complete</p>
 *       {eightSinsModules.map((module, idx) => (
 *         <div key={module.id}>
 *           <h2>{module.titleKey}</h2>
 *           <p>Score: {totals[module.id]} / {moduleProgress[idx].total}</p>
 *           <p>Progress: {moduleProgress[idx].answered} / {moduleProgress[idx].total}</p>
 *         </div>
 *       ))}
 *       <button onClick={reset}>Reset Progress</button>
 *     </div>
 *   );
 * }
 * ```
 */
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
        writeStorage(payload);

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
