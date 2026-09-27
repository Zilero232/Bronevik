import type { Leaderboard } from '@otmetki/schemas';

import { leaderboardsControllerList } from '@/shared/api/generated';
import { fromSdk } from '@/shared/api/source';

import type { LeaderboardInput } from './leaderboards.types';

import { LEADERBOARD_REQUEST } from './leaderboards.constants';

export const getLeaderboard = ({ signal, ...filter }: LeaderboardInput): Promise<Leaderboard> =>
  fromSdk(() => leaderboardsControllerList({ query: { limit: LEADERBOARD_REQUEST.limit, ...filter }, signal }));
