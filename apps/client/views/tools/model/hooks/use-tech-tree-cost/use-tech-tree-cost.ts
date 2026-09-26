'use client';

import type { VehicleSummary } from '@bronevik/schemas';

import { useQuery } from '@tanstack/react-query';

import { getTechTree } from '@/shared/api/tree';
import { QUERY_KEYS } from '@/shared/constants';

import { researchCost } from '../../../lib/research-plan';

export const useTechTreeCost = (vehicle: VehicleSummary | null) => {
  const { data: node = null, isFetching } = useQuery({
    queryKey: QUERY_KEYS.tree(vehicle?.nation ?? ''),
    queryFn: ({ signal }) => getTechTree({ nation: vehicle?.nation ?? '', signal }),
    enabled: vehicle !== null && !vehicle.isPremium,
    select: ({ nodes }) => nodes.find((item) => item.vehicle.tankId === vehicle?.tankId) ?? null
  });

  return { cost: vehicle ? researchCost({ tier: vehicle.tier, node }) : null, isFetching };
};
