export const REPLAYS_QUEUE = {
  name: 'replays',
  jobs: { parse: 'parse', bestOfWeek: 'best-of-week', overflowCleanup: 'overflow-cleanup', tagBackfill: 'tag-backfill' },
  concurrency: 1,
  parseAttempts: 3,
  parseBackoffMs: 10_000
} as const;

export const REPLAYS_SCHEDULES = [
  {
    id: 'replays-best-of-week',
    queue: REPLAYS_QUEUE.name,
    name: REPLAYS_QUEUE.jobs.bestOfWeek,
    repeat: { pattern: '10 0 * * 1' }
  },
  {
    id: 'replays-overflow-cleanup',
    queue: REPLAYS_QUEUE.name,
    name: REPLAYS_QUEUE.jobs.overflowCleanup,
    repeat: { pattern: '30 4 * * *' }
  },
  {
    id: 'replays-tag-backfill',
    queue: REPLAYS_QUEUE.name,
    name: REPLAYS_QUEUE.jobs.tagBackfill,
    repeat: { pattern: '*/10 * * * *' }
  }
] as const;
