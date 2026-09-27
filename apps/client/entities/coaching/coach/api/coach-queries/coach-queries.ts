import { queryOptions } from '@tanstack/react-query';

import { isNotFoundError } from '@/shared/api/source';
import { QUERY_KEYS } from '@/shared/constants';

import { getCoach } from '../coaching';

export const coachQueries = {
  detail: (userId: string) =>
    queryOptions({
      queryKey: QUERY_KEYS.coaching.coach(userId),
      queryFn: ({ signal }) => getCoach({ userId, signal }),
      retry: (count, failure) => !isNotFoundError(failure) && count < 2
    })
};
