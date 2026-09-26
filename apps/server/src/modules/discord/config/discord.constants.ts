import { secondsInDay } from 'date-fns/constants';

export const DISCORD_TOKENS = {
  api: Symbol('DISCORD_API')
} as const;

export const DISCORD = {
  restVersion: '10',
  inviteUrl: 'https://discord.com/oauth2/authorize',
  inviteScopes: ['bot', 'applications.commands'],
  embedColor: 13_149_771
} as const;

export const DISCORD_OWN_COMMANDS = ['setup', 'roles', 'help'] as const;

export const DISCORD_OPTIONS = {
  nickname: 'nickname',
  name: 'name',
  channel: 'channel',
  reportChannel: 'report_channel',
  memberRole: 'member_role',
  tierRoles: 'tier_roles'
} as const;

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
