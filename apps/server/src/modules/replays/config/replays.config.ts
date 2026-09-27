import { PLUS_GRACE, PLUS_LIMITS } from '@otmetki/schemas';

export const REPLAY_UPLOAD = {
  field: 'file',
  maxBytes: 50 * 1024 * 1024,
  multipartOverheadBytes: 64 * 1024,
  extensions: ['.mtreplay', '.wotreplay'],
  contentType: 'application/octet-stream',
  keyPrefix: 'replays',
  tracksSuffix: '.tracks.json',
  userThrottle: { limit: 20, ttl: 60_000 },
  modThrottle: { limit: 30, ttl: 60_000 },
  visibilityHeader: 'x-otmetki-visibility',
  modVisibilities: ['private', 'public'],
  modDefaultVisibility: 'private'
} as const;

export const REPLAYS_QUEUE = {
  name: 'replays',
  jobs: { parse: 'parse', bestOfWeek: 'best-of-week', overflowCleanup: 'overflow-cleanup' },
  concurrency: 1,
  parseAttempts: 3,
  parseBackoffMs: 10_000
} as const;

export const REPLAYS_SCHEDULES = [
  {
    id: 'replays-best-of-week',
    queue: REPLAYS_QUEUE.name,
    name: REPLAYS_QUEUE.jobs.bestOfWeek,
    repeat: { pattern: '10 0 * * 1' }
  },
  {
    id: 'replays-overflow-cleanup',
    queue: REPLAYS_QUEUE.name,
    name: REPLAYS_QUEUE.jobs.overflowCleanup,
    repeat: { pattern: '30 4 * * *' }
  }
] as const;

export const REPLAY_OVERFLOW = {
  keep: PLUS_LIMITS.storedReplays.free,
  readOnlyDays: PLUS_GRACE.overflowReadOnlyDays,
  noticeDays: [1, 14],
  dedupePrefix: 'replay-overflow'
} as const;

export const REPLAY_PARSE = {
  trackStepSeconds: 1,
  maxErrorLength: 500,
  moscowOffset: '+03:00'
} as const;

export const REPLAY_MEDALS = {
  masteryBadges: [
    { level: 4, name: 'markOfMastery' },
    { level: 3, name: 'markOfMasteryI' },
    { level: 2, name: 'markOfMasteryII' },
    { level: 1, name: 'markOfMasteryIII' }
  ]
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
