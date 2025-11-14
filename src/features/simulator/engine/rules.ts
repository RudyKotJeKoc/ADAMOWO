/**
 * Identifier for manipulation techniques used in the simulator.
 *
 * Recognized patterns:
 * - gaslighting: Making someone question their reality
 * - blame_shift: Deflecting responsibility onto others
 * - triangulation: Using third parties to validate claims
 * - love_bombing: Overwhelming with affection to manipulate
 * - guilt_tripping: Using guilt to control behavior
 * - future_faking: Making false promises about the future
 */
export type TechniqueId =
  | 'gaslighting'
  | 'blame_shift'
  | 'triangulation'
  | 'love_bombing'
  | 'guilt_tripping'
  | 'future_faking';

/**
 * Pattern matching rule for detecting manipulation techniques.
 *
 * @property id - Unique rule identifier
 * @property triggers - RegExp patterns to match against user input
 * @property responseKey - Translation key for the response message
 * @property techniques - Manipulation techniques this rule identifies
 */
export type Rule = {
  id: string;
  triggers: RegExp[];
  responseKey: string;
  techniques: TechniqueId[];
};

/**
 * Catalog of all manipulation techniques with their metadata.
 *
 * Maps each technique to its localized labels, descriptions, and tips.
 * All values are translation keys for i18n support.
 */
export const techniqueCatalog: Record<
  TechniqueId,
  { labelKey: string; descriptionKey: string; tipKey: string }
> = {
  gaslighting: {
    labelKey: 'sim.techniques.gaslighting.label',
    descriptionKey: 'sim.techniques.gaslighting.description',
    tipKey: 'sim.techniques.gaslighting.tip'
  },
  blame_shift: {
    labelKey: 'sim.techniques.blameShift.label',
    descriptionKey: 'sim.techniques.blameShift.description',
    tipKey: 'sim.techniques.blameShift.tip'
  },
  triangulation: {
    labelKey: 'sim.techniques.triangulation.label',
    descriptionKey: 'sim.techniques.triangulation.description',
    tipKey: 'sim.techniques.triangulation.tip'
  },
  love_bombing: {
    labelKey: 'sim.techniques.loveBombing.label',
    descriptionKey: 'sim.techniques.loveBombing.description',
    tipKey: 'sim.techniques.loveBombing.tip'
  },
  guilt_tripping: {
    labelKey: 'sim.techniques.guiltTripping.label',
    descriptionKey: 'sim.techniques.guiltTripping.description',
    tipKey: 'sim.techniques.guiltTripping.tip'
  },
  future_faking: {
    labelKey: 'sim.techniques.futureFaking.label',
    descriptionKey: 'sim.techniques.futureFaking.description',
    tipKey: 'sim.techniques.futureFaking.tip'
  }
};

/**
 * Detection rules for manipulation patterns.
 *
 * Each rule matches specific phrases or keywords (in Polish and English)
 * and identifies which manipulation techniques are being used.
 */
export const rules: Rule[] = [
  {
    id: 'gaslighting_overreacting',
    triggers: [/przesadzasz/i, /overreact/i, /przewrażliw/i],
    responseKey: 'sim.responses.gaslighting.overreacting',
    techniques: ['gaslighting']
  },
  {
    id: 'blame_shift_your_fault',
    triggers: [/twoja wina/i, /your fault/i, /gdybyś ty/i],
    responseKey: 'sim.responses.blameShift.yourFault',
    techniques: ['blame_shift']
  },
  {
    id: 'triangulation_friends',
    triggers: [/wszyscy/i, /friends say/i, /inni mówią/i],
    responseKey: 'sim.responses.triangulation.everyone',
    techniques: ['triangulation']
  },
  {
    id: 'love_bombing_promises',
    triggers: [/obiecuj/i, /promise/i, /zmienię się/i],
    responseKey: 'sim.responses.loveBombing.promises',
    techniques: ['love_bombing', 'future_faking']
  },
  {
    id: 'guilt_tripping_sacrifice',
    triggers: [/poświęcił/i, /sacrific/i, /wszystko robię/i],
    responseKey: 'sim.responses.guiltTripping.sacrifice',
    techniques: ['guilt_tripping']
  },
  {
    id: 'future_faking_plans',
    triggers: [/dom/i, /marriage/i, /ślub/i, /plan/i],
    responseKey: 'sim.responses.futureFaking.plans',
    techniques: ['future_faking']
  }
];

/**
 * Fallback rule used when no patterns match.
 *
 * Ensures the simulator always provides a response, defaulting
 * to gaslighting detection.
 *
 * @internal
 */
const defaultRule: Rule = {
  id: 'default',
  triggers: [],
  responseKey: 'sim.responses.default',
  techniques: ['gaslighting']
};

/**
 * Result from evaluating a message through the rule engine.
 *
 * @property rule - Matched rule (or default if no match)
 * @property techniques - Detected manipulation techniques
 */
export type EngineResult = {
  rule: Rule;
  techniques: TechniqueId[];
};

/**
 * Evaluates user input to detect manipulation patterns.
 *
 * Tests the message against all rule triggers in order.
 * Returns the first matching rule, or the default rule if
 * no patterns match.
 *
 * @param message - User input to analyze
 * @returns Matched rule and detected techniques
 *
 * @example
 * ```ts
 * import { evaluateMessage } from './rules';
 *
 * const result = evaluateMessage("You're overreacting!");
 * console.log(result.rule.id); // 'gaslighting_overreacting'
 * console.log(result.techniques); // ['gaslighting']
 *
 * const result2 = evaluateMessage("Everyone thinks you're wrong");
 * console.log(result2.techniques); // ['triangulation']
 * ```
 */
export const evaluateMessage = (message: string): EngineResult => {
  const lower = message.toLowerCase();
  const matched = rules.find((rule) => rule.triggers.some((trigger) => trigger.test(lower)));

  if (!matched) {
    return { rule: defaultRule, techniques: defaultRule.techniques };
  }

  return { rule: matched, techniques: matched.techniques };
};
