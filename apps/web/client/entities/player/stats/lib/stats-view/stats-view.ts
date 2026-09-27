import type { RatingValue, StatsBlock } from '@otmetki/schemas';

import { ratingTier } from '@otmetki/ratings';

import type { RatingTone } from '@/shared/lib';

import { ratingTone, toneOfTier } from '@/shared/lib';

import type { PeriodStatsInput, ScaledRatingInput, StatsDeltaInput } from './stats-view.types';

export const winRateTone = (percent: number | null): RatingTone => (percent === null ? 'average' : ratingTone({ scale: 'winRate', value: percent }));

export const ratingValueTone = ({ tier }: RatingValue): RatingTone => (tier === null ? 'average' : toneOfTier(tier));

export const periodStats = ({ overall, recent, period }: PeriodStatsInput): StatsBlock | null =>
  period === 'overall' ? overall : (recent.find((entry) => entry.period === period)?.stats ?? null);

export const statsDelta = ({ current, reference }: StatsDeltaInput): number | undefined =>
  current === null || reference === null ? undefined : current - reference;

export const scaledRating = ({ scale, value }: ScaledRatingInput): RatingValue => ({
  value,
  tier: value === null ? null : ratingTier({ scale, value })
});
