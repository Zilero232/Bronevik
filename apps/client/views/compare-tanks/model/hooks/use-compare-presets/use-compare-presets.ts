'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import type { TankStatsInput } from '@/shared/api/tanks';

import { listTankStats } from '@/shared/api/tanks';
import { QUERY_KEYS } from '@/shared/constants';

import type { ComparePreset } from '../../../config';

import { COMPARE_REQUEST } from '../../../config';
import { useCompareIds } from '../use-compare-ids';

export const useComparePresets = () => {
  const t = useTranslations('tanks.compare.presets');
  const queryClient = useQueryClient();
  const { setIds } = useCompareIds();
  const [pendingKey, setPendingKey] = useState<ComparePreset['key'] | null>(null);

  const apply = async ({ key, tiers, types, premium }: ComparePreset) => {
    const params: TankStatsInput = {
      period: COMPARE_REQUEST.statsPeriod,
      mode: COMPARE_REQUEST.mode,
      tiers: [...tiers],
      types: types ? [...types] : undefined,
      premium,
      sort: 'battles',
      order: 'desc',
      limit: COMPARE_REQUEST.presetSize
    };

    setPendingKey(key);

    try {
      const page = await queryClient.fetchQuery({
        queryKey: QUERY_KEYS.tanks.stats(params),
        queryFn: ({ signal }) => listTankStats({ ...params, signal })
      });

      setIds(page.items.map(({ vehicle }) => vehicle.tankId));
    } catch {
      toast.error(t('failed'));
    } finally {
      setPendingKey(null);
    }
  };

  return { pendingKey, apply };
};
