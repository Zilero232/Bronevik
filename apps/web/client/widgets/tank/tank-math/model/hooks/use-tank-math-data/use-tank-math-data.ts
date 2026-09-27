'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import { getTankMath } from '../../../api';
import { TANK_MATH } from '../../../config';

export const useTankMathData = (tankId: number | null) =>
  useQuery({
    queryKey: QUERY_KEYS.tankMath.detail(tankId ?? 0),
    queryFn: ({ signal }) => getTankMath({ tankId: tankId ?? 0, signal }),
    enabled: tankId !== null,
    staleTime: TANK_MATH.staleMs
  });
