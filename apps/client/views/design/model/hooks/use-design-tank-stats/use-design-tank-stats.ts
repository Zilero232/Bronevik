'use client';

import { useQuery } from '@tanstack/react-query';

import { listTankStats } from '@/entities/tank/tank';
import { QUERY_KEYS } from '@/shared/constants';

import { TABLE_QUERY } from '../../../config';

export const useDesignTankStats = () =>
  useQuery({
    queryKey: QUERY_KEYS.tanks.stats(TABLE_QUERY),
    queryFn: ({ signal }) => listTankStats({ ...TABLE_QUERY, signal })
  });
