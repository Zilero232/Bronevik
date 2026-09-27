import type { SearchParams } from 'nuqs/server';

import { cacheLife } from 'next/cache';
import { createLoader } from 'nuqs/server';

import { loadVehicleFilters, vehicleQuery } from '@/features/tank/filter-vehicles';
import { prefetchState } from '@/shared/api/prefetch-state';

import { TANKS_QUERY_PARSERS } from '../../config';
import { statsParams } from '../../lib/stats-params';
import { tanksQueries } from '../tanks-queries';

const loadTanksState = createLoader(TANKS_QUERY_PARSERS);

export const tanksPageState = async (search: SearchParams) => {
  'use cache';
  cacheLife('minutes');

  const params = statsParams({ state: loadTanksState(search), vehicle: vehicleQuery(loadVehicleFilters(search)) });

  return prefetchState((client) => [client.fetchQuery(tanksQueries.stats(params))]);
};
