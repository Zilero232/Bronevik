import type { RatingValue, StatsBlock } from '@bronevik/schemas';

import type { RatingTone } from '@/shared/lib';

import { ratingTone, toneOfTier } from '@/shared/lib';

import type { PeriodStatsInput, SignedInput, StatsDeltaInput } from './stats-view.types';

export const winRateTone = (percent: number | null): RatingTone => (percent === null ? 'average' : ratingTone({ scale: 'winRate', value: percent }));

export const ratingValueTone = ({ tier }: RatingValue): RatingTone => (tier === null ? 'average' : toneOfTier(tier));

export const periodStats = ({ overall, recent, period }: PeriodStatsInput): StatsBlock | null =>
  period === 'overall' ? overall : (recent.find((entry) => entry.period === period)?.stats ?? null);

export const statsDelta = ({ current, reference }: StatsDeltaInput): number | undefined =>
  current === null || reference === null ? undefined : current - reference;

export const signed = ({ value, digits = 0 }: SignedInput): string | undefined =>
  value === undefined ? undefined : `${value >= 0 ? '+' : ''}${value.toFixed(digits)}`;
