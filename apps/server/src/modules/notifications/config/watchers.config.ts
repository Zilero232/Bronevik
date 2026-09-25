export const MARKS_WATCH = {
  cursorKey: 'bronevik:notifications:marks-cursor',
  batchSize: 500
} as const;

export const SESSION_REPORT = {
  idleMinutes: 30,
  maxAgeHours: 12,
  batchSize: 200
} as const;

export const THRESHOLD_DROP = {
  minDropPercent: 1
} as const;

export const WEEKLY_DIGEST = {
  lookbackDays: 7,
  batchSize: 500,
  dedupePrefix: 'bronevik:notifications:digest:',
  dedupeTtlSeconds: 14 * 24 * 60 * 60
} as const;
