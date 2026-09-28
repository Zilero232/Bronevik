'use client';

import { LEAGUE_METRICS, LEAGUE_SCOPES } from '@otmetki/schemas';
import { useQueryStates } from 'nuqs';

import type { LeagueMetric, LeagueScope } from '@/entities/social/league';

import { LEAGUE_PARSERS } from '../../../config';

export const useLeagueParams = () => {
  const [{ scope, metric, week }, setParams] = useQueryStates(LEAGUE_PARSERS);

  return {
    scope,
    metric,
    week,
    scopeOptions: LEAGUE_SCOPES,
    metricOptions: LEAGUE_METRICS,
    onScopeChange: (next: LeagueScope) => void setParams({ scope: next }),
    onMetricChange: (next: LeagueMetric) => void setParams({ metric: next }),
    onWeekChange: (next: string | null) => void setParams({ week: next })
  };
};
