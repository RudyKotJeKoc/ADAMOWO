// src/features/anatomy/anatomy.data.ts

import { ManipulationSchema, AnalysisFramework } from './anatomy.schema';

/**
 * Complete catalog of manipulation patterns.
 *
 * Six documented manipulation schemas derived from real-world analysis:
 * 1. Dual Communication - Contradictory words vs. actions
 * 2. Emotion Instrumentalization - Weaponizing feelings
 * 3. Inverted Triage - Prioritizing strategy over care
 * 4. Mirror Projection - Accusing others of own behaviors
 * 5. Selective Documentation - Biased record-keeping
 * 6. Moral Self-Licensing - Justifying harm through righteousness
 *
 * Each schema includes definition, warning signs, examples, and quiz.
 */
export const MANIPULATION_SCHEMAS: ManipulationSchema[] = [
  // ═══════════════════════════════════════════════════════════
  // SCHEMAT 1: ROZDWOJENIE KOMUNIKACJI
  // ═══════════════════════════════════════════════════════════
  {
    id: 'dual-communication',
    icon: 'MasksIcon',
    category: 'cognitive',
    severity: 'high',
    titleKey: 'anatomy.schemas.dualCommunication.title',
    definitionKey: 'anatomy.schemas.dualCommunication.definition',
    redFlags: [
      {
        id: 'dc-1',
        translationKey: 'anatomy.schemas.dualCommunication.flags.wordsVsActions'
      },
      {
        id: 'dc-2',
        translationKey: 'anatomy.schemas.dualCommunication.flags.loveWithLegalAction'
      },
      {
        id: 'dc-3',
        translationKey: 'anatomy.schemas.dualCommunication.flags.instrumentalEmotions'
      },
      {
        id: 'dc-4',
        translationKey: 'anatomy.schemas.dualCommunication.flags.parallelActions'
      }
    ],
    examples: [
      {
        id: 'dc-ex-1',
        context: 'anatomy.schemas.dualCommunication.examples.ex1.context',
        behavior: 'anatomy.schemas.dualCommunication.examples.ex1.behavior',
        analysis: 'anatomy.schemas.dualCommunication.examples.ex1.analysis',
        sourceDocs: ['Notatka z dziennika', 'Pełnomocnictwo']
      },
      {
        id: 'dc-ex-2',
        context: 'anatomy.schemas.dualCommunication.examples.ex2.context',
        behavior: 'anatomy.schemas.dualCommunication.examples.ex2.behavior',
        analysis: 'anatomy.schemas.dualCommunication.examples.ex2.analysis',
        sourceDocs: ['Zawiadomienie', 'Konsultacje z radcą prawnym']
      }
    ],
    quiz: {
      questionKey: 'anatomy.schemas.dualCommunication.quiz.question',
      options: [
        {
          textKey: 'anatomy.schemas.dualCommunication.quiz.opt1',
          isCorrect: false,
          explanationKey: 'anatomy.schemas.dualCommunication.quiz.exp1'
        },
        {
          textKey: 'anatomy.schemas.dualCommunication.quiz.opt2',
          isCorrect: true,
          explanationKey: 'anatomy.schemas.dualCommunication.quiz.exp2'
        },
        {
          textKey: 'anatomy.schemas.dualCommunication.quiz.opt3',
          isCorrect: false,
          explanationKey: 'anatomy.schemas.dualCommunication.quiz.exp3'
        }
      ]
    }
  },

  // ═══════════════════════════════════════════════════════════
  // SCHEMAT 2: INSTRUMENTALIZACJA EMOCJI
  // ═══════════════════════════════════════════════════════════
  {
    id: 'emotion-instrumentalization',
    icon: 'BrokenHeartIcon',
    category: 'emotional',
    severity: 'high',
    titleKey: 'anatomy.schemas.emotionInstrumentalization.title',
    definitionKey: 'anatomy.schemas.emotionInstrumentalization.definition',
    redFlags: [
      {
        id: 'ei-1',
        translationKey: 'anatomy.schemas.emotionInstrumentalization.flags.victimLanguage'
      },
      {
        id: 'ei-2',
        translationKey: 'anatomy.schemas.emotionInstrumentalization.flags.healthAsArgument'
      },
      {
        id: 'ei-3',
        translationKey: 'anatomy.schemas.emotionInstrumentalization.flags.dramaticScenarios'
      },
      {
        id: 'ei-4',
        translationKey: 'anatomy.schemas.emotionInstrumentalization.flags.fearCreation'
      }
    ],
    examples: [
      {
        id: 'ei-ex-1',
        context: 'anatomy.schemas.emotionInstrumentalization.examples.ex1.context',
        behavior: 'anatomy.schemas.emotionInstrumentalization.examples.ex1.behavior',
        analysis: 'anatomy.schemas.emotionInstrumentalization.examples.ex1.analysis',
        sourceDocs: ['Zawiadomienie', 'Zeznania ojca']
      },
      {
        id: 'ei-ex-2',
        context: 'anatomy.schemas.emotionInstrumentalization.examples.ex2.context',
        behavior: 'anatomy.schemas.emotionInstrumentalization.examples.ex2.behavior',
        analysis: 'anatomy.schemas.emotionInstrumentalization.examples.ex2.analysis',
        sourceDocs: ['Dokumentacja procedury ochronnej', 'Nocna interwencja policji']
      },
      {
        id: 'ei-ex-3',
        context: 'anatomy.schemas.emotionInstrumentalization.examples.ex3.context',
        behavior: 'anatomy.schemas.emotionInstrumentalization.examples.ex3.behavior',
        analysis: 'anatomy.schemas.emotionInstrumentalization.examples.ex3.analysis',
        sourceDocs: ['Zawiadomienie', 'Cytat ze zgłoszenia']
      }
    ],
    quiz: {
      questionKey: 'anatomy.schemas.emotionInstrumentalization.quiz.question',
      options: [
        {
          textKey: 'anatomy.schemas.emotionInstrumentalization.quiz.opt1',
          isCorrect: true,
          explanationKey: 'anatomy.schemas.emotionInstrumentalization.quiz.exp1'
        },
        {
          textKey: 'anatomy.schemas.emotionInstrumentalization.quiz.opt2',
          isCorrect: false,
          explanationKey: 'anatomy.schemas.emotionInstrumentalization.quiz.exp2'
        },
        {
          textKey: 'anatomy.schemas.emotionInstrumentalization.quiz.opt3',
          isCorrect: false,
          explanationKey: 'anatomy.schemas.emotionInstrumentalization.quiz.exp3'
        }
      ]
    }
  },

  // ═══════════════════════════════════════════════════════════
  // SCHEMAT 3: ODWRÓCONY TRIAŻ PRIORYTETÓW
  // ═══════════════════════════════════════════════════════════
  {
    id: 'inverted-triage',
    icon: 'ScalesIcon',
    category: 'cognitive',
    severity: 'high',
    titleKey: 'anatomy.schemas.invertedTriage.title',
    definitionKey: 'anatomy.schemas.invertedTriage.definition',
    redFlags: [
      {
        id: 'it-1',
        translationKey: 'anatomy.schemas.invertedTriage.flags.urgentIgnored'
      },
      {
        id: 'it-2',
        translationKey: 'anatomy.schemas.invertedTriage.flags.evidenceOverCare'
      },
      {
        id: 'it-3',
        translationKey: 'anatomy.schemas.invertedTriage.flags.opportunisticTiming'
      },
      {
        id: 'it-4',
        translationKey: 'anatomy.schemas.invertedTriage.flags.dutyNeglect'
      }
    ],
    examples: [
      {
        id: 'it-ex-1',
        context: 'anatomy.schemas.invertedTriage.examples.ex1.context',
        behavior: 'anatomy.schemas.invertedTriage.examples.ex1.behavior',
        analysis: 'anatomy.schemas.invertedTriage.examples.ex1.analysis',
        sourceDocs: ['Notatki z dziennika', 'Obowiązki opiekuna']
      }
    ],
    quiz: {
      questionKey: 'anatomy.schemas.invertedTriage.quiz.question',
      options: [
        {
          textKey: 'anatomy.schemas.invertedTriage.quiz.opt1',
          isCorrect: false,
          explanationKey: 'anatomy.schemas.invertedTriage.quiz.exp1'
        },
        {
          textKey: 'anatomy.schemas.invertedTriage.quiz.opt2',
          isCorrect: false,
          explanationKey: 'anatomy.schemas.invertedTriage.quiz.exp2'
        },
        {
          textKey: 'anatomy.schemas.invertedTriage.quiz.opt3',
          isCorrect: true,
          explanationKey: 'anatomy.schemas.invertedTriage.quiz.exp3'
        }
      ]
    }
  },

  // ═══════════════════════════════════════════════════════════
  // SCHEMAT 4: PROJEKCJA LUSTRZANA
  // ═══════════════════════════════════════════════════════════
  {
    id: 'mirror-projection',
    icon: 'MirrorIcon',
    category: 'cognitive',
    severity: 'medium',
    titleKey: 'anatomy.schemas.mirrorProjection.title',
    definitionKey: 'anatomy.schemas.mirrorProjection.definition',
    redFlags: [
      {
        id: 'mp-1',
        translationKey: 'anatomy.schemas.mirrorProjection.flags.accusationMirror'
      },
      {
        id: 'mp-2',
        translationKey: 'anatomy.schemas.mirrorProjection.flags.roleReversal'
      },
      {
        id: 'mp-3',
        translationKey: 'anatomy.schemas.mirrorProjection.flags.deflection'
      },
      {
        id: 'mp-4',
        translationKey: 'anatomy.schemas.mirrorProjection.flags.ownTraitsDenied'
      }
    ],
    examples: [
      {
        id: 'mp-ex-1',
        context: 'anatomy.schemas.mirrorProjection.examples.ex1.context',
        behavior: 'anatomy.schemas.mirrorProjection.examples.ex1.behavior',
        analysis: 'anatomy.schemas.mirrorProjection.examples.ex1.analysis',
        sourceDocs: ['Dziennik wydarzeń', 'Notatka o nocnym wtargnięciu']
      },
      {
        id: 'mp-ex-2',
        context: 'anatomy.schemas.mirrorProjection.examples.ex2.context',
        behavior: 'anatomy.schemas.mirrorProjection.examples.ex2.behavior',
        analysis: 'anatomy.schemas.mirrorProjection.examples.ex2.analysis',
        sourceDocs: ['Zarzuty agresji', 'Zeznania o wtargnięciu nocnym']
      },
      {
        id: 'mp-ex-3',
        context: 'anatomy.schemas.mirrorProjection.examples.ex3.context',
        behavior: 'anatomy.schemas.mirrorProjection.examples.ex3.behavior',
        analysis: 'anatomy.schemas.mirrorProjection.examples.ex3.analysis',
        sourceDocs: ['Notatki z dziennika', 'Pełnomocnictwo']
      }
    ],
    quiz: {
      questionKey: 'anatomy.schemas.mirrorProjection.quiz.question',
      options: [
        {
          textKey: 'anatomy.schemas.mirrorProjection.quiz.opt1',
          isCorrect: false,
          explanationKey: 'anatomy.schemas.mirrorProjection.quiz.exp1'
        },
        {
          textKey: 'anatomy.schemas.mirrorProjection.quiz.opt2',
          isCorrect: true,
          explanationKey: 'anatomy.schemas.mirrorProjection.quiz.exp2'
        },
        {
          textKey: 'anatomy.schemas.mirrorProjection.quiz.opt3',
          isCorrect: false,
          explanationKey: 'anatomy.schemas.mirrorProjection.quiz.exp3'
        }
      ]
    }
  },

  // ═══════════════════════════════════════════════════════════
  // SCHEMAT 5: SELEKTYWNA DOKUMENTACJA
  // ═══════════════════════════════════════════════════════════
  {
    id: 'selective-documentation',
    icon: 'NotebookIcon',
    category: 'institutional',
    severity: 'high',
    titleKey: 'anatomy.schemas.selectiveDocumentation.title',
    definitionKey: 'anatomy.schemas.selectiveDocumentation.definition',
    redFlags: [
      {
        id: 'sd-1',
        translationKey: 'anatomy.schemas.selectiveDocumentation.flags.onlyNegative'
      },
      {
        id: 'sd-2',
        translationKey: 'anatomy.schemas.selectiveDocumentation.flags.positiveOmitted'
      },
      {
        id: 'sd-3',
        translationKey: 'anatomy.schemas.selectiveDocumentation.flags.biasedLanguage'
      },
      {
        id: 'sd-4',
        translationKey: 'anatomy.schemas.selectiveDocumentation.flags.intentionAssumed'
      },
      {
        id: 'sd-5',
        translationKey: 'anatomy.schemas.selectiveDocumentation.flags.prosecutorialTone'
      }
    ],
    examples: [
      {
        id: 'sd-ex-1',
        context: 'anatomy.schemas.selectiveDocumentation.examples.ex1.context',
        behavior: 'anatomy.schemas.selectiveDocumentation.examples.ex1.behavior',
        analysis: 'anatomy.schemas.selectiveDocumentation.examples.ex1.analysis',
        sourceDocs: ['Dziennik wydarzeń', 'Wpis w dzienniku']
      },
      {
        id: 'sd-ex-2',
        context: 'anatomy.schemas.selectiveDocumentation.examples.ex2.context',
        behavior: 'anatomy.schemas.selectiveDocumentation.examples.ex2.behavior',
        analysis: 'anatomy.schemas.selectiveDocumentation.examples.ex2.analysis',
        sourceDocs: ['Dziennik wydarzeń', 'Wpis w dzienniku']
      },
      {
        id: 'sd-ex-3',
        context: 'anatomy.schemas.selectiveDocumentation.examples.ex3.context',
        behavior: 'anatomy.schemas.selectiveDocumentation.examples.ex3.behavior',
        analysis: 'anatomy.schemas.selectiveDocumentation.examples.ex3.analysis',
        sourceDocs: ['Dziennik wydarzeń z kilku miesięcy', 'Brak wpisów o pomocy']
      }
    ],
    quiz: {
      questionKey: 'anatomy.schemas.selectiveDocumentation.quiz.question',
      options: [
        {
          textKey: 'anatomy.schemas.selectiveDocumentation.quiz.opt1',
          isCorrect: false,
          explanationKey: 'anatomy.schemas.selectiveDocumentation.quiz.exp1'
        },
        {
          textKey: 'anatomy.schemas.selectiveDocumentation.quiz.opt2',
          isCorrect: true,
          explanationKey: 'anatomy.schemas.selectiveDocumentation.quiz.exp2'
        },
        {
          textKey: 'anatomy.schemas.selectiveDocumentation.quiz.opt3',
          isCorrect: false,
          explanationKey: 'anatomy.schemas.selectiveDocumentation.quiz.exp3'
        }
      ]
    }
  },

  // ═══════════════════════════════════════════════════════════
  // SCHEMAT 6: MORALNE SAMOLICENCJONOWANIE
  // ═══════════════════════════════════════════════════════════
  {
    id: 'moral-self-licensing',
    icon: 'ShieldIcon',
    category: 'emotional',
    severity: 'medium',
    titleKey: 'anatomy.schemas.moralSelfLicensing.title',
    definitionKey: 'anatomy.schemas.moralSelfLicensing.definition',
    redFlags: [
      {
        id: 'msl-1',
        translationKey: 'anatomy.schemas.moralSelfLicensing.flags.higherValues'
      },
      {
        id: 'msl-2',
        translationKey: 'anatomy.schemas.moralSelfLicensing.flags.victimAsHero'
      },
      {
        id: 'msl-3',
        translationKey: 'anatomy.schemas.moralSelfLicensing.flags.institutionWeapon'
      },
      {
        id: 'msl-4',
        translationKey: 'anatomy.schemas.moralSelfLicensing.flags.chorusOfSupport'
      },
      {
        id: 'msl-5',
        translationKey: 'anatomy.schemas.moralSelfLicensing.flags.privateVengeance'
      }
    ],
    examples: [
      {
        id: 'msl-ex-1',
        context: 'anatomy.schemas.moralSelfLicensing.examples.ex1.context',
        behavior: 'anatomy.schemas.moralSelfLicensing.examples.ex1.behavior',
        analysis: 'anatomy.schemas.moralSelfLicensing.examples.ex1.analysis',
        sourceDocs: ['Pozew cywilny', 'Art. 898 § 1 k.c.']
      },
      {
        id: 'msl-ex-2',
        context: 'anatomy.schemas.moralSelfLicensing.examples.ex2.context',
        behavior: 'anatomy.schemas.moralSelfLicensing.examples.ex2.behavior',
        analysis: 'anatomy.schemas.moralSelfLicensing.examples.ex2.analysis',
        sourceDocs: ['Procedura ochronna', 'Zawiadomienie', 'Konsultacje prawne']
      },
      {
        id: 'msl-ex-3',
        context: 'anatomy.schemas.moralSelfLicensing.examples.ex3.context',
        behavior: 'anatomy.schemas.moralSelfLicensing.examples.ex3.behavior',
        analysis: 'anatomy.schemas.moralSelfLicensing.examples.ex3.analysis',
        sourceDocs: ['Dokumentacja sprawy', 'Zeznania rodzeństwa']
      }
    ],
    quiz: {
      questionKey: 'anatomy.schemas.moralSelfLicensing.quiz.question',
      options: [
        {
          textKey: 'anatomy.schemas.moralSelfLicensing.quiz.opt1',
          isCorrect: false,
          explanationKey: 'anatomy.schemas.moralSelfLicensing.quiz.exp1'
        },
        {
          textKey: 'anatomy.schemas.moralSelfLicensing.quiz.opt2',
          isCorrect: false,
          explanationKey: 'anatomy.schemas.moralSelfLicensing.quiz.exp2'
        },
        {
          textKey: 'anatomy.schemas.moralSelfLicensing.quiz.opt3',
          isCorrect: true,
          explanationKey: 'anatomy.schemas.moralSelfLicensing.quiz.exp3'
        }
      ]
    }
  }
];

// ═══════════════════════════════════════════════════════════
// FRAMEWORK ANALIZY
// ═══════════════════════════════════════════════════════════

/**
 * Three-step framework for analyzing manipulative situations.
 *
 * Guides users through systematic examination:
 * 1. Identify the behavior pattern
 * 2. Analyze the impact and intent
 * 3. Determine appropriate response
 *
 * Each step includes prompts and placeholders for user reflection.
 */
export const ANALYSIS_FRAMEWORK: AnalysisFramework = {
  steps: [
    {
      number: 1,
      titleKey: 'anatomy.framework.step1.title',
      descriptionKey: 'anatomy.framework.step1.description',
      placeholderKey: 'anatomy.framework.step1.placeholder'
    },
    {
      number: 2,
      titleKey: 'anatomy.framework.step2.title',
      descriptionKey: 'anatomy.framework.step2.description',
      placeholderKey: 'anatomy.framework.step2.placeholder'
    },
    {
      number: 3,
      titleKey: 'anatomy.framework.step3.title',
      descriptionKey: 'anatomy.framework.step3.description',
      placeholderKey: 'anatomy.framework.step3.placeholder'
    }
  ]
};

// ═══════════════════════════════════════════════════════════
// MAPOWANIE IKON (dla referencji)
// ═══════════════════════════════════════════════════════════

/**
 * Icon-to-schema reference map.
 *
 * Maps icon names to emoji and their associated manipulation patterns:
 * - 🎭 MasksIcon: Dual Communication
 * - 💔 BrokenHeartIcon: Emotion Instrumentalization
 * - ⚖️ ScalesIcon: Inverted Triage
 * - 🪞 MirrorIcon: Mirror Projection
 * - 📔 NotebookIcon: Selective Documentation
 * - 🛡️ ShieldIcon: Moral Self-Licensing
 */
export const SCHEMA_ICON_MAP = {
  'MasksIcon': '🎭',        // Rozdwojenie komunikacji
  'BrokenHeartIcon': '💔',   // Instrumentalizacja emocji
  'ScalesIcon': '⚖️',        // Odwrócony triaż
  'MirrorIcon': '🪞',        // Projekcja lustrzana
  'NotebookIcon': '📔',      // Selektywna dokumentacja
  'ShieldIcon': '🛡️'         // Moralne samolicencjonowanie
};
