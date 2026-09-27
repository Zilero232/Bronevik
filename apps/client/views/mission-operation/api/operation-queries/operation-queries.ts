import type { MissionOperationParams } from '@otmetki/schemas';

import { queryOptions } from '@tanstack/react-query';

import { getMissionOperation } from '@/entities/mission/mission';
import { QUERY_KEYS } from '@/shared/constants';

export const operationQueries = {
  detail: ({ campaign, operation }: MissionOperationParams) =>
    queryOptions({
      queryKey: QUERY_KEYS.missions.operation({ campaign, operation }),
      queryFn: ({ signal }) => getMissionOperation({ campaign, operation, signal }),
      retry: false
    })
};
