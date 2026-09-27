import type { LeagueMetric } from '../../../api';
import type { LeagueStanding as Standing } from '../../../lib/league-table';

export type LeagueStandingProps = {
  metric: LeagueMetric;
  standing: Standing;
};
