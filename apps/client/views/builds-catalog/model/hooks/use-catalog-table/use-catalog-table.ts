'use client';

import type { BuildsCatalogEntry } from '@otmetki/schemas';

import { BUILD_USAGE } from '@otmetki/schemas';

import { useVehicleFilters } from '@/features/tank/filter-vehicles';
import { ROUTES } from '@/shared/constants';
import { useRouter } from '@/shared/i18n/navigation';

import { useBuildsCatalog } from '../use-builds-catalog';
import { useCatalogColumns } from '../use-catalog-columns';
import { useCatalogState } from '../use-catalog-state';

export const useCatalogTable = () => {
  const router = useRouter();
  const { data, isLoading, isError, isFetching, refetch } = useBuildsCatalog();
  const [{ difficulties }, setState] = useCatalogState();
  const { reset, isActive } = useVehicleFilters();
  const columns = useCatalogColumns();

  const onRowClick = (row: BuildsCatalogEntry) => {
    router.push(ROUTES.builds.detail(row.vehicle.slug));
  };

  const onReset = () => {
    void reset();
    void setState({ difficulties: null });
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
    isFiltered: isActive || difficulties.length > 0,
    onReset,
    onRetry,
    onRowClick
  };
};
