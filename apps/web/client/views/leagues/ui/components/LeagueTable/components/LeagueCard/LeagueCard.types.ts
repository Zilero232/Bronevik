import type { LeagueEntry, LeagueMetric } from '../../../../../api';

export type LeagueCardProps = {
  row: LeagueEntry;
  metric: LeagueMetric;
  showTier: boolean;
};
