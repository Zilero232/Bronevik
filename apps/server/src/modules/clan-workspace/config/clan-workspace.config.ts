import type { ClanEventKind, ClanRole, StatsMode } from '../../../../generated';

import { FEATURES } from '../../../config';

export const CLAN_WORKSPACE_QUEUE = {
  name: 'clan-workspace',
  jobs: { reminders: 'reminders', attendance: 'attendance', weeklyReport: 'weekly-report' }
} as const;

export const CLAN_WORKSPACE_SCHEDULES = [
  {
    id: 'clan-workspace-reminders',
    queue: CLAN_WORKSPACE_QUEUE.name,
    name: CLAN_WORKSPACE_QUEUE.jobs.reminders,
    repeat: { every: 5 * 60_000 },
    enabled: FEATURES.clanWorkspace
  },
  {
    id: 'clan-workspace-attendance',
    queue: CLAN_WORKSPACE_QUEUE.name,
    name: CLAN_WORKSPACE_QUEUE.jobs.attendance,
    repeat: { pattern: '20 * * * *' },
    enabled: FEATURES.clanWorkspace
  },
  {
    id: 'clan-workspace-weekly-report',
    queue: CLAN_WORKSPACE_QUEUE.name,
    name: CLAN_WORKSPACE_QUEUE.jobs.weeklyReport,
    repeat: { pattern: '0 10 * * 1' },
    enabled: FEATURES.clanWorkspace
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

export const ATTENDANCE_MODES = {
  stronghold: ['strongholdSkirmish', 'strongholdDefense'],
  clanWars: ['globalmap'],
  training: [],
  tournament: [],
  other: []
} as const satisfies Record<ClanEventKind, readonly StatsMode[]>;

export const CLAN_WORKSPACE = {
  defaultEventHours: 2,
  snapshotSlackHours: 48,
  syncLookbackHours: 48,
  reminderLeadMinutes: 30,
  inactiveDays: 7,
  reportDays: 7,
  maxCandidates: 500
} as const;
