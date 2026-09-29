import type { RatingValue, StatsBlock } from '@otmetki/schemas';

import { ratingTier } from '@otmetki/ratings';

import type { RatingTone } from '@/shared/lib';

import { ratingTone, toneOfTier } from '@/shared/lib';

import type { PeriodStatsInput, ScaledRatingInput, StatsDeltaInput, StatsTrendKey, TrendDeltaInput } from './stats-view.types';

export const winRateTone = (percent: number | null): RatingTone => (percent === null ? 'average' : ratingTone({ scale: 'winRate', value: percent }));

export const ratingValueTone = ({ tier }: RatingValue): RatingTone => (tier === null ? 'average' : toneOfTier(tier));

export const periodStats = ({ overall, recent, period }: PeriodStatsInput): StatsBlock | null =>
  period === 'overall' ? overall : (recent.find((entry) => entry.period === period)?.stats ?? null);

const statsDelta = ({ current, reference }: StatsDeltaInput): number | undefined =>
  current === null || reference === null ? undefined : current - reference;

const TREND_READERS = {
  winRate: (block: StatsBlock) => block.winRate,
  avgDamage: (block: StatsBlock) => block.avgDamage,
  wn8: (block: StatsBlock) => block.wn8.value
} as const satisfies Record<StatsTrendKey, (block: StatsBlock) => number | null>;

export const trendDelta = ({ key, stats, reference }: TrendDeltaInput): number | undefined =>
  reference ? statsDelta({ current: TREND_READERS[key](stats), reference: TREND_READERS[key](reference) }) : undefined;

export const scaledRating = ({ scale, value }: ScaledRatingInput): RatingValue => ({
  value,
  tier: value === null ? null : ratingTier({ scale, value })
});
