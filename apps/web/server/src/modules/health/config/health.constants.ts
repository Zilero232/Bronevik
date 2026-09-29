export const HEALTH = {
  workerStaleMs: 3 * 60_000,
  lestaOff: { worker: 'no_lesta_key', circuit: 'not_configured' },
  key: {
    database: 'database',
    redis: 'redis',
    worker: 'worker',
    lestaCircuit: 'lestaCircuit'
  }
} as const;
