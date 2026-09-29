import { queryOptions } from '@tanstack/react-query';

import { replaysControllerVersions } from '@/shared/api/generated';
import { fromSdk } from '@/shared/api/source';
import { QUERY_KEYS } from '@/shared/constants';

export const replayVersionsQuery = () =>
  queryOptions({
    queryKey: QUERY_KEYS.replays.versions,
    queryFn: ({ signal }) => fromSdk(() => replaysControllerVersions({ signal })),
    select: ({ versions }) => versions
  });
