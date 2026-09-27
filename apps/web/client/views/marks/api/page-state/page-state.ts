import type { SearchParams } from 'nuqs/server';

import { cacheLife } from 'next/cache';
import { createLoader } from 'nuqs/server';

import { loadVehicleFilters, vehicleQuery } from '@/features/tank/filter-vehicles';
import { prefetchState } from '@/shared/api/prefetch-state';
import { PREFETCH_CACHE_LIFE } from '@/shared/api/query-client';

import type { MoeFeedInput } from '../marks-queries';

import { MARKS_URL_PARSERS } from '../../config';
import { moeFeedParams } from '../../lib/moe-feed-params';
import { marksQueries } from '../marks-queries';

const loadMarksState = createLoader(MARKS_URL_PARSERS);

const prefetchFeed = async (params: MoeFeedInput) => {
  'use cache';
  cacheLife(PREFETCH_CACHE_LIFE);

  return prefetchState((client) => [client.fetchInfiniteQuery(marksQueries.feed(params))]);
};

export const marksPageState = async (search: SearchParams) =>
  prefetchFeed(moeFeedParams({ ...loadMarksState(search), vehicle: vehicleQuery(loadVehicleFilters(search)) }));
