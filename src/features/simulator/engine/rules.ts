export type TechniqueId =
  | 'gaslighting'
  | 'blame_shift'
  | 'triangulation'
  | 'love_bombing'
  | 'guilt_tripping'
  | 'future_faking';

export type Rule = {
  id: string;
  triggers: RegExp[];
  responseKey: string;
  techniques: TechniqueId[];
};

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

const defaultRule: Rule = {
  id: 'default',
  triggers: [],
  responseKey: 'sim.responses.default',
  techniques: ['gaslighting']
};

export type EngineResult = {
  rule: Rule;
  techniques: TechniqueId[];
};

export const evaluateMessage = (message: string): EngineResult => {
  const lower = message.toLowerCase();
  const matched = rules.find((rule) => rule.triggers.some((trigger) => trigger.test(lower)));

  if (!matched) {
    return { rule: defaultRule, techniques: defaultRule.techniques };
  }

  return { rule: matched, techniques: matched.techniques };
};
