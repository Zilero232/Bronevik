import type { LeaderboardEntry } from '@bronevik/schemas';

import type { LeaderboardFilter } from '@/shared/api/leaderboards';

export type TopTableProps = {
  entries: LeaderboardEntry[];
  filter: LeaderboardFilter;
};
