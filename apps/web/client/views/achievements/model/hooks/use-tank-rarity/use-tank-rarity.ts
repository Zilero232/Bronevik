'use client';

import type { TankClass } from '@otmetki/icons';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { achievementsRarityControllerTankRarityOptions } from '@/shared/api/query-options';

import { ACHIEVEMENTS } from '../../../config';
import { useAchievementsParams } from '../use-achievements-params';

export const useTankRarity = () => {
  const [{ tier, type, order }, setParams] = useAchievementsParams();
  const query = useQuery({
    ...achievementsRarityControllerTankRarityOptions({ query: { tier: tier ?? undefined, type: type ?? undefined, sort: order } }),
    staleTime: ACHIEVEMENTS.staleMs,
    placeholderData: keepPreviousData
  });

  return {
    query,
    tiers: tier === null ? [] : [tier],
    types: type === null ? [] : [type],
    order,
    isFiltered: tier !== null || type !== null,
    onReset: () => void setParams({ tier: null, type: null }),
    onTiersChange: (next: number[]) => void setParams({ tier: next.find((value) => value !== tier) ?? null }),
    onTypesChange: (next: TankClass[]) => void setParams({ type: next.find((value) => value !== type) ?? null }),
    onOrderChange: (next: typeof order) => void setParams({ order: next })
  };
};
