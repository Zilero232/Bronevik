export const TANK_TRAITS = {
  rolePrefix: 'role_',
  rewardMinTier: 9,
  rewardTags: ['special', 'inGame'],
  sourceTags: { clanWarsBattles: 'clanWars', wotPlus: 'subscription', debutBoxes: 'lootboxes' },
  cacheTtlMs: 15 * 60_000,
  cacheKey: 'traits'
} as const;

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
