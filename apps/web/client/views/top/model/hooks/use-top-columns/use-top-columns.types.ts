import type { LeaderboardEntry, VehicleSummary } from '@otmetki/schemas';

import type { LeaderboardFilter } from '@/entities/player/leaderboard';

export type UseTopColumnsInput = {
  filter: LeaderboardFilter;
  tank: VehicleSummary | null;
  entries: readonly LeaderboardEntry[];
};
