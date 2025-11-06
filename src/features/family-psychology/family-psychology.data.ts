import type { FamilyPsychologySection, TransmissionNode, CommunicationExample, PatternIndicator } from './family-psychology.schema';

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

export const LIBERATION_STEPS = [
  'familyPsychology.liberation.steps.0',
  'familyPsychology.liberation.steps.1',
  'familyPsychology.liberation.steps.2',
  'familyPsychology.liberation.steps.3'
];

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
