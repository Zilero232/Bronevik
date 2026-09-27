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
  const query = useQuery({
    queryKey: QUERY_KEYS.me.progression.challenges,
    queryFn: getTankChallenges,
    enabled: isPlus
  });

  const vehicles = vehicleIndex(catalog);

  useCelebrateGain({
    key: query.data ? `challenges:${query.data.weekStart}` : null,
    value: query.data?.sets.flatMap((set) => set.items).filter((item) => item.completedAt !== null).length
  });

  return {
    query,
    endsAt: query.data?.endsAt ?? null,
    sets: (query.data?.sets ?? []).map((set) => ({ ...set, key: `${set.accountId}-${set.tankId}`, vehicle: vehicles[set.tankId] ?? null }))
  };
};
