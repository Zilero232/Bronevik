import type { LeaderboardQuery } from '@otmetki/schemas';

export type LeaderboardFilter = Pick<LeaderboardQuery, 'metric' | 'period' | 'scope'> &
  Partial<Pick<LeaderboardQuery, 'limit' | 'minBattles' | 'tankId' | 'tier' | 'type'>>;

export type LeaderboardInput = LeaderboardFilter & {
  signal?: AbortSignal;
};
