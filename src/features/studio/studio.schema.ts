/**
 * Identifier for studio programs.
 *
 * Available programs:
 * - team: Team-based discussions
 * - heart: Heart-focused emotional topics
 * - psych: Psychological analysis
 * - welcome: Welcome and introductory content
 */
export type ProgramId = 'team' | 'heart' | 'psych' | 'welcome';

/**
 * Host information for a studio program.
 *
 * @property nameKey - Translation key for host's name
 * @property bioKey - Optional translation key for host biography
 * @property avatarUrl - Optional URL to host's avatar image
 */
export type Host = {
  nameKey: string;
  bioKey?: string;
  avatarUrl?: string;
};

/**
 * Scheduled broadcast time slot for a program.
 *
 * @property weekday - Day of week (0=Sunday, 1=Monday, ..., 6=Saturday)
 * @property start - Start time in HH:MM format (24-hour)
 * @property end - End time in HH:MM format (24-hour)
 * @property noteKey - Optional translation key for publication notes
 */
export type ScheduleEntry = {
  weekday: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  start: string;
  end: string;
  noteKey?: string;
};

/**
 * Complete metadata for a studio program.
 *
 * @property id - Unique program identifier
 * @property titleKey - Translation key for program name
 * @property subtitleKey - Optional translation key for tagline/subtitle
 * @property descriptionKeys - Array of translation keys for program description paragraphs
 * @property color - Optional hex color code for program branding
 * @property icon - Icon identifier matching program type
 * @property hosts - Array of program hosts
 * @property schedule - Optional broadcast schedule entries
 */
export type ProgramMeta = {
  id: ProgramId;
  titleKey: string;
  subtitleKey?: string;
  descriptionKeys: string[];
  color?: string;
  icon: 'team' | 'heart' | 'psych' | 'welcome';
  hosts: Host[];
  schedule?: ScheduleEntry[];
};

/**
 * Map of all program IDs to their metadata.
 *
 * Used for efficient program lookups by ID.
 */
export type ProgramDictionary = Record<ProgramId, ProgramMeta>;
