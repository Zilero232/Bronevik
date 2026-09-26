'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { listTankStats } from '@/entities/tank/tank';
import { QUERY_KEYS } from '@/shared/constants';

import type { StrongTier } from './use-strong-tanks.types';

import { HOME } from '../../../config';

export const useStrongTanks = () => {
  const [tier, setTier] = useState<StrongTier>(HOME.strongTanks.tiers[0]);

  const params = { period: HOME.period.server, tiers: [tier], sort: 'winRate', order: 'desc', limit: HOME.strongTanks.limit } as const;

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: QUERY_KEYS.tanks.stats(params),
    queryFn: ({ signal }) => listTankStats({ ...params, tiers: [...params.tiers], signal }),
    placeholderData: keepPreviousData
  });

  const rows = data?.items ?? [];

  const setTiers = (next: number[]) => {
    const match = HOME.strongTanks.tiers.find((option) => option === next[0]);

    if (match !== undefined) {
      setTier(match);
    }
  };

  return {
    tiers: [tier],
    setTiers,
    cards: rows.slice(0, HOME.strongTanks.cards),
    updatedAt: rows[0]?.computedAt ?? null,
    isPending,
    isError,
    retry: () => void refetch()
  };
};
