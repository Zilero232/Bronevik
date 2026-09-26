import type { DefaultJobOptions } from 'bullmq';

export const QUEUE_DEFAULTS = {
  prefix: 'otmetki',
  jobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5_000 },
    removeOnComplete: { age: 60 * 60, count: 1_000 },
    // A week of failures for post-mortems, capped so a Lesta outage that fails
    // every poll cannot grow Redis (noeviction) without bound.
    removeOnFail: { age: 7 * 24 * 60 * 60, count: 5_000 }
  } satisfies DefaultJobOptions
} as const;
