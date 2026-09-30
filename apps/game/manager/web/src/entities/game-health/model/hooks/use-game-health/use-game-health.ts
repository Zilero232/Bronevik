import { useQuery } from '@tanstack/react-query';

import { QUERY, QUERY_KEYS } from '@/shared/config';

import { getGameHealth } from '../../../api';

export const useGameHealth = (clientPath: string | null) =>
  useQuery({
    queryKey: QUERY_KEYS.gameHealth(clientPath),
    queryFn: () => getGameHealth(clientPath),
    enabled: clientPath !== null,
    refetchInterval: QUERY.gameHealthRefetchMs
  });
