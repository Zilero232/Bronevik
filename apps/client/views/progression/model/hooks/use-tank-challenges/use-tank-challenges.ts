'use client';

import { useQuery } from '@tanstack/react-query';

import { vehicleIndex } from '@/entities/tank/tank';
import { usePlus } from '@/features/plus/plus-gate';
import { useVehicleCatalog } from '@/features/tank/pick-tank';
import { QUERY_KEYS } from '@/shared/constants';
import { useCelebrateGain } from '@/shared/lib';

import { getTankChallenges } from '../../../api';

export const useTankChallenges = () => {
  const { isPlus } = usePlus();
  const { data: catalog } = useVehicleCatalog();
  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: QUERY_KEYS.me.progression.challenges,
    queryFn: getTankChallenges,
    enabled: isPlus
  });

  const vehicles = vehicleIndex(catalog);

  useCelebrateGain({
    key: data ? `challenges:${data.weekStart}` : null,
    value: data?.sets.flatMap((set) => set.items).filter((item) => item.completedAt !== null).length
  });

  return {
    isPending,
    isError,
    isRetrying: isFetching,
    retry: () => void refetch(),
    endsAt: data?.endsAt ?? null,
    sets: (data?.sets ?? []).map((set) => ({ ...set, key: `${set.accountId}-${set.tankId}`, vehicle: vehicles[set.tankId] ?? null }))
  };
};
