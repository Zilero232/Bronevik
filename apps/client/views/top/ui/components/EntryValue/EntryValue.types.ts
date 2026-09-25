import type { LeaderboardEntry } from '@bronevik/schemas';

import type { LeaderboardFilter } from '@/shared/api/leaderboards';

export type EntryValueProps = {
  entry: LeaderboardEntry;
  filter: LeaderboardFilter;
  size?: 'lg' | 'sm';
};
