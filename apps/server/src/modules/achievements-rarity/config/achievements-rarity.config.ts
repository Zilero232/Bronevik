import type { DeletionSource, DeletionStatus, TrackingTier } from '../../../../generated';

export const ACHIEVEMENTS_RARITY_QUEUE = {
  name: 'achievements-rarity',
  jobs: { fetch: 'fetch', aggregate: 'aggregate' }
} as const;

export const ACHIEVEMENTS_RARITY_SCHEDULES = [
  {
    id: 'achievements-rarity-fetch',
    queue: ACHIEVEMENTS_RARITY_QUEUE.name,
    name: ACHIEVEMENTS_RARITY_QUEUE.jobs.fetch,
    repeat: { pattern: '*/20 * * * *' }
  },
  {
    id: 'achievements-rarity-aggregate',
    queue: ACHIEVEMENTS_RARITY_QUEUE.name,
    name: ACHIEVEMENTS_RARITY_QUEUE.jobs.aggregate,
    repeat: { pattern: '45 */6 * * *' }
  }
] as const;

export const ACHIEVEMENTS_FETCH = {
  batch: 1000,
  refreshDays: 7,
  backfillRuns: 50,
  tiers: ['active', 'population'] satisfies TrackingTier[],
  blockingSources: ['user', 'lesta'] satisfies DeletionSource[],
  blockingStatuses: ['pending', 'processing', 'completed'] satisfies DeletionStatus[]
} as const;

export const ACHIEVEMENTS_AGGREGATE = {
  chunk: 2000,
  completionSections: ['battle', 'epic', 'group', 'special', 'class'],
  tankTiers: ['active', 'population'] satisfies TrackingTier[]
} as const;

export const RARITY_POINTS = {
  min: 10,
  max: 1000,
  exponent: 0.5
} as const;

export const RARITY_TIERS = [
  { tier: 'legendary', below: 0.01 },
  { tier: 'epic', below: 0.05 },
  { tier: 'rare', below: 0.2 },
  { tier: 'uncommon', below: 0.5 }
] as const;

export const RARITY_TIER_NAMES = ['legendary', 'epic', 'rare', 'uncommon', 'common'] as const;

export const ACHIEVEMENT_SERIES = [
  { name: 'titleSniper', keys: ['titleSniper', 'sniper'], threshold: 10 },
  { name: 'invincible', keys: ['invincible'], threshold: 5 },
  { name: 'diehard', keys: ['diehard'], threshold: 20 },
  { name: 'handOfDeath', keys: ['handOfDeath', 'killing'], threshold: 5 },
  { name: 'armorPiercer', keys: ['armorPiercer', 'piercing'], threshold: 10 }
] as const;

export const ACHIEVEMENTS_VIEW = {
  catalogSorts: ['rarity', 'common', 'points', 'order'],
  tankSorts: ['rare', 'common'],
  leaderboardDefaultLimit: 50,
  leaderboardMaxLimit: 100,
  rarestHeld: 5,
  showcaseSize: 6,
  percentScale: 100
} as const;
