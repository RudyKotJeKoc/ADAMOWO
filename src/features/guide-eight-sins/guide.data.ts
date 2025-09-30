import { SinModuleData } from './guide.schema';

export const eightSinsModules: SinModuleData[] = [
  {
    id: 'sin_1',
    titleKey: 'sin_1.title',
    descriptionKey: 'sin_1.desc',
    examplesKeys: ['sin_1.example_1', 'sin_1.example_2', 'sin_1.example_3'],
    thresholds: {
      low: 4,
      medium: 9,
      high: 14
    },
    resourcesKeys: ['guide.resources.financialHelp', 'guide.resources.reportAbuse'],
    questions: [
      {
        id: 'sin_1_q_1',
        type: 'yn',
        textKey: 'sin_1.q_1',
        helpKey: 'sin_1.help_1',
        weight: 2
      },
      {
        id: 'sin_1_q_2',
        type: 'scale',
        textKey: 'sin_1.q_2',
        helpKey: 'sin_1.help_2',
        weight: 1,
        scaleMax: 5
      },
      {
        id: 'sin_1_q_3',
        type: 'multi',
        textKey: 'sin_1.q_3',
        options: [
          { key: 'sin_1.q_3.opt_1', weight: 2 },
          { key: 'sin_1.q_3.opt_2', weight: 1 },
          { key: 'sin_1.q_3.opt_3', weight: 2 }
        ]
      },
      {
        id: 'sin_1_q_4',
        type: 'scale',
        textKey: 'sin_1.q_4',
        weight: 2
      },
      {
        id: 'sin_1_q_5',
        type: 'yn',
        textKey: 'sin_1.q_5',
        weight: 3
      }
    ]
  },
  {
    id: 'sin_2',
    titleKey: 'sin_2.title',
    descriptionKey: 'sin_2.desc',
    examplesKeys: ['sin_2.example_1', 'sin_2.example_2', 'sin_2.example_3'],
    thresholds: {
      low: 5,
      medium: 10,
      high: 15
    },
    resourcesKeys: ['guide.resources.emotionalSupport', 'guide.resources.boundaries'],
    questions: [
      {
        id: 'sin_2_q_1',
        type: 'yn',
        textKey: 'sin_2.q_1',
        weight: 2
      },
      {
        id: 'sin_2_q_2',
        type: 'scale',
        textKey: 'sin_2.q_2',
        weight: 1
      },
      {
        id: 'sin_2_q_3',
        type: 'multi',
        textKey: 'sin_2.q_3',
        options: [
          { key: 'sin_2.q_3.opt_1', weight: 2 },
          { key: 'sin_2.q_3.opt_2', weight: 1 },
          { key: 'sin_2.q_3.opt_3', weight: 1 }
        ]
      },
      {
        id: 'sin_2_q_4',
        type: 'yn',
        textKey: 'sin_2.q_4',
        weight: 3
      },
      {
        id: 'sin_2_q_5',
        type: 'scale',
        textKey: 'sin_2.q_5',
        weight: 2
      }
    ]
  },
  {
    id: 'sin_3',
    titleKey: 'sin_3.title',
    descriptionKey: 'sin_3.desc',
    examplesKeys: ['sin_3.example_1', 'sin_3.example_2', 'sin_3.example_3'],
    thresholds: {
      low: 6,
      medium: 11,
      high: 16
    },
    resourcesKeys: ['guide.resources.psychologicalHelp', 'guide.resources.documentation'],
    questions: [
      {
        id: 'sin_3_q_1',
        type: 'yn',
        textKey: 'sin_3.q_1',
        weight: 3
      },
      {
        id: 'sin_3_q_2',
        type: 'scale',
        textKey: 'sin_3.q_2',
        weight: 1
      },
      {
        id: 'sin_3_q_3',
        type: 'multi',
        textKey: 'sin_3.q_3',
        options: [
          { key: 'sin_3.q_3.opt_1', weight: 2 },
          { key: 'sin_3.q_3.opt_2', weight: 2 },
          { key: 'sin_3.q_3.opt_3', weight: 1 }
        ]
      },
      {
        id: 'sin_3_q_4',
        type: 'scale',
        textKey: 'sin_3.q_4',
        weight: 2
      },
      {
        id: 'sin_3_q_5',
        type: 'yn',
        textKey: 'sin_3.q_5',
        weight: 2
      }
    ]
  },
  {
    id: 'sin_4',
    titleKey: 'sin_4.title',
    descriptionKey: 'sin_4.desc',
    examplesKeys: ['sin_4.example_1', 'sin_4.example_2', 'sin_4.example_3'],
    thresholds: {
      low: 5,
      medium: 9,
      high: 14
    },
    resourcesKeys: ['guide.resources.safetyPlan', 'guide.resources.digitalSecurity'],
    questions: [
      {
        id: 'sin_4_q_1',
        type: 'yn',
        textKey: 'sin_4.q_1',
        weight: 3
      },
      {
        id: 'sin_4_q_2',
        type: 'scale',
        textKey: 'sin_4.q_2',
        weight: 2
      },
      {
        id: 'sin_4_q_3',
        type: 'multi',
        textKey: 'sin_4.q_3',
        options: [
          { key: 'sin_4.q_3.opt_1', weight: 2 },
          { key: 'sin_4.q_3.opt_2', weight: 1 },
          { key: 'sin_4.q_3.opt_3', weight: 1 }
        ]
      },
      {
        id: 'sin_4_q_4',
        type: 'yn',
        textKey: 'sin_4.q_4',
        weight: 2
      },
      {
        id: 'sin_4_q_5',
        type: 'scale',
        textKey: 'sin_4.q_5',
        weight: 1
      }
    ]
  },
  {
    id: 'sin_5',
    titleKey: 'sin_5.title',
    descriptionKey: 'sin_5.desc',
    examplesKeys: ['sin_5.example_1', 'sin_5.example_2', 'sin_5.example_3'],
    thresholds: {
      low: 5,
      medium: 10,
      high: 15
    },
    resourcesKeys: ['guide.resources.legalAdvice', 'guide.resources.documentation'],
    questions: [
      {
        id: 'sin_5_q_1',
        type: 'yn',
        textKey: 'sin_5.q_1',
        weight: 2
      },
      {
        id: 'sin_5_q_2',
        type: 'scale',
        textKey: 'sin_5.q_2',
        weight: 2
      },
      {
        id: 'sin_5_q_3',
        type: 'multi',
        textKey: 'sin_5.q_3',
        options: [
          { key: 'sin_5.q_3.opt_1', weight: 2 },
          { key: 'sin_5.q_3.opt_2', weight: 1 },
          { key: 'sin_5.q_3.opt_3', weight: 2 }
        ]
      },
      {
        id: 'sin_5_q_4',
        type: 'yn',
        textKey: 'sin_5.q_4',
        weight: 3
      },
      {
        id: 'sin_5_q_5',
        type: 'scale',
        textKey: 'sin_5.q_5',
        weight: 1
      }
    ]
  },
  {
    id: 'sin_6',
    titleKey: 'sin_6.title',
    descriptionKey: 'sin_6.desc',
    examplesKeys: ['sin_6.example_1', 'sin_6.example_2', 'sin_6.example_3'],
    thresholds: {
      low: 5,
      medium: 10,
      high: 15
    },
    resourcesKeys: ['guide.resources.emotionalSupport', 'guide.resources.safetyPlan'],
    questions: [
      {
        id: 'sin_6_q_1',
        type: 'yn',
        textKey: 'sin_6.q_1',
        weight: 3
      },
      {
        id: 'sin_6_q_2',
        type: 'scale',
        textKey: 'sin_6.q_2',
        weight: 2
      },
      {
        id: 'sin_6_q_3',
        type: 'multi',
        textKey: 'sin_6.q_3',
        options: [
          { key: 'sin_6.q_3.opt_1', weight: 2 },
          { key: 'sin_6.q_3.opt_2', weight: 2 },
          { key: 'sin_6.q_3.opt_3', weight: 1 }
        ]
      },
      {
        id: 'sin_6_q_4',
        type: 'scale',
        textKey: 'sin_6.q_4',
        weight: 1
      },
      {
        id: 'sin_6_q_5',
        type: 'yn',
        textKey: 'sin_6.q_5',
        weight: 2
      }
    ]
  },
  {
    id: 'sin_7',
    titleKey: 'sin_7.title',
    descriptionKey: 'sin_7.desc',
    examplesKeys: ['sin_7.example_1', 'sin_7.example_2', 'sin_7.example_3'],
    thresholds: {
      low: 6,
      medium: 11,
      high: 16
    },
    resourcesKeys: ['guide.resources.documentation', 'guide.resources.trustedPerson'],
    questions: [
      {
        id: 'sin_7_q_1',
        type: 'yn',
        textKey: 'sin_7.q_1',
        weight: 2
      },
      {
        id: 'sin_7_q_2',
        type: 'scale',
        textKey: 'sin_7.q_2',
        weight: 1
      },
      {
        id: 'sin_7_q_3',
        type: 'multi',
        textKey: 'sin_7.q_3',
        options: [
          { key: 'sin_7.q_3.opt_1', weight: 2 },
          { key: 'sin_7.q_3.opt_2', weight: 1 },
          { key: 'sin_7.q_3.opt_3', weight: 2 }
        ]
      },
      {
        id: 'sin_7_q_4',
        type: 'scale',
        textKey: 'sin_7.q_4',
        weight: 2
      },
      {
        id: 'sin_7_q_5',
        type: 'yn',
        textKey: 'sin_7.q_5',
        weight: 2
      }
    ]
  },
  {
    id: 'sin_8',
    titleKey: 'sin_8.title',
    descriptionKey: 'sin_8.desc',
    examplesKeys: ['sin_8.example_1', 'sin_8.example_2', 'sin_8.example_3'],
    thresholds: {
      low: 5,
      medium: 10,
      high: 15
    },
    resourcesKeys: ['guide.resources.trustedPerson', 'guide.resources.communitySupport'],
    questions: [
      {
        id: 'sin_8_q_1',
        type: 'yn',
        textKey: 'sin_8.q_1',
        weight: 2
      },
      {
        id: 'sin_8_q_2',
        type: 'scale',
        textKey: 'sin_8.q_2',
        weight: 1
      },
      {
        id: 'sin_8_q_3',
        type: 'multi',
        textKey: 'sin_8.q_3',
        options: [
          { key: 'sin_8.q_3.opt_1', weight: 2 },
          { key: 'sin_8.q_3.opt_2', weight: 1 },
          { key: 'sin_8.q_3.opt_3', weight: 2 }
        ]
      },
      {
        id: 'sin_8_q_4',
        type: 'scale',
        textKey: 'sin_8.q_4',
        weight: 2
      },
      {
        id: 'sin_8_q_5',
        type: 'yn',
        textKey: 'sin_8.q_5',
        weight: 3
      }
    ]
  }
];
