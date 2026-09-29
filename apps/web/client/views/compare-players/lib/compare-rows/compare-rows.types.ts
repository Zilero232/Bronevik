import type { RatingScale } from '@otmetki/ratings';
import type { PlayerSummary, StatsBlock } from '@otmetki/schemas';

import type { RatingTone } from '@/shared/lib';

export type CompareDirection = 'higher' | 'lower' | 'none';

export type CompareFormat = 'decimal2' | 'integer' | 'percent';

type CompareMetricKey =
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

type CompareMetricSource = {
  stats: StatsBlock | null;
  marks: Pick<PlayerSummary['marks'], 'mastery' | 'moe3'>;
};

export type CompareMetric = {
  key: CompareMetricKey;
  direction: CompareDirection;
  format: CompareFormat;
  scale?: RatingScale;
  pick: (source: CompareMetricSource) => number | null;
};

export type CompareRowsInput = {
  sources: CompareMetricSource[];
};

export type CompareRow = {
  key: CompareMetricKey;
  format: CompareFormat;
  values: (number | null)[];
  best: number[];
  deltas: (number | null)[];
  tones: (RatingTone | null)[];
  isLowerBetter: boolean;
};

export type DisplayValueInput = {
  value: number;
  format: CompareFormat;
};
