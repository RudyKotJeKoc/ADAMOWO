/**
 * Library Feature Type Definitions
 *
 * Type system for educational library entries including case studies,
 * analysis tools, and community resources. Supports rich metadata with
 * timelines, resources, and tagging.
 */

/**
 * A document link with label for display.
 *
 * @property label - Display text for the link (can be i18n key)
 * @property url - URL to the document or resource
 */
export type LibraryDocLink = { label: string; url: string };

/**
 * A single event or milestone in a timeline.
 *
 * @property when - Date or time period description (can be i18n key)
 * @property title - Event title (can be i18n key)
 * @property note - Additional context or details (optional, can be i18n key)
 */
export type LibraryTimelineItem = { when: string; title: string; note?: string };

/**
 * A complete library entry with metadata and content.
 *
 * @property id - Unique identifier for the entry
 * @property titleKey - i18n key for the entry title
 * @property summaryKey - i18n key for brief summary
 * @property contentKeys - Array of i18n keys for main content sections
 * @property tipsKeys - Array of i18n keys for practical tips (optional)
 * @property timeline - Chronological events related to this entry (optional)
 * @property resources - Related documents and links (optional)
 * @property tags - Categorization tags for filtering (optional, can be i18n keys)
 */
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
