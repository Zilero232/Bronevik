import type { TrackingTier } from '../../../../generated';

export const ACHIEVEMENTS_AGGREGATE = {
  chunk: 2000,
  completionSections: ['battle', 'epic', 'group', 'special', 'class'],
  tankTiers: ['active', 'population'] satisfies TrackingTier[]
} as const;

export const ACHIEVEMENT_SERIES = [
  { name: 'titleSniper', keys: ['titleSniper', 'sniper'], threshold: 10 },
  { name: 'invincible', keys: ['invincible'], threshold: 5 },
  { name: 'diehard', keys: ['diehard'], threshold: 20 },
  { name: 'handOfDeath', keys: ['handOfDeath', 'killing'], threshold: 5 },
  { name: 'armorPiercer', keys: ['armorPiercer', 'piercing'], threshold: 10 }
] as const;
