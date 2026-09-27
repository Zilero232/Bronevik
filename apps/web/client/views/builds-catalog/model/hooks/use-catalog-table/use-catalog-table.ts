'use client';

import { BUILD_USAGE } from '@otmetki/schemas';

import { useVehicleFilters } from '@/features/tank/filter-vehicles';

import { useBuildsCatalog } from '../use-builds-catalog';
import { useCatalogColumns } from '../use-catalog-columns';
import { useCatalogState } from '../use-catalog-state';

export const useCatalogTable = () => {
  const query = useBuildsCatalog();
  const [{ difficulties }, setState] = useCatalogState();
  const { reset, isActive } = useVehicleFilters();
  const columns = useCatalogColumns();

  const onReset = () => {
    void reset();
    void setState({ difficulties: null });
  };

  return {
    columns,
    query,
    minSample: query.data?.minSample ?? BUILD_USAGE.minSample,
    isFiltered: isActive || difficulties.length > 0,
    onReset
  };
};
