import { queryOptions } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import { getMissionProgress } from '../missions';

export const missionQueries = {
  progress: (isSignedIn: boolean) =>
    queryOptions({
      queryKey: QUERY_KEYS.missions.progress,
      queryFn: ({ signal }) => getMissionProgress({ signal }),
      enabled: isSignedIn,
      retry: false
    })
};
