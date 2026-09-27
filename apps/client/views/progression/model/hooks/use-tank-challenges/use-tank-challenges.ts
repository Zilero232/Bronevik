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

  const { data: challenges } = query;

  useCelebrateGain({
    key: challenges ? `challenges:${challenges.weekStart}` : null,
    value: challenges?.sets.flatMap((set) => set.items).filter((item) => item.completedAt !== null).length
  });

  const vehicles = vehicleIndex(catalog);

  return {
    query,
    endsAt: challenges?.endsAt ?? null,
    sets: (challenges?.sets ?? []).map((set) => ({ ...set, key: `${set.accountId}-${set.tankId}`, vehicle: vehicles[set.tankId] ?? null }))
  };
};
