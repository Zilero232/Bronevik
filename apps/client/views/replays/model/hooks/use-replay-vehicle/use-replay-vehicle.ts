'use client';

import type { Replay } from '@/entities/replay/replay';

import { vehicleIndex } from '@/entities/tank/tank';
import { useVehicleCatalog } from '@/features/tank/pick-tank';

export const useReplayVehicle = () => {
  const { data: catalog } = useVehicleCatalog();
  const vehicles = vehicleIndex(catalog);

  return (replay: Replay) => (replay.owner ? (vehicles[replay.owner.tankId] ?? null) : null);
};
