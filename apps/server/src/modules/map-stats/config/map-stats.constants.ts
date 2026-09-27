import { TIME } from '../../../config';

export const MAP_STATS_QUEUE = {
  name: 'map-stats',
  jobs: { aggregate: 'aggregate' }
} as const;

export const MAP_STATS_SCHEDULES = [
  {
    id: 'map-stats-aggregate',
    queue: MAP_STATS_QUEUE.name,
    name: MAP_STATS_QUEUE.jobs.aggregate,
    repeat: { pattern: '40 */4 * * *' }
  }
] as const;

export const MAP_STATS = {
  windowDays: 30,
  timezone: TIME.zone,
  hours: 24,
  allTiers: 0,
  maxTier: 11,
  defaultMode: 'random',
  minQueueSamples: 5,
  msPerSecond: 1000,
  rotationCacheMs: 600_000,
  queueCacheMs: 60_000
} as const;
