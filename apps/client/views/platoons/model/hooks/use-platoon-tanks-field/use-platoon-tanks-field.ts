'use client';

import type { VehicleSummary } from '@otmetki/schemas';

import { useFormContext, useWatch } from 'react-hook-form';

import { pickVehicles } from '@/entities/tank/tank';
import { useVehicleCatalog } from '@/features/tank/pick-tank';

import type { PlatoonFormOutput, PlatoonFormValues } from '../../../lib/platoon-form';

import { PLATOON_BOARD } from '../../../config';

export const usePlatoonTanksField = () => {
  const { control, setValue } = useFormContext<PlatoonFormValues, unknown, PlatoonFormOutput>();
  const tankIds = useWatch({ control, name: 'tankIds' });
  const { data: catalog } = useVehicleCatalog();

  const update = (next: number[]) => setValue('tankIds', next, { shouldDirty: true });

  return {
    tankIds,
    vehicles: pickVehicles({ tankIds, catalog }),
    isFull: tankIds.length >= PLATOON_BOARD.maxTanks,
    onPick: (vehicle: VehicleSummary | null) => {
      if (vehicle && !tankIds.includes(vehicle.tankId) && tankIds.length < PLATOON_BOARD.maxTanks) {
        update([...tankIds, vehicle.tankId]);
      }
    },
    onRemove: (tankId: number) => update(tankIds.filter((id) => id !== tankId))
  };
};
