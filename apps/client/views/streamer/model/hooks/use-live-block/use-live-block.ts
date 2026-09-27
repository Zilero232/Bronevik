'use client';

import type { StreamerLive } from '@otmetki/schemas';

import { vehicleIndex } from '@/entities/tank/tank';
import { useVehicleCatalog } from '@/features/tank/pick-tank';

import { useStreamer } from '../../context';

export const useLiveBlock = (live: StreamerLive) => {
  const { channels } = useStreamer();
  const { data: catalog } = useVehicleCatalog();

  return {
    vehicle: live.tankId === null ? null : (vehicleIndex(catalog)[live.tankId] ?? null),
    watchUrl: channels.find(({ platform }) => platform === live.platform)?.url ?? null
  };
};
