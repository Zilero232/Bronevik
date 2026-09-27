export const HONEST_RNG_QUEUE = {
  name: 'honest-rng',
  jobs: { aggregate: 'aggregate' }
} as const;

export const HONEST_RNG_SCHEDULES = [
  {
    id: 'honest-rng-aggregate',
    queue: HONEST_RNG_QUEUE.name,
    name: HONEST_RNG_QUEUE.jobs.aggregate,
    repeat: { pattern: '20 */3 * * *' }
  }
] as const;
