'use client';

import type { VehicleSummary } from '@otmetki/schemas';

import type { FollowState } from '@/features/streamer/follow-streamer';

import { vehicleIndex } from '@/entities/tank/tank';
import { useVehicleCatalog } from '@/features/tank/pick-tank';

export const useFollowTank = ({ tankId, onTankChange }: FollowState) => {
  const { data: catalog } = useVehicleCatalog();

  return {
    vehicle: tankId === null ? null : (vehicleIndex(catalog)[tankId] ?? null),
    onVehicleChange: (vehicle: VehicleSummary | null) => onTankChange(vehicle?.tankId ?? null)
  };
};
