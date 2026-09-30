import { queryOptions } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import { getModpackReleaseNotes, getModpackStatus } from '../modpack-release';

export const modpackReleaseQueries = {
  status: () => queryOptions({ queryKey: QUERY_KEYS.modpack.status, queryFn: ({ signal }) => getModpackStatus({ signal }) }),
  changelog: (limit: number) =>
    queryOptions({ queryKey: QUERY_KEYS.modpack.changelog(limit), queryFn: ({ signal }) => getModpackReleaseNotes({ limit, signal }) })
};
