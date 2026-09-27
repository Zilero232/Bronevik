'use client';

import type { VehicleSummary } from '@otmetki/schemas';

import { pickVehicles } from '@/entities/tank/tank';

import type { UseTankIdsFieldInput } from './use-tank-ids-field.types';

import { useVehicleCatalog } from '../use-vehicle-catalog';

export const useTankIdsField = ({ value, max, onChange }: UseTankIdsFieldInput) => {
  const { data: catalog } = useVehicleCatalog();

  return {
    vehicles: pickVehicles({ tankIds: value, catalog }),
    isFull: value.length >= max,
    onPick: (vehicle: VehicleSummary | null) => {
      if (vehicle && !value.includes(vehicle.tankId) && value.length < max) {
        onChange([...value, vehicle.tankId]);
      }
    },
    onRemove: (tankId: number) => onChange(value.filter((id) => id !== tankId))
  };
};
