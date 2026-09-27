import { queryOptions } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import { getGameServers, getGameVersion } from '../game-status';

export const gameStatusQueries = {
  version: () => queryOptions({ queryKey: QUERY_KEYS.reference.version, queryFn: ({ signal }) => getGameVersion({ signal }) }),
  servers: () => queryOptions({ queryKey: QUERY_KEYS.reference.servers, queryFn: ({ signal }) => getGameServers({ signal }) })
};
