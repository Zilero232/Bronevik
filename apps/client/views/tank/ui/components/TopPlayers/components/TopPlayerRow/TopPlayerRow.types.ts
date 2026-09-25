import type { LeaderboardEntry, TopPlayersMetric } from '@bronevik/schemas';

export type TopPlayerRowProps = {
  entry: LeaderboardEntry;
  metric: TopPlayersMetric;
  index: number;
};
