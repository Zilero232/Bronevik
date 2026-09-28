import { queryOptions } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import { listVehicles } from '../tanks';
import { VEHICLE_CATALOG } from './vehicle-catalog.constants';

export const vehicleCatalogQuery = () =>
  queryOptions({
    queryKey: QUERY_KEYS.tanks.catalog,
    queryFn: ({ signal }) => listVehicles({ signal }),
    staleTime: VEHICLE_CATALOG.staleMs
  });
