import type { RatingPeriod, TimeSeriesGranularity, TimeSeriesMetric } from '@bronevik/schemas';

export const PROFILE_TABS = ['overview', 'tanks', 'sessions', 'marks', 'charts', 'insights', 'history'] as const;

export const PROFILE_PERIODS: readonly RatingPeriod[] = ['overall', '24h', '7d', '30d', '60d', '1000'];

export const DEFAULT_PERIOD: RatingPeriod = '30d';

export const CHART_METRICS = ['wn8', 'winRate', 'avgDamage', 'battles', 'eff', 'broneIndex'] as const satisfies readonly TimeSeriesMetric[];

export const CHART_GRANULARITIES = ['day', 'week', 'month'] as const satisfies readonly TimeSeriesGranularity[];

export const OVERVIEW = {
  historyMetric: 'wn8',
  historyGranularity: 'day',
  historyPoints: 60,
  activityDays: 365,
  highlightCount: 3,
  highlightMinBattles: 50
} as const;

export const SESSIONS = {
  pageSize: 20
} as const;

export const MARKS = {
  targetPercent: 95,
  minTier: 5
} as const;
