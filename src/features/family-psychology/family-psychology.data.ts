import type { FamilyPsychologySection, TransmissionNode, CommunicationExample, PatternIndicator } from './family-psychology.schema';

/**
 * Educational sections for family psychology content.
 *
 * Organized into themed sections covering:
 * - Mechanisms of family dysfunction
 * - Pattern recognition techniques
 * - Observer perspective analysis
 * - Intergenerational curse dynamics
 * - Liberation strategies
 */
export const PSYCHOLOGY_SECTIONS: FamilyPsychologySection[] = [
  {
    id: 'mechanisms',
    titleKey: 'familyPsychology.sections.mechanisms.title',
    contentKeys: [
      'familyPsychology.sections.mechanisms.content.0',
      'familyPsychology.sections.mechanisms.content.1',
      'familyPsychology.sections.mechanisms.content.2'
    ],
    type: 'intro'
  },
  {
    id: 'recognition',
    titleKey: 'familyPsychology.sections.recognition.title',
    contentKeys: [
      'familyPsychology.sections.recognition.content.0'
    ],
    type: 'patterns'
  },
  {
    id: 'observer',
    titleKey: 'familyPsychology.sections.observer.title',
    contentKeys: [
      'familyPsychology.sections.observer.content.0',
      'familyPsychology.sections.observer.content.1'
    ],
    type: 'observer'
  },
  {
    id: 'curse',
    titleKey: 'familyPsychology.sections.curse.title',
    contentKeys: [
      'familyPsychology.sections.curse.content.0',
      'familyPsychology.sections.curse.content.1',
      'familyPsychology.sections.curse.content.2'
    ],
    type: 'curse'
  },
  {
    id: 'liberation',
    titleKey: 'familyPsychology.sections.liberation.title',
    contentKeys: [
      'familyPsychology.sections.liberation.content.0'
    ],
    type: 'liberation'
  }
];

/**
 * Intergenerational trauma transmission chain.
 *
 * Maps the flow of traumatic patterns through family generations:
 * 1. Father (grandfather) - Original trauma source
 * 2. Barbara - Received and internalized patterns
 * 3. Son (protagonist) - Inherited behavioral scripts
 * 4. Partner - Cycle continuation risk
 */
export const TRANSMISSION_CHAIN: TransmissionNode[] = [
  {
    nameKey: 'familyPsychology.transmission.father.name',
    mechanismKey: 'familyPsychology.transmission.father.mechanism'
  },
  {
    nameKey: 'familyPsychology.transmission.barbara.name',
    mechanismKey: 'familyPsychology.transmission.barbara.mechanism'
  },
  {
    nameKey: 'familyPsychology.transmission.son.name',
    mechanismKey: 'familyPsychology.transmission.son.mechanism'
  },
  {
    nameKey: 'familyPsychology.transmission.partner.name',
    mechanismKey: 'familyPsychology.transmission.partner.mechanism'
  }
];

/**
 * Behavioral pattern indicators for recognition.
 *
 * Key warning signs of dysfunctional family dynamics:
 * - Affect writing: Emotional state dictating communication
 * - Blame shifting: Deflecting responsibility onto others
 * - Revenge threats: Using threats as control mechanisms
 * - Polite masking: Superficial courtesy hiding hostility
 * - Past justification: Using history to excuse present harm
 */
export const PATTERN_INDICATORS: PatternIndicator[] = [
  {
    titleKey: 'familyPsychology.patterns.affectWriting.title',
    descriptionKey: 'familyPsychology.patterns.affectWriting.description'
  },
  {
    titleKey: 'familyPsychology.patterns.blameShifting.title',
    descriptionKey: 'familyPsychology.patterns.blameShifting.description'
  },
  {
    titleKey: 'familyPsychology.patterns.revengeThreats.title',
    descriptionKey: 'familyPsychology.patterns.revengeThreats.description'
  },
  {
    titleKey: 'familyPsychology.patterns.politeMasking.title',
    descriptionKey: 'familyPsychology.patterns.politeMasking.description'
  },
  {
    titleKey: 'familyPsychology.patterns.pastJustification.title',
    descriptionKey: 'familyPsychology.patterns.pastJustification.description'
  }
];

/**
 * Communication pattern examples with progression.
 *
 * Illustrates evolution from reactive to conscious communication:
 * 1. Impulsive: Unfiltered emotional reactions
 * 2. Assertive: Boundary-setting responses
 * 3. Conscious: Reflective, empathetic dialogue
 */
export const COMMUNICATION_EXAMPLES: CommunicationExample[] = [
  {
    typeKey: 'familyPsychology.communication.impulsive.type',
    descriptionKey: 'familyPsychology.communication.impulsive.description',
    exampleKey: 'familyPsychology.communication.impulsive.example'
  },
  {
    typeKey: 'familyPsychology.communication.assertive.type',
    descriptionKey: 'familyPsychology.communication.assertive.description',
    exampleKey: 'familyPsychology.communication.assertive.example'
  },
  {
    typeKey: 'familyPsychology.communication.conscious.type',
    descriptionKey: 'familyPsychology.communication.conscious.description',
    exampleKey: 'familyPsychology.communication.conscious.example'
  }
];

/**
 * Steps toward liberation from family patterns.
 *
 * Progressive steps for breaking intergenerational cycles:
 * - Recognizing inherited patterns
 * - Understanding transmission mechanisms
 * - Developing alternative responses
 * - Creating new relational models
 */
export const LIBERATION_STEPS = [
  'familyPsychology.liberation.steps.0',
  'familyPsychology.liberation.steps.1',
  'familyPsychology.liberation.steps.2',
  'familyPsychology.liberation.steps.3'
];

/**
 * Scientific and clinical references for further learning.
 *
 * Links to authoritative resources on:
 * - Psychological projection
 * - Gaslighting dynamics
 * - Intergenerational trauma transmission
 * - Passive-aggressive behavior
 * - Defense mechanisms
 */
export const SCIENTIFIC_REFERENCES = [
  {
    termKey: 'familyPsychology.references.projection.term',
    urlKey: 'familyPsychology.references.projection.url'
  },
  {
    termKey: 'familyPsychology.references.gaslighting.term',
    urlKey: 'familyPsychology.references.gaslighting.url'
  },
  {
    termKey: 'familyPsychology.references.transmission.term',
    urlKey: 'familyPsychology.references.transmission.url'
  },
  {
    termKey: 'familyPsychology.references.passiveAggressive.term',
    urlKey: 'familyPsychology.references.passiveAggressive.url'
  },
  {
    termKey: 'familyPsychology.references.defenseMechanisms.term',
    urlKey: 'familyPsychology.references.defenseMechanisms.url'
  }
];
