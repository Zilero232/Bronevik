import type { LeaderboardEntry } from '@otmetki/schemas';

import type { LeaderboardFilter } from '@/entities/player/leaderboard';

export type ValueCellProps = {
  entry: LeaderboardEntry;
  filter: LeaderboardFilter;
  isHero?: boolean;
};
