import type { TimeSeriesGranularity, TimeSeriesMetric } from '@otmetki/schemas';

export const CHART_METRICS = ['wn8', 'winRate', 'avgDamage', 'battles', 'eff', 'broneIndex'] as const satisfies readonly TimeSeriesMetric[];

export const CHART_GRANULARITIES = ['day', 'week', 'month'] as const satisfies readonly TimeSeriesGranularity[];

export const HISTORY_CHART = {
  height: 320,
  defaultMetric: 'wn8',
  defaultGranularity: 'week',
  summaryKeys: ['last', 'average', 'max', 'min']
} as const;
