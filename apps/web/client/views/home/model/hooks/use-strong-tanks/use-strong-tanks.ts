'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useFormatter, useTranslations } from 'next-intl';
import { useState } from 'react';

import { listTankStats } from '@/entities/tank/tank';
import { QUERY_KEYS } from '@/shared/constants';

import type { StrongTier } from './use-strong-tanks.types';

import { HOME } from '../../../config';

export const useStrongTanks = () => {
  const t = useTranslations('home.strongTanks');
  const format = useFormatter();
  const [tier, setTier] = useState<StrongTier>(HOME.strongTanks.tiers[0]);

  const params = {
    period: HOME.period.server,
    tiers: [tier],
    sort: HOME.strongTanks.sort,
    order: HOME.strongTanks.order,
    limit: HOME.strongTanks.limit
  };

  const query = useQuery({
    queryKey: QUERY_KEYS.tanks.stats(params),
    queryFn: ({ signal }) => listTankStats({ ...params, tiers: [...params.tiers], signal }),
    placeholderData: keepPreviousData,
    select: ({ items }) =>
      items.slice(0, HOME.strongTanks.cards).map((row) => ({
        row,
        damage: { id: 'damage', label: t('damage'), value: format.number(row.avgDamage, 'integer') },
        battles: { id: 'battles', label: t('battles'), value: format.number(row.battles, 'compact') }
      }))
  });

  const setTiers = (next: number[]) => {
    const match = HOME.strongTanks.tiers.find((option) => option === next[0]);

    if (match !== undefined) {
      setTier(match);
    }
  };

  return {
    tiers: [tier],
    setTiers,
    query,
    updatedAt: query.data?.[0]?.row.computedAt ?? null
  };
};
