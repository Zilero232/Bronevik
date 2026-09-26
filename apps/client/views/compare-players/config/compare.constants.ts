import type { RatingPeriod } from '@otmetki/schemas';

import type { CompareMetric } from './compare.types';

export const COMPARE_LIMIT = {
  min: 2,
  max: 4
} as const;

export const COMPARE_PERIODS = ['overall', '24h', '7d', '30d', '60d', '1000'] as const satisfies readonly RatingPeriod[];

export const COMPARE_METRICS = [
  { key: 'battles', direction: 'higher', format: 'integer', pick: ({ stats }) => stats?.battles ?? null },
  { key: 'winRate', direction: 'higher', format: 'percent', pick: ({ stats }) => stats?.winRate ?? null },
  { key: 'avgDamage', direction: 'higher', format: 'integer', pick: ({ stats }) => stats?.avgDamage ?? null },
  { key: 'wn8', direction: 'higher', format: 'integer', pick: ({ stats }) => stats?.wn8.value ?? null },
  { key: 'eff', direction: 'higher', format: 'integer', pick: ({ stats }) => stats?.eff.value ?? null },
  { key: 'broneIndex', direction: 'higher', format: 'integer', pick: ({ stats }) => stats?.broneIndex.value ?? null },
  { key: 'avgFrags', direction: 'higher', format: 'decimal2', pick: ({ stats }) => stats?.avgFrags ?? null },
  { key: 'avgSpotted', direction: 'higher', format: 'decimal2', pick: ({ stats }) => stats?.avgSpotted ?? null },
  { key: 'avgXp', direction: 'higher', format: 'integer', pick: ({ stats }) => stats?.avgXp ?? null },
  { key: 'survivalRate', direction: 'higher', format: 'percent', pick: ({ stats }) => stats?.survivalRate ?? null },
  { key: 'accuracy', direction: 'higher', format: 'percent', pick: ({ stats }) => stats?.accuracy ?? null },
  { key: 'avgTier', direction: 'none', format: 'decimal2', pick: ({ stats }) => stats?.avgTier ?? null },
  { key: 'moe3', direction: 'higher', format: 'integer', pick: ({ marks }) => marks.moe3 },
  { key: 'mastery', direction: 'higher', format: 'integer', pick: ({ marks }) => marks.mastery }
] as const satisfies readonly CompareMetric[];
