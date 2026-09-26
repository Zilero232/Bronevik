import type { LeaderboardEntry } from '@bronevik/schemas';

import type { LeaderboardFilter } from '@/shared/api/leaderboards';

export type ValueCellProps = {
  entry: LeaderboardEntry;
  filter: LeaderboardFilter;
};
