import type { LeaderboardEntry } from '@otmetki/schemas';

import type { LeaderboardFilter } from '@/entities/player/leaderboard';

export type TopPodiumProps = {
  entries: LeaderboardEntry[];
  filter: LeaderboardFilter;
};
