import type { LeagueEntry, LeagueMetric } from '@/entities/social/league';

export type ValueCellProps = Pick<LeagueEntry, 'value'> & {
  metric: LeagueMetric;
};
