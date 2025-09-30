import type { ProgramDictionary, ProgramId } from './studio.schema';

export const PROGRAMS: ProgramDictionary = {
  team: {
    id: 'team',
    titleKey: 'studio.team.title',
    subtitleKey: 'studio.team.subtitle',
    descriptionKeys: ['studio.team.description.0', 'studio.team.description.1'],
    color: '#4c6ef5',
    icon: 'team',
    hosts: [
      { nameKey: 'studio.team.hosts.agnieszka.name', bioKey: 'studio.team.hosts.agnieszka.bio' },
      { nameKey: 'studio.team.hosts.michal.name', bioKey: 'studio.team.hosts.michal.bio' }
    ],
    schedule: [
      { weekday: 1, start: '09:00', end: '10:00', noteKey: 'studio.schedule.live' },
      { weekday: 3, start: '18:00', end: '19:00' }
    ]
  },
  heart: {
    id: 'heart',
    titleKey: 'studio.heart.title',
    subtitleKey: 'studio.heart.subtitle',
    descriptionKeys: ['studio.heart.description.0', 'studio.heart.description.1'],
    color: '#ff6b35',
    icon: 'heart',
    hosts: [
      { nameKey: 'studio.heart.hosts.nadia.name', bioKey: 'studio.heart.hosts.nadia.bio' }
    ],
    schedule: [
      { weekday: 2, start: '20:00', end: '21:00', noteKey: 'studio.schedule.live' },
      { weekday: 6, start: '10:00', end: '11:00' }
    ]
  },
  psych: {
    id: 'psych',
    titleKey: 'studio.psych.title',
    subtitleKey: 'studio.psych.subtitle',
    descriptionKeys: ['studio.psych.description.0', 'studio.psych.description.1'],
    color: '#1dd1a1',
    icon: 'psych',
    hosts: [
      { nameKey: 'studio.psych.hosts.drNowak.name', bioKey: 'studio.psych.hosts.drNowak.bio' },
      { nameKey: 'studio.psych.hosts.profZielinska.name', bioKey: 'studio.psych.hosts.profZielinska.bio' }
    ],
    schedule: [
      { weekday: 4, start: '17:00', end: '18:30', noteKey: 'studio.schedule.live' }
    ]
  },
  welcome: {
    id: 'welcome',
    titleKey: 'studio.welcome.title',
    subtitleKey: 'studio.welcome.subtitle',
    descriptionKeys: ['studio.welcome.description.0', 'studio.welcome.description.1'],
    color: '#f59f00',
    icon: 'welcome',
    hosts: [
      { nameKey: 'studio.welcome.hosts.zofia.name', bioKey: 'studio.welcome.hosts.zofia.bio' },
      { nameKey: 'studio.welcome.hosts.ola.name', bioKey: 'studio.welcome.hosts.ola.bio' }
    ],
    schedule: [
      { weekday: 0, start: '11:00', end: '12:00' },
      { weekday: 5, start: '08:30', end: '09:30', noteKey: 'studio.schedule.replay' }
    ]
  }
};

export const PROGRAM_LIST = Object.values(PROGRAMS);

export function getProgramMeta(programId: ProgramId | null | undefined) {
  if (!programId) {
    return null;
  }

  return PROGRAMS[programId] ?? null;
}
