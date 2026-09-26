import type { LeaderboardEntry } from '@otmetki/schemas';

import type { LeaderboardFilter } from '@/shared/api/leaderboards';

export type ValueCellProps = {
  entry: LeaderboardEntry;
  filter: LeaderboardFilter;
};
