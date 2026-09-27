import type { LeagueEntry, LeagueMetric } from '../../../../../api';

export type ValueCellProps = Pick<LeagueEntry, 'value'> & {
  metric: LeagueMetric;
};
