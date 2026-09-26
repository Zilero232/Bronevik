'use client';

import { vehicleIndex } from '@/entities/tank/tank';
import { useVehicleCatalog } from '@/features/tank/pick-tank';

import type { UseLiveBlockInput } from './use-live-block.types';

export const useLiveBlock = ({ live, channels }: UseLiveBlockInput) => {
  const { data: catalog } = useVehicleCatalog();

  return {
    vehicle: live.tankId === null ? null : (vehicleIndex(catalog)[live.tankId] ?? null),
    watchUrl: channels.find(({ platform }) => platform === live.platform)?.url ?? null
  };
};
