import type { CollectorJobName } from '@otmetki/schemas';

import type { JobSuccessKeyInput } from '../../collector/metrics';

import { JOB, QUEUE } from '../../collector';

export const HEALTH = {
  workerStaleMs: 3 * 60_000,
  lestaOff: { worker: 'no_lesta_key', circuit: 'not_configured' },
  key: {
    database: 'database',
    redis: 'redis',
    worker: 'worker',
    lestaCircuit: 'lestaCircuit'
  },
  collectorCacheMs: 30_000,
  collectorCacheKey: 'collector'
} as const;

export const COLLECTOR_JOB_SOURCES = {
  lestaSync: [
    { queue: QUEUE.poll, name: JOB.poll.batch },
    { queue: QUEUE.sweep, name: JOB.sweep.batch }
  ],
  tankStats: [{ queue: QUEUE.aggregate, name: JOB.aggregate.serverStats }],
  moeImport: [{ queue: QUEUE.reference, name: JOB.reference.moeThresholds }],
  xvmExpected: [{ queue: QUEUE.reference, name: JOB.reference.wn8Expected }],
  gameFiles: []
} as const satisfies Record<CollectorJobName, readonly JobSuccessKeyInput[]>;

export const QUEUE_COUNTS = {
  waiting: ['waiting', 'prioritized', 'paused'],
  active: ['active'],
  delayed: ['delayed'],
  failed: ['failed'],
  lag: ['lagSeconds']
} as const;
