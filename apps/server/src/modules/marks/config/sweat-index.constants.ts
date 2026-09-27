export const SWEAT_INDEX = {
  mode: 'random',
  period: 'd30',
  cohorts: ['average', 'all'],
  quantiles: { moderate: 0.25, hard: 0.6, extreme: 0.9 },
  minTanks: 10,
  cacheTtlMs: 15 * 60_000,
  cacheKey: 'sweat'
} as const;
