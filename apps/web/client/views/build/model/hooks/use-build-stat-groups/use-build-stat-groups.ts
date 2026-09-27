'use client';

import { emptyLoadout } from '@/entities/tank/build';

import { buildStatGroups } from '../../../lib/stat-diff';
import { useBuildContext } from '../../context';
import { useBuildStats } from '../use-build-stats';

export const useBuildStatGroups = () => {
  const { vehicle, catalog, a, b, still } = useBuildContext();
  const { modules } = catalog;
  const baseQuery = useBuildStats({ tankId: vehicle.tankId, loadout: emptyLoadout(), modules, still });
  const queryA = useBuildStats({ tankId: vehicle.tankId, loadout: a, modules, still });
  const queryB = useBuildStats({ tankId: vehicle.tankId, loadout: b, modules, still });

  const base = baseQuery.data;
  const statsA = queryA.data;
  const statsB = queryB.data;

  const refetch = () => {
    [baseQuery, queryA, queryB]
      .filter((query) => query.isError)
      .forEach((query) => {
        void query.refetch();
      });
  };

  return {
    query: {
      data: statsA && base && !queryB.isError ? buildStatGroups({ base, a: statsA, b: b ? (statsB ?? null) : null }) : undefined,
      isError: baseQuery.isError || queryA.isError || queryB.isError,
      isRefetching: queryA.isFetching || queryB.isFetching,
      refetch
    },
    isCompare: b !== null
  };
};
