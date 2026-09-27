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
