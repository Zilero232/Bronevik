'use client';

import { useQuery } from '@tanstack/react-query';

import { vehicleIndex } from '@/entities/tank/tank';
import { useVehicleCatalog } from '@/features/tank/pick-tank';
import { QUERY_KEYS } from '@/shared/constants';

import { getTankLevels } from '../../../api';
import { PROGRESS_PAGE } from '../../../config';
import { levelProgress } from '../../../lib/level-progress';

export const useTankLevels = () => {
  const { data: catalog } = useVehicleCatalog();
  const { data, isPending, isError, isFetching, refetch } = useQuery({ queryKey: QUERY_KEYS.me.progression.tanks, queryFn: getTankLevels });

  const vehicles = vehicleIndex(catalog);

  return {
    isPending,
    isError,
    isRetrying: isFetching,
    retry: () => void refetch(),
    rows: (data?.items ?? []).slice(0, PROGRESS_PAGE.tanksShown).map((item) => ({
      key: `${item.accountId}-${item.tankId}`,
      tankId: item.tankId,
      vehicle: vehicles[item.tankId] ?? null,
      level: item.level,
      xp: item.xp,
      nextLevelXp: item.nextLevelXp,
      battles: item.battles,
      progress: levelProgress({ current: item.xp, start: item.levelXp, next: item.nextLevelXp })
    }))
  };
};
