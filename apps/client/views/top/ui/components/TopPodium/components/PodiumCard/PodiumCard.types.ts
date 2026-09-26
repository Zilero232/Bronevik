import type { LeaderboardEntry } from '@otmetki/schemas';

import type { LeaderboardFilter } from '@/entities/player/leaderboard';

export type PodiumCardProps = {
  entry: LeaderboardEntry;
  filter: LeaderboardFilter;
};
