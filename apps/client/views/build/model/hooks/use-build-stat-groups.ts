'use client';

import { emptyLoadout } from '@/entities/tank/build';

import { buildStatGroups } from '../../lib/stat-diff';
import { useBuildContext } from '../context';
import { useBuildStats } from './use-build-stats';

export const useBuildStatGroups = () => {
  const { vehicle, catalog, a, b, still } = useBuildContext();
  const { modules } = catalog;
  const { data: base } = useBuildStats({ tankId: vehicle.tankId, loadout: emptyLoadout(), modules, still });
  const { data: statsA, isPending, isFetching: isFetchingA, isError } = useBuildStats({ tankId: vehicle.tankId, loadout: a, modules, still });
  const { data: statsB, isFetching: isFetchingB } = useBuildStats({ tankId: vehicle.tankId, loadout: b, modules, still });

  const groups = statsA && base ? buildStatGroups({ base, a: statsA, b: b ? (statsB ?? null) : null }) : [];

  return { groups, isPending, isError, isFetching: isFetchingA || isFetchingB, isCompare: b !== null };
};
