import type { LeagueMetric, LeagueScope } from '@/entities/social/league';

import type { LeagueWeekNav } from '../../../lib/league-table';

export type LeagueToolbarProps = {
  scope: LeagueScope;
  scopeOptions: readonly LeagueScope[];
  metric: LeagueMetric;
  metricOptions: readonly LeagueMetric[];
  weekStart: string | null;
  nav: LeagueWeekNav | null;
  onScopeChange: (scope: LeagueScope) => void;
  onMetricChange: (metric: LeagueMetric) => void;
  onPrevious: () => void;
  onNext: () => void;
};
