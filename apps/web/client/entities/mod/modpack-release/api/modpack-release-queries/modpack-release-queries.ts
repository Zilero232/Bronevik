import { queryOptions } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import { getModpackStatus } from '../modpack-release';

export const modpackReleaseQueries = {
  status: () => queryOptions({ queryKey: QUERY_KEYS.modpack.status, queryFn: ({ signal }) => getModpackStatus({ signal }) })
};
