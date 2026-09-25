import type { VehicleType } from '@bronevik/schemas';

export type ComparePreset = {
  key: 'heavyX' | 'mediumX' | 'premiumVIII' | 'tdX';
  tiers: readonly number[];
  types?: readonly VehicleType[];
  premium?: boolean;
};

export const COMPARE_PRESETS: readonly ComparePreset[] = [
  { key: 'heavyX', tiers: [10], types: ['heavyTank'] },
  { key: 'mediumX', tiers: [10], types: ['mediumTank'] },
  { key: 'tdX', tiers: [10], types: ['AT-SPG'] },
  { key: 'premiumVIII', tiers: [8], premium: true }
];

export const COMPARE_REQUEST = {
  presetSize: 4,
  statsPeriod: '7d',
  mode: 'random',
  staleMs: 5 * 60 * 1000
} as const;

export const COMPARE_STATS = ['winRate', 'winRateDiff', 'avgDamage', 'battles'] as const;

export type CompareStatKey = (typeof COMPARE_STATS)[number];
