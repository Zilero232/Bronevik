'use client';

import { useVehicleCatalog } from '../use-vehicle-catalog';

export const useTankPicker = (excludeIds: readonly number[]) => {
  const { data: vehicles = [], isLoading, isError, isFetching, refetch } = useVehicleCatalog();

  return {
    items: vehicles.filter(({ tankId }) => !excludeIds.includes(tankId)),
    isLoading,
    isError,
    isFetching,
    retry: () => void refetch()
  };
};
