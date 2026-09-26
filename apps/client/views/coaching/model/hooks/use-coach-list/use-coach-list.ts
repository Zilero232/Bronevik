'use client';

import type { VehicleSummary } from '@otmetki/schemas';

import { parseAsInteger, useQueryState } from 'nuqs';

import { listCoaches } from '@/entities/coaching/coach';
import { vehicleIndex } from '@/entities/tank/tank';
import { useVehicleCatalog } from '@/features/tank/pick-tank';
import { QUERY_KEYS } from '@/shared/constants';
import { useOffsetInfiniteList } from '@/shared/lib';

import { COACHING_LIST } from '../../../config';

export const useCoachList = () => {
  const [tankId, setTankId] = useQueryState('tank', parseAsInteger.withOptions({ history: 'replace' }));
  const { data: catalog } = useVehicleCatalog();
  const query = tankId === null ? {} : { tankId };
  const list = useOffsetInfiniteList({
    queryKey: QUERY_KEYS.coaching.list({ ...query, limit: COACHING_LIST.pageSize }),
    queryFn: ({ offset, signal }) => listCoaches({ ...query, limit: COACHING_LIST.pageSize, offset, signal })
  });

  return {
    ...list,
    vehicle: tankId === null ? null : (vehicleIndex(catalog)[tankId] ?? null),
    isFiltered: tankId !== null,
    onVehicleChange: (vehicle: VehicleSummary | null) => void setTankId(vehicle?.tankId ?? null),
    onReset: () => void setTankId(null)
  };
};
