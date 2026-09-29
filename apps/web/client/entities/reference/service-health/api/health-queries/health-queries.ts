import { queryOptions } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import { HEALTH_REQUEST } from '../../config';
import { getHealth } from '../health';

export const healthQuery = () =>
  queryOptions({
    queryKey: QUERY_KEYS.reference.health,
    queryFn: ({ signal }) => getHealth({ signal }),
    staleTime: HEALTH_REQUEST.staleMs,
    refetchInterval: HEALTH_REQUEST.refetchMs
  });
