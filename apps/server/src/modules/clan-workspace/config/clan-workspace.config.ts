import type { ClanEventKind, ClanRole } from '../../../../generated';

import { ARENA_BONUS_TYPE } from '../../../common/lib';

export const CLAN_WORKSPACE_QUEUE = {
  name: 'clan-workspace',
  jobs: { reminders: 'reminders', attendance: 'attendance', weeklyReport: 'weekly-report' }
} as const;

export const CLAN_WORKSPACE_SCHEDULES = [
  {
    id: 'clan-workspace-reminders',
    queue: CLAN_WORKSPACE_QUEUE.name,
    name: CLAN_WORKSPACE_QUEUE.jobs.reminders,
    repeat: { every: 5 * 60_000 }
  },
  {
    id: 'clan-workspace-attendance',
    queue: CLAN_WORKSPACE_QUEUE.name,
    name: CLAN_WORKSPACE_QUEUE.jobs.attendance,
    repeat: { pattern: '20 * * * *' }
  },
  {
    id: 'clan-workspace-weekly-report',
    queue: CLAN_WORKSPACE_QUEUE.name,
    name: CLAN_WORKSPACE_QUEUE.jobs.weeklyReport,
    repeat: { pattern: '0 10 * * 1' }
  }
] as const;

export const WORKSPACE_ROLES = {
  owners: ['commander', 'executiveOfficer'] as const satisfies readonly ClanRole[],
  officers: [
    'commander',
    'executiveOfficer',
    'personnelOfficer',
    'combatOfficer',
    'intelligenceOfficer',
    'quartermaster',
    'recruitmentOfficer',
    'juniorOfficer'
  ] as const satisfies readonly ClanRole[]
} as const;

export const ATTENDANCE_BONUS_TYPES = {
  stronghold: [ARENA_BONUS_TYPE.strongholdSkirmish, ARENA_BONUS_TYPE.strongholdAdvance],
  clanWars: [ARENA_BONUS_TYPE.globalMap],
  training: [],
  tournament: [],
  other: []
} as const satisfies Record<ClanEventKind, readonly number[]>;

export const CLAN_WORKSPACE = {
  defaultEventHours: 2,
  syncDelayHours: 2,
  battleLeadMinutes: 15,
  syncLookbackHours: 48,
  reminderLeadMinutes: 30,
  inactiveDays: 7,
  reportDays: 7,
  maxCandidates: 500
} as const;
