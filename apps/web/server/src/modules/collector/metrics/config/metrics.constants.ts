export const METRICS = {
  flushIntervalMs: 60_000,
  unscopedQueue: 'lesta.unscoped'
} as const;

export const EMPTY_COUNTERS = {
  processed: 0,
  failed: 0,
  retried: 0,
  durationMs: 0,
  lestaRequests: 0,
  lestaErrors: 0
} as const;
