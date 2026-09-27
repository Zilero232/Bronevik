import { secondsInDay } from 'date-fns/constants';

export const DISCORD_QUEUE = {
  name: 'discord',
  jobs: { reminders: 'reminders', roles: 'roles', weeklyReport: 'weekly-report' }
} as const;

export const DISCORD_SCHEDULES = [
  { id: 'discord-reminders', queue: DISCORD_QUEUE.name, name: DISCORD_QUEUE.jobs.reminders, repeat: { every: 5 * 60_000 } },
  { id: 'discord-roles', queue: DISCORD_QUEUE.name, name: DISCORD_QUEUE.jobs.roles, repeat: { pattern: '40 * * * *' } },
  { id: 'discord-weekly-report', queue: DISCORD_QUEUE.name, name: DISCORD_QUEUE.jobs.weeklyReport, repeat: { pattern: '5 10 * * 1' } }
] as const;

export const DISCORD_LIMITS = {
  reminderWindowMinutes: 60,
  reminderClaimSeconds: 2 * secondsInDay,
  reminderClaimPrefix: 'otmetki:discord:reminder:',
  roleSyncBatch: 500
} as const;
