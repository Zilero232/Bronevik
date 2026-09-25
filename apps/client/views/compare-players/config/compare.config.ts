import type { PlayerProfile, StatsBlock } from '@bronevik/schemas';

export const COMPARE_LIMIT = {
  min: 2,
  max: 4
} as const;

export type CompareDirection = 'higher' | 'lower' | 'none';

export type CompareFormat = 'decimal' | 'integer' | 'percent';

export type CompareMetricKey =
  | 'accuracy'
  | 'avgDamage'
  | 'avgFrags'
  | 'avgSpotted'
  | 'avgTier'
  | 'avgXp'
  | 'battles'
  | 'broneIndex'
  | 'eff'
  | 'mastery'
  | 'moe3'
  | 'survivalRate'
  | 'winRate'
  | 'wn8';

export type CompareMetric = {
  key: CompareMetricKey;
  direction: CompareDirection;
  format: CompareFormat;
  pick: (input: { stats: StatsBlock | null; summary: PlayerProfile['summary'] }) => number | null;
};

export const COMPARE_METRICS: CompareMetric[] = [
  { key: 'battles', direction: 'higher', format: 'integer', pick: ({ stats }) => stats?.battles ?? null },
  { key: 'winRate', direction: 'higher', format: 'percent', pick: ({ stats }) => stats?.winRate ?? null },
  { key: 'avgDamage', direction: 'higher', format: 'integer', pick: ({ stats }) => stats?.avgDamage ?? null },
  { key: 'wn8', direction: 'higher', format: 'integer', pick: ({ stats }) => stats?.wn8.value ?? null },
  { key: 'eff', direction: 'higher', format: 'integer', pick: ({ stats }) => stats?.eff.value ?? null },
  { key: 'broneIndex', direction: 'higher', format: 'integer', pick: ({ stats }) => stats?.broneIndex.value ?? null },
  { key: 'avgFrags', direction: 'higher', format: 'decimal', pick: ({ stats }) => stats?.avgFrags ?? null },
  { key: 'avgSpotted', direction: 'higher', format: 'decimal', pick: ({ stats }) => stats?.avgSpotted ?? null },
  { key: 'avgXp', direction: 'higher', format: 'integer', pick: ({ stats }) => stats?.avgXp ?? null },
  { key: 'survivalRate', direction: 'higher', format: 'percent', pick: ({ stats }) => stats?.survivalRate ?? null },
  { key: 'accuracy', direction: 'higher', format: 'percent', pick: ({ stats }) => stats?.accuracy ?? null },
  { key: 'avgTier', direction: 'none', format: 'decimal', pick: ({ stats }) => stats?.avgTier ?? null },
  { key: 'moe3', direction: 'higher', format: 'integer', pick: ({ summary }) => summary.marks.moe3 },
  { key: 'mastery', direction: 'higher', format: 'integer', pick: ({ summary }) => summary.marks.mastery }
];
