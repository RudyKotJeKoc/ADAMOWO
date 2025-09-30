import type { DocMeta } from './doc.schema';

export const documentaryMeta: DocMeta = {
  titleKey: 'documentary.title',
  descriptionKey: 'documentary.description',
  resources: [
    {
      id: 'timeline',
      type: 'guide',
      url: 'https://radio-adamowo.example.com/docs/timeline.pdf',
      titleKey: 'documentary.resources.timeline.title',
      descriptionKey: 'documentary.resources.timeline.description'
    },
    {
      id: 'profile',
      type: 'article',
      url: 'https://radio-adamowo.example.com/docs/profile',
      titleKey: 'documentary.resources.profile.title',
      descriptionKey: 'documentary.resources.profile.description'
    },
    {
      id: 'legal',
      type: 'pdf',
      url: 'https://radio-adamowo.example.com/docs/legal-brief.pdf',
      titleKey: 'documentary.resources.legal.title',
      descriptionKey: 'documentary.resources.legal.description'
    }
  ],
  chapters: [
    {
      id: 'prologue',
      time: 0,
      titleKey: 'documentary.chapters.prologue.title',
      summaryKey: 'documentary.chapters.prologue.summary'
    },
    {
      id: 'escalation',
      time: 312,
      titleKey: 'documentary.chapters.escalation.title',
      summaryKey: 'documentary.chapters.escalation.summary'
    },
    {
      id: 'intervention',
      time: 846,
      titleKey: 'documentary.chapters.intervention.title',
      summaryKey: 'documentary.chapters.intervention.summary'
    },
    {
      id: 'aftermath',
      time: 1298,
      titleKey: 'documentary.chapters.aftermath.title',
      summaryKey: 'documentary.chapters.aftermath.summary'
    }
  ]
};
