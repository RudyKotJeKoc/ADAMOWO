/**
 * Family Psychology Feature Type Definitions
 *
 * Type system for family dynamics analysis, intergenerational trauma
 * transmission, communication patterns, and behavioral indicators.
 * All content uses i18n keys for multilingual support.
 */

/**
 * A section in the family psychology educational content.
 *
 * @property id - Unique identifier for the section
 * @property titleKey - i18n key for the section title
 * @property contentKeys - Array of i18n keys for section content paragraphs
 * @property type - Section type for rendering and organization
 */
export type FamilyPsychologySection = {
  id: string;
  titleKey: string;
  contentKeys: string[];
  type: 'intro' | 'patterns' | 'observer' | 'curse' | 'liberation' | 'interactive';
};

/**
 * A node in the intergenerational trauma transmission chain.
 *
 * @property nameKey - i18n key for the person's identifier or role
 * @property mechanismKey - i18n key describing the transmission mechanism
 */
export type TransmissionNode = {
  nameKey: string;
  mechanismKey: string;
};

/**
 * An example of a communication pattern with contextual description.
 *
 * @property typeKey - i18n key for the communication pattern type
 * @property descriptionKey - i18n key for pattern explanation
 * @property exampleKey - i18n key for a concrete example
 */
export type CommunicationExample = {
  typeKey: string;
  descriptionKey: string;
  exampleKey: string;
};

/**
 * An indicator of a concerning behavioral pattern.
 *
 * @property titleKey - i18n key for the indicator name
 * @property descriptionKey - i18n key for detailed explanation
 */
export type PatternIndicator = {
  titleKey: string;
  descriptionKey: string;
};
