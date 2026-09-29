import { match } from 'ts-pattern';

import { ratingTone, toneOfTier } from '@/shared/lib';

import type { PlayerMetricDisplay, PlayerMetricInput } from './player-metric.types';

import { TOP_METRIC_FALLBACK } from '../../config';

export const playerMetric = ({ metric, entry }: PlayerMetricInput): PlayerMetricDisplay =>
  match(metric)
    .with('wn8', () => ({ value: entry.value, tone: ratingTone({ scale: 'wn8', value: entry.value }), isPercent: false }))
    .with('winRate', () => ({ value: entry.value, tone: ratingTone({ scale: 'winRate', value: entry.value }), isPercent: true }))
    .with('avgDamage', () => ({ value: entry.value, tone: entry.tier ? toneOfTier(entry.tier) : TOP_METRIC_FALLBACK.tone, isPercent: false }))
    .exhaustive();
