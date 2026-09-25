import { match } from 'ts-pattern';

import { ratingTone } from '@/shared/lib';

import type { FormatOverlayValueInput, OverlayMetricReading, ReadOverlayMetricInput } from './overlay-metric.types';

import { OVERLAY_PLACEHOLDER, OVERLAY_VALUE_FORMAT, OVERLAY_VALUE_SUFFIX } from './overlay-metric.constants';

const toneOf = ({ scale, value }: { scale: 'winRate' | 'wn8'; value: number | null }) => (value === null ? null : ratingTone({ scale, value }));

export const readOverlayMetric = ({ data, metric }: ReadOverlayMetricInput): OverlayMetricReading => {
  const { session, moe } = data;
  const base = { metric, tone: null, result: null } as const;

  return match(metric)
    .with('battles', () => ({ ...base, kind: 'count' as const, value: session?.battles ?? null }))
    .with('winRate', () => ({
      ...base,
      kind: 'percent' as const,
      value: session?.winRate ?? null,
      tone: toneOf({ scale: 'winRate', value: session?.winRate ?? null })
    }))
    .with('avgDamage', () => ({ ...base, kind: 'count' as const, value: session?.avgDamage ?? null }))
    .with('wn8', () => ({
      ...base,
      kind: 'rating' as const,
      value: session?.wn8 ?? null,
      tone: toneOf({ scale: 'wn8', value: session?.wn8 ?? null })
    }))
    .with('broneIndex', () => ({ ...base, kind: 'rating' as const, value: null }))
    .with('moePercent', () => ({ ...base, kind: 'percent' as const, value: moe?.percent ?? null }))
    .with('winStreak', () => ({ ...base, kind: 'count' as const, value: session?.winStreak ?? null }))
    .with('frags', () => ({ ...base, kind: 'count' as const, value: session?.frags ?? null }))
    .with('lastBattle', () => ({
      ...base,
      kind: 'count' as const,
      value: session?.lastBattle?.damage ?? null,
      result: session?.lastBattle?.result ?? null
    }))
    .exhaustive();
};

export const formatOverlayValue = ({ value, kind, locale }: FormatOverlayValueInput): string =>
  value === null ? OVERLAY_PLACEHOLDER : `${new Intl.NumberFormat(locale, OVERLAY_VALUE_FORMAT[kind]).format(value)}${OVERLAY_VALUE_SUFFIX[kind]}`;
