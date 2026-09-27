export const PROGRESSION_QUEUE = {
  name: 'progression',
  jobs: { run: 'run' }
} as const;

export const PROGRESSION_SCHEDULES = [
  {
    id: 'progression-run',
    queue: PROGRESSION_QUEUE.name,
    name: PROGRESSION_QUEUE.jobs.run,
    repeat: { pattern: '*/20 * * * *' }
  }
] as const;

export const PROGRESSION_RUN = {
  maxAccountsPerRun: 5000,
  modLookbackDays: 30
} as const;
