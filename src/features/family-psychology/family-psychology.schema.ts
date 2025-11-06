export type FamilyPsychologySection = {
  id: string;
  titleKey: string;
  contentKeys: string[];
  type: 'intro' | 'patterns' | 'observer' | 'curse' | 'liberation' | 'interactive';
};

export type TransmissionNode = {
  nameKey: string;
  mechanismKey: string;
};

export type CommunicationExample = {
  typeKey: string;
  descriptionKey: string;
  exampleKey: string;
};

export type PatternIndicator = {
  titleKey: string;
  descriptionKey: string;
};
