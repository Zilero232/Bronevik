import type { LeaderboardEntry } from '@bronevik/schemas';
import type { ReactNode } from 'react';

import type { LeaderboardFilter } from '@/shared/api/leaderboards';

import type { TopTank } from '../../../lib/top-filter';

export type TopTableProps = {
  entries: LeaderboardEntry[];
  filter: LeaderboardFilter;
  tank: TopTank | null;
  isLoading: boolean;
  summary?: ReactNode;
};
