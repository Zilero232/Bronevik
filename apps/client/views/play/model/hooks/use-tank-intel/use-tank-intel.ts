'use client';

import type { TankDetail, VehicleSummary } from '@otmetki/schemas';
import type { QueryFunctionContext } from '@tanstack/react-query';

import { useQueries } from '@tanstack/react-query';

import { getTank } from '@/shared/api/tanks';
import { QUERY_KEYS } from '@/shared/constants';

import { GUESS_TANK } from '../../../config';

export const useTankIntel = (vehicles: VehicleSummary[]) =>
  useQueries({
    queries: vehicles.map(({ slug }) => ({
      queryKey: QUERY_KEYS.tanks.detail({ idOrSlug: slug, scope: 'guess' }),
      queryFn: ({ signal }: QueryFunctionContext) => getTank({ idOrSlug: slug, signal }),
      staleTime: GUESS_TANK.detailStaleMs
    })),
    combine: (results) => new Map(results.flatMap(({ data }): [number, TankDetail][] => (data ? [[data.vehicle.tankId, data]] : [])))
  });
