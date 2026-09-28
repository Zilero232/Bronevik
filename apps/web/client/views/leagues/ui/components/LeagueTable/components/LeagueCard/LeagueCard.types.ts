import type { LeagueEntry, LeagueMetric } from '@/entities/social/league';

export type LeagueCardProps = {
  row: LeagueEntry;
  metric: LeagueMetric;
  showTier: boolean;
};
