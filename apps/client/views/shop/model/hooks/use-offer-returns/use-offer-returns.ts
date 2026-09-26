'use client';

import { useQuery } from '@tanstack/react-query';

import { vehicleIndex } from '@/entities/tank/tank';
import { useVehicleCatalog } from '@/features/tank/pick-tank';
import { shopControllerArchiveOptions } from '@/shared/api/query-options';
import { TIME_ZONE } from '@/shared/i18n';

import type { ReturnRow } from './use-offer-returns.types';

import { SHOP } from '../../../config';
import { returnOutlook } from '../../../lib/return-outlook';
import { useReturnsColumns } from '../use-returns-columns';

export const useOfferReturns = () => {
  const columns = useReturnsColumns();
  const { data: catalog } = useVehicleCatalog();
  const { data, dataUpdatedAt, isPending, isError, isFetching, refetch } = useQuery({ ...shopControllerArchiveOptions(), staleTime: SHOP.staleMs });

  const vehicles = vehicleIndex(catalog);
  const now = new Date(dataUpdatedAt);
  const rows: ReturnRow[] = (data ?? []).map((item) => ({
    ...item,
    vehicle: vehicles[item.tankId] ?? null,
    outlook: returnOutlook({ nextExpectedAt: item.nextExpectedAt, now, soonDays: SHOP.soonDays, timeZone: TIME_ZONE })
  }));

  return { rows, columns, isPending, isError, isRetrying: isFetching, retry: () => void refetch() };
};
