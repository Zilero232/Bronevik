export const MONITORING = {
  queueStatsIntervalMs: 60_000,
  countedStates: ['waiting', 'prioritized', 'active', 'delayed', 'failed', 'paused'],
  waitingStates: ['waiting', 'prioritized']
} as const;
