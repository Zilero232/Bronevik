export const TANK_OBTAIN = {
  offersLimit: 5,
  newsLimit: 5
} as const;

export const TANK_LEARNING = {
  minBucketBattles: 100,
  difficultyGain: { easy: 2, moderate: 4, hard: 6 },
  difficultyCacheTtlMs: 30 * 60_000,
  difficultyCacheKey: 'difficulty'
} as const;
