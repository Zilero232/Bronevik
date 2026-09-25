import type { Leaderboard } from '@bronevik/schemas';

import { leaderboardSchema } from '@bronevik/schemas';

import type { LeaderboardInput } from './leaderboards.types';

import { api } from '../http';
import { fromSource } from '../source';
import { LEADERBOARD_REQUEST } from './leaderboards.constants';
import { mockLeaderboard } from './leaderboards.mock';

export const getLeaderboard = ({ signal, ...filter }: LeaderboardInput): Promise<Leaderboard> =>
  fromSource({
    signal,
    mock: () => mockLeaderboard(filter),
    fetch: async () =>
      leaderboardSchema.parse((await api.get('/leaderboards', { params: { limit: LEADERBOARD_REQUEST.limit, ...filter }, signal })).data)
  });
