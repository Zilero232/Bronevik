'use client';

import type { TankDetail, VehicleSummary } from '@bronevik/schemas';

import { useQueries } from '@tanstack/react-query';

import { getTank } from '@/shared/api/tanks';
import { QUERY_KEYS } from '@/shared/constants';

import { GUESS_TANK } from '../../../config';

export const useTankIntel = (vehicles: VehicleSummary[]) =>
  useQueries({
    queries: vehicles.map(({ slug }) => ({
      queryKey: QUERY_KEYS.tanks.detail({ idOrSlug: slug, scope: 'guess' }),
      queryFn: ({ signal }: { signal: AbortSignal }) => getTank({ idOrSlug: slug, signal }),
      staleTime: GUESS_TANK.detailStaleMs
    })),
    combine: (results) => new Map(results.flatMap(({ data }): [number, TankDetail][] => (data ? [[data.vehicle.tankId, data]] : [])))
  });
