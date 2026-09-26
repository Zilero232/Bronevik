import type { PlayerSummary, StatsBlock } from '@otmetki/schemas';

export type CompareDirection = 'higher' | 'lower' | 'none';

export type CompareFormat = 'decimal2' | 'integer' | 'percent';

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

export type CompareMetricSource = {
  stats: StatsBlock | null;
  marks: Pick<PlayerSummary['marks'], 'mastery' | 'moe3'>;
};

export type CompareMetric = {
  key: CompareMetricKey;
  direction: CompareDirection;
  format: CompareFormat;
  pick: (source: CompareMetricSource) => number | null;
};
