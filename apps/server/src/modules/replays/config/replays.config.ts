import { FEATURES } from '../../../config';

export const REPLAY_UPLOAD = {
  field: 'file',
  maxBytes: 50 * 1024 * 1024,
  extensions: ['.mtreplay', '.wotreplay'],
  contentType: 'application/octet-stream',
  keyPrefix: 'replays',
  tracksSuffix: '.tracks.json',
  userThrottle: { limit: 20, ttl: 60_000 },
  modThrottle: { limit: 30, ttl: 60_000 }
} as const;

export const REPLAYS_QUEUE = {
  name: 'replays',
  jobs: { parse: 'parse', bestOfWeek: 'best-of-week' },
  concurrency: 1,
  parseAttempts: 3,
  parseBackoffMs: 10_000
} as const;

export const REPLAYS_SCHEDULES = [
  {
    id: 'replays-best-of-week',
    queue: REPLAYS_QUEUE.name,
    name: REPLAYS_QUEUE.jobs.bestOfWeek,
    repeat: { pattern: '10 0 * * 1' },
    enabled: FEATURES.replaysBestOfWeek
  }
] as const;

export const REPLAY_PARSE = {
  trackStepSeconds: 1,
  maxErrorLength: 500,
  moscowOffset: '+03:00'
} as const;

export const HEATMAP = {
  gridSize: 64,
  allMode: 'all',
  allScope: 'all',
  fallbackHalfSize: 500
} as const;

export const BEST_OF_WEEK = {
  size: 10,
  days: 7
} as const;

export const REPLAY_LINKS = {
  file: '/replays/{id}/file'
} as const;
