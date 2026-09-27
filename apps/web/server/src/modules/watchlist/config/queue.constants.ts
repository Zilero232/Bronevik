export const WATCHLIST_QUEUE = {
  name: 'watchlist',
  jobs: { digest: 'digest' }
} as const;

export const WATCHLIST_SCHEDULES = [
  {
    id: 'watchlist-digest',
    queue: WATCHLIST_QUEUE.name,
    name: WATCHLIST_QUEUE.jobs.digest,
    repeat: { pattern: '5 * * * *' }
  }
] as const;

export const WATCHLIST_DIGEST_RUN = {
  batchSize: 200,
  hourlyFeature: 'priorityPolling',
  marksLookbackDays: 120,
  dedupePrefix: 'watchlist'
} as const;
