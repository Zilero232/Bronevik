'use client';

import { useQuery } from '@tanstack/react-query';

import { listVehicles } from '@/shared/api/tanks';
import { QUERY_KEYS } from '@/shared/constants';

const CATALOG_STALE_MS = 60 * 60 * 1000;

export const useVehicleCatalog = () =>
  useQuery({
    queryKey: QUERY_KEYS.tanks.catalog,
    queryFn: ({ signal }) => listVehicles({ signal }),
    staleTime: CATALOG_STALE_MS
  });
