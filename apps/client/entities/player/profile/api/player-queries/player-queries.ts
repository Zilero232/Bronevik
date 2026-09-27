import { queryOptions } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import { getPlayer } from '../players';

export const playerQueries = {
  profile: (idOrNick: string) =>
    queryOptions({
      queryKey: QUERY_KEYS.player.profile(idOrNick),
      queryFn: ({ signal }) => getPlayer({ idOrNick, signal })
    })
};
