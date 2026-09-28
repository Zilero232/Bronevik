import type { LeagueMetric } from '@/entities/social/league';

import type { LeagueStanding as Standing } from '../../../lib/league-table';

export type LeagueStandingProps = {
  metric: LeagueMetric;
  standing: Standing;
};
