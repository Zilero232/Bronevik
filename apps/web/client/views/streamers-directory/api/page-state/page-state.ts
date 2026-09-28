import type { SearchParams } from 'nuqs/server';

import { cacheLife } from 'next/cache';
import { createLoader } from 'nuqs/server';

import type { StreamerDirectoryInput } from '@/entities/streamer/streamer';

import { prefetchState } from '@/shared/api/prefetch-state';
import { PREFETCH_CACHE_LIFE } from '@/shared/api/query-client';

import { DIRECTORY_FILTER_PARSERS } from '../../config';
import { directoryQuery } from '../../lib/directory-query';
import { directoryQueries } from '../directory-queries';

const loadDirectoryFilters = createLoader(DIRECTORY_FILTER_PARSERS);

const prefetchDirectory = async (params: StreamerDirectoryInput) => {
  'use cache';
  cacheLife(PREFETCH_CACHE_LIFE);

  return prefetchState((client) => [client.fetchInfiniteQuery(directoryQueries.list(params))]);
};

export const streamersPageState = async (search: SearchParams) => prefetchDirectory(directoryQuery(loadDirectoryFilters(search)));
