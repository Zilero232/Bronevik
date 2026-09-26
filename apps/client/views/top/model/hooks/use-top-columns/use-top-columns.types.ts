import type { LeaderboardEntry } from '@otmetki/schemas';

import type { LeaderboardFilter } from '@/entities/player/leaderboard';

import type { TopTank } from '../../../lib/top-filter';

export type UseTopColumnsInput = {
  filter: LeaderboardFilter;
  tank: TopTank | null;
  entries: readonly LeaderboardEntry[];
};
