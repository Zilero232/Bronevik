import type { LeaderboardEntry } from '@bronevik/schemas';

import type { LeaderboardFilter } from '@/shared/api/leaderboards';

export type TopPodiumProps = {
  entries: LeaderboardEntry[];
  filter: LeaderboardFilter;
};
