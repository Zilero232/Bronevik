import type { RatingKind } from '@otmetki/schemas';

import type { LeaderboardFilter } from '@/entities/player/leaderboard';

import type { MetricForInput, TopFilterState } from './top-filter.types';

import { TOP_METRICS, TOP_TANK_SCOPES } from '../../config';

export const metricFor = ({ scope, metric }: MetricForInput): RatingKind => {
  const allowed = TOP_METRICS[scope];

  return allowed.length === 0 || allowed.includes(metric) ? metric : allowed[0];
};

export const toLeaderboardFilter = ({ scope, metric, period, tier, type, tank }: TopFilterState): LeaderboardFilter => ({
  scope,
  metric: metricFor({ scope, metric }),
  period,
  tier: tier ?? undefined,
  type: type ?? undefined,
  tankId: tank !== null && TOP_TANK_SCOPES.includes(scope) ? tank : undefined
});
