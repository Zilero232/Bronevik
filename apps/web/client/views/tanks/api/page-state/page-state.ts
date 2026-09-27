import type { SearchParams } from 'nuqs/server';

import { cacheLife } from 'next/cache';
import { createLoader } from 'nuqs/server';
import { isNonNullish } from 'remeda';

import { loadVehicleFilters, vehicleQuery } from '@/features/tank/filter-vehicles';
import { prefetchState } from '@/shared/api/prefetch-state';
import { PREFETCH_CACHE_LIFE } from '@/shared/api/query-client';

import type { TanksPrefetchInput } from './page-state.types';

import { TANKS_QUERY_PARSERS } from '../../config';
import { statsParams } from '../../lib/stats-params';
import { activeViewParams } from '../../lib/view-params';
import { tanksQueries } from '../tanks-queries';

const loadTanksState = createLoader(TANKS_QUERY_PARSERS);

const prefetchTanks = async ({ stats, tierList, economy }: TanksPrefetchInput) => {
  'use cache';
  cacheLife(PREFETCH_CACHE_LIFE);

  return prefetchState((client) => [
    client.fetchQuery(tanksQueries.stats(stats)),
    ...(isNonNullish(tierList) ? [client.fetchQuery(tanksQueries.tierList(tierList))] : []),
    ...(isNonNullish(economy) ? [client.fetchQuery(tanksQueries.economy(economy))] : [])
  ]);
};

export const tanksPageState = async (search: SearchParams) => {
  const state = loadTanksState(search);
  const filters = loadVehicleFilters(search);
  const vehicle = vehicleQuery(filters);

  return prefetchTanks({ stats: statsParams({ state, vehicle }), ...activeViewParams({ state, filters, vehicle }) });
};
