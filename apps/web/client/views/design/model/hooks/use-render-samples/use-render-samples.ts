'use client';

import { useVehicleCatalog } from '@/features/tank/pick-tank';

import { renderSamples } from '../../../lib/render-samples';

export const useRenderSamples = () => {
  const catalog = useVehicleCatalog();

  const samples = renderSamples(catalog.data ?? []);

  const onRetry = () => catalog.refetch();

  return {
    samples,
    isLoading: catalog.isLoading,
    isError: catalog.isError,
    isEmpty: catalog.isSuccess && samples.length === 0,
    onRetry
  };
};
