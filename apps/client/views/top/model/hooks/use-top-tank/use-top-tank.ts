'use client';

import { vehicleIndex } from '@/entities/tank/tank';
import { useVehicleCatalog } from '@/features/tank/pick-tank';

import { useTopParams } from '../use-top-params';

export const useTopTank = () => {
  const [{ tank }] = useTopParams();
  const { data: catalog } = useVehicleCatalog();

  return tank === null ? null : (vehicleIndex(catalog)[tank] ?? null);
};
