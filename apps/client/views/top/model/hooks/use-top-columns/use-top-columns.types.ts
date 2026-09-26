import type { LeaderboardFilter } from '@/shared/api/leaderboards';

import type { TopTank } from '../../../lib/top-filter';

export type UseTopColumnsInput = {
  filter: LeaderboardFilter;
  tank: TopTank | null;
};
