import { cacheLife } from 'next/cache';

import { playerQueries } from '@/entities/player/profile';
import { prefetchState } from '@/shared/api/prefetch-state';

export const playerPageState = async (nickname: string) => {
  'use cache';
  cacheLife('minutes');

  return prefetchState((client) => [client.fetchQuery(playerQueries.profile(nickname))]);
};
