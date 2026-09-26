import type { Leaderboard } from '@otmetki/schemas';

import type { LeaderboardInput } from './leaderboards.types';

import { leaderboardsControllerList } from '../generated';
import { fromSdk } from '../source';
import { LEADERBOARD_REQUEST } from './leaderboards.constants';

export const getLeaderboard = ({ signal, ...filter }: LeaderboardInput): Promise<Leaderboard> =>
  fromSdk(() => leaderboardsControllerList({ query: { limit: LEADERBOARD_REQUEST.limit, ...filter }, signal }));
