'use client';

import { useQuery } from '@tanstack/react-query';

import { listVehicles } from '@/shared/api/tanks';
import { QUERY_KEYS } from '@/shared/constants';

import { TANK_PICKER } from '../../../config';

export const useVehicleCatalog = () =>
  useQuery({
    queryKey: QUERY_KEYS.tanks.catalog,
    queryFn: ({ signal }) => listVehicles({ signal }),
    staleTime: TANK_PICKER.catalogStaleMs
  });
