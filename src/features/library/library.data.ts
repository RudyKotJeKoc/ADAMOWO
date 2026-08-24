import type { LibraryEntry } from './library.schema';

/**
 * Collection of educational library entries.
 *
 * Comprehensive catalog of case studies, analysis tools, and documentation
 * resources for the community. Each entry includes:
 * - Detailed content sections
 * - Practical tips for application
 * - Chronological timelines
 * - Related documents and resources
 * - Categorization tags
 *
 * Current entries:
 * 1. family_isolation_case - Case study of family isolation dynamics
 * 2. calendar_analysis - Timeline and pattern analysis methodology
 * 3. prince_ingratitude - Analysis of manipulation tactics
 * 4. investigation_docs - Documentation and evidence gathering guide
 */
export const LIBRARY_ENTRIES: LibraryEntry[] = [
  {
    id: 'family_isolation_case',
    titleKey: 'library.entries.familyIsolationCase.title',
    summaryKey: 'library.entries.familyIsolationCase.summary',
    contentKeys: [
      'library.entries.familyIsolationCase.content.0',
      'library.entries.familyIsolationCase.content.1',
      'library.entries.familyIsolationCase.content.2'
    ],
    tipsKeys: [
      'library.entries.familyIsolationCase.tips.0',
      'library.entries.familyIsolationCase.tips.1',
      'library.entries.familyIsolationCase.tips.2'
    ],
    timeline: [
      {
        when: 'library.entries.familyIsolationCase.timeline.0.when',
        title: 'library.entries.familyIsolationCase.timeline.0.title',
        note: 'library.entries.familyIsolationCase.timeline.0.note'
      },
      {
        when: 'library.entries.familyIsolationCase.timeline.1.when',
        title: 'library.entries.familyIsolationCase.timeline.1.title',
        note: 'library.entries.familyIsolationCase.timeline.1.note'
      },
      {
        when: 'library.entries.familyIsolationCase.timeline.2.when',
        title: 'library.entries.familyIsolationCase.timeline.2.title'
      }
    ],
    resources: [
      {
        label: 'library.entries.familyIsolationCase.resources.0',
        url: '/assets/docs/family-isolation-report.pdf'
      },
      {
        label: 'library.entries.familyIsolationCase.resources.1',
        url: '/assets/docs/family-isolation-checklist.pdf'
      }
    ],
    tags: ['library.tags.caseStudy', 'library.tags.escalation', 'library.tags.family']
  },
  {
    id: 'calendar_analysis',
    titleKey: 'library.entries.calendarAnalysis.title',
    summaryKey: 'library.entries.calendarAnalysis.summary',
    contentKeys: [
      'library.entries.calendarAnalysis.content.0',
      'library.entries.calendarAnalysis.content.1',
      'library.entries.calendarAnalysis.content.2'
    ],
    tipsKeys: [
      'library.entries.calendarAnalysis.tips.0',
      'library.entries.calendarAnalysis.tips.1',
      'library.entries.calendarAnalysis.tips.2'
    ],
    timeline: [
      {
        when: 'library.entries.calendarAnalysis.timeline.0.when',
        title: 'library.entries.calendarAnalysis.timeline.0.title',
        note: 'library.entries.calendarAnalysis.timeline.0.note'
      },
      {
        when: 'library.entries.calendarAnalysis.timeline.1.when',
        title: 'library.entries.calendarAnalysis.timeline.1.title',
        note: 'library.entries.calendarAnalysis.timeline.1.note'
      },
      {
        when: 'library.entries.calendarAnalysis.timeline.2.when',
        title: 'library.entries.calendarAnalysis.timeline.2.title'
      }
    ],
    resources: [
      {
        label: 'library.entries.calendarAnalysis.resources.0',
        url: '/assets/docs/calendar-analysis-template.pdf'
      }
    ],
    tags: ['library.tags.timeline', 'library.tags.data', 'library.tags.patterns']
  },
  {
    id: 'prince_ingratitude',
    titleKey: 'library.entries.princeIngratitude.title',
    summaryKey: 'library.entries.princeIngratitude.summary',
    contentKeys: [
      'library.entries.princeIngratitude.content.0',
      'library.entries.princeIngratitude.content.1',
      'library.entries.princeIngratitude.content.2'
    ],
    tipsKeys: [
      'library.entries.princeIngratitude.tips.0',
      'library.entries.princeIngratitude.tips.1',
      'library.entries.princeIngratitude.tips.2'
    ],
    timeline: [
      {
        when: 'library.entries.princeIngratitude.timeline.0.when',
        title: 'library.entries.princeIngratitude.timeline.0.title'
      },
      {
        when: 'library.entries.princeIngratitude.timeline.1.when',
        title: 'library.entries.princeIngratitude.timeline.1.title',
        note: 'library.entries.princeIngratitude.timeline.1.note'
      }
    ],
    resources: [
      {
        label: 'library.entries.princeIngratitude.resources.0',
        url: '/assets/docs/prince-ingratitude-reflection.pdf'
      }
    ],
    tags: ['library.tags.tactics', 'library.tags.narcissism', 'library.tags.relationships']
  },
  {
    id: 'investigation_docs',
    titleKey: 'library.entries.investigationDocs.title',
    summaryKey: 'library.entries.investigationDocs.summary',
    contentKeys: [
      'library.entries.investigationDocs.content.0',
      'library.entries.investigationDocs.content.1',
      'library.entries.investigationDocs.content.2'
    ],
    tipsKeys: [
      'library.entries.investigationDocs.tips.0',
      'library.entries.investigationDocs.tips.1',
      'library.entries.investigationDocs.tips.2'
    ],
    timeline: [
      {
        when: 'library.entries.investigationDocs.timeline.0.when',
        title: 'library.entries.investigationDocs.timeline.0.title'
      },
      {
        when: 'library.entries.investigationDocs.timeline.1.when',
        title: 'library.entries.investigationDocs.timeline.1.title',
        note: 'library.entries.investigationDocs.timeline.1.note'
      },
      {
        when: 'library.entries.investigationDocs.timeline.2.when',
        title: 'library.entries.investigationDocs.timeline.2.title'
      }
    ],
    resources: [
      {
        label: 'library.entries.investigationDocs.resources.0',
        url: '/assets/docs/investigation-evidence-log.pdf'
      },
      {
        label: 'library.entries.investigationDocs.resources.1',
        url: '/assets/docs/investigation-interview-guide.pdf'
      }
    ],
    tags: ['library.tags.documentation', 'library.tags.procedures', 'library.tags.community']
  }
];
