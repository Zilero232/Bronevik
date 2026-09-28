import type { JobSchedule } from '../../../common/lib';

export const GOAL_PROGRESS_QUEUE = {
  name: 'goals',
  jobs: { progress: 'progress' }
} as const;

export const GOAL_PROGRESS_SCHEDULES = [
  { id: 'goals-progress', queue: GOAL_PROGRESS_QUEUE.name, name: GOAL_PROGRESS_QUEUE.jobs.progress, repeat: { every: 5 * 60_000 } }
] as const satisfies readonly JobSchedule[];

export const GOAL_PROGRESS = {
  lookbackMinutes: 15,
  accountsChunk: 1000,
  windowMetrics: ['battles', 'winRate', 'avgDamage', 'wn8'],
  resolvedAtEndMetrics: ['winRate', 'avgDamage', 'wn8'],
  dedupePrefix: 'goal-'
} as const;
