export const GOALS = {
  maxDurationDays: 366
} as const;

export const MOD_GOALS = {
  throttle: { limit: 30, ttl: 60_000 },
  endedWithinHours: 24,
  statsMode: 'random'
} as const;

export const FAVORITES = {
  maxCount: 200
} as const;
