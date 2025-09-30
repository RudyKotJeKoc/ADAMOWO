export type LibraryDocLink = { label: string; url: string };
export type LibraryTimelineItem = { when: string; title: string; note?: string };

export type LibraryEntry = {
  id: 'case_adamscy' | 'calendar_analysis' | 'prince_ingratitude' | 'investigation_docs';
  titleKey: string;
  summaryKey: string;
  contentKeys: string[];
  tipsKeys?: string[];
  timeline?: LibraryTimelineItem[];
  resources?: LibraryDocLink[];
  tags?: string[];
};
