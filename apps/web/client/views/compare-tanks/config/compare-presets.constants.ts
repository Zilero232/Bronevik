import { minutesToMilliseconds } from 'date-fns';

import type { ComparePreset } from '../model/compare-presets.types';

export const COMPARE_PRESETS = [
  { key: 'heavyX', tiers: [10], types: ['heavyTank'] },
  { key: 'mediumX', tiers: [10], types: ['mediumTank'] },
  { key: 'tdX', tiers: [10], types: ['AT-SPG'] },
  { key: 'premiumVIII', tiers: [8], premium: true }
] as const satisfies readonly ComparePreset[];

export const COMPARE_REQUEST = {
  presetSize: 4,
  statsPeriod: '7d',
  mode: 'random',
  staleMs: minutesToMilliseconds(5)
} as const;
