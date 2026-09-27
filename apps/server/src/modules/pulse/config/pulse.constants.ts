import { TIME } from '../../../config';

export const PULSE_QUEUE = {
  name: 'pulse',
  jobs: { sample: 'sample' }
} as const;

export const PULSE_SCHEDULES = [
  { id: 'pulse-sample', queue: PULSE_QUEUE.name, name: PULSE_QUEUE.jobs.sample, repeat: { pattern: '*/15 * * * *' } }
] as const;

export const PULSE = {
  timezone: TIME.zone,
  heatmapDays: 28,
  activeWindowMinutes: 60,
  samplesKey: 'pulse:samples',
  cacheKey: 'pulse:view:v1',
  cacheSeconds: 600,
  retentionDays: 30,
  seriesDays: 7,
  bestHours: 3,
  days: 7,
  hours: 24
} as const;
