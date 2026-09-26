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

export const WATCH_COMMAND = {
  command: 'watch',
  maxLines: 20,
  sitePath: '/me/watchlist'
} as const;
