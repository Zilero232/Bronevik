export const HEALTH = {
  workerStaleMs: 3 * 60_000,
  key: {
    database: 'database',
    redis: 'redis',
    worker: 'worker',
    lestaCircuit: 'lestaCircuit'
  }
} as const;
