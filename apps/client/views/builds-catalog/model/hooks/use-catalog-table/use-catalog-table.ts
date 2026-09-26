'use client';

import type { BuildsCatalogEntry } from '@otmetki/schemas';

import { BUILD_USAGE } from '@otmetki/schemas';

import { useVehicleFilters } from '@/features/tank/filter-vehicles';
import { ROUTES } from '@/shared/constants';
import { useRouter } from '@/shared/i18n/navigation';

import { useBuildsCatalog } from '../use-builds-catalog';
import { useCatalogColumns } from '../use-catalog-columns';

export const useCatalogTable = () => {
  const router = useRouter();
  const { data, isLoading, isError, isFetching, refetch } = useBuildsCatalog();
  const { reset, isActive } = useVehicleFilters();
  const columns = useCatalogColumns();

  const onRowClick = (row: BuildsCatalogEntry) => {
    router.push(ROUTES.build(row.vehicle.slug));
  };

  const onRetry = () => {
    void refetch();
  };

  return {
    columns,
    rows: data?.entries ?? [],
    minSample: data?.minSample ?? BUILD_USAGE.minSample,
    isLoading,
    isError,
    isFetching,
    isFiltered: isActive,
    onReset: reset,
    onRetry,
    onRowClick
  };
};
