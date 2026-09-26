'use client';

import type { VehicleSummary } from '@otmetki/schemas';

import { useFormContext, useWatch } from 'react-hook-form';

import { pickVehicles } from '@/entities/tank/tank';
import { useVehicleCatalog } from '@/features/tank/pick-tank';

import type { CoachFormOutput, CoachFormValues } from '../../../lib/coach-form';

import { COACH_FORM } from '../../../config';

export const useCoachTanksField = () => {
  const { control, setValue } = useFormContext<CoachFormValues, unknown, CoachFormOutput>();
  const tankIds = useWatch({ control, name: 'tankIds' });
  const { data: catalog } = useVehicleCatalog();

  const update = (next: number[]) => setValue('tankIds', next, { shouldDirty: true });

  return {
    tankIds,
    vehicles: pickVehicles({ tankIds, catalog }),
    isFull: tankIds.length >= COACH_FORM.maxTanks,
    onPick: (vehicle: VehicleSummary | null) => {
      if (vehicle && !tankIds.includes(vehicle.tankId) && tankIds.length < COACH_FORM.maxTanks) {
        update([...tankIds, vehicle.tankId]);
      }
    },
    onRemove: (tankId: number) => update(tankIds.filter((id) => id !== tankId))
  };
};
