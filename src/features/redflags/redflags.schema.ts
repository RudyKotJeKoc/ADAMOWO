export type RedFlagCategory =
  | 'gaslighting'
  | 'financial_abuse'
  | 'stalking'
  | 'legal_weaponization'
  | 'emotional_blackmail'
  | 'devaluation'
  | 'discard'
  | 'hoovering';

export type RedFlagEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  category: RedFlagCategory;
  intensity: 1 | 2 | 3 | 4 | 5;
  note?: string;
  createdAt: string;
};

export type CreateRedFlagInput = {
  date: string;
  category: RedFlagCategory;
  intensity: 1 | 2 | 3 | 4 | 5;
  note?: string;
};
