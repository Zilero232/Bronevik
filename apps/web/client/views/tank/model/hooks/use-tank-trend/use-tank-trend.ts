'use client';

import { useQuery } from '@tanstack/react-query';

import { getTankTrend } from '@/entities/tank/tank';
import { QUERY_KEYS } from '@/shared/constants';

import { TANK_PAGE } from '../../../config';
import { useTank } from '../../context';

export const useTankTrend = () => {
  const { tankId } = useTank();

  return useQuery({
    queryKey: QUERY_KEYS.tanks.trend(tankId),
    queryFn: ({ signal }) => getTankTrend({ tankId, days: TANK_PAGE.trendDays, signal }),
    select: ({ points }) => points
  });
};
