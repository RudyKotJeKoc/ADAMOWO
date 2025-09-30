export type ProgramId = 'team' | 'heart' | 'psych' | 'welcome';

export type Host = {
  nameKey: string;
  bioKey?: string;
  avatarUrl?: string;
};

export type ScheduleEntry = {
  weekday: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  start: string;
  end: string;
  noteKey?: string;
};

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

export type ProgramDictionary = Record<ProgramId, ProgramMeta>;
