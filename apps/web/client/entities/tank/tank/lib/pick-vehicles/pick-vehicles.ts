import type { VehicleSummary } from '@otmetki/schemas';

import { indexBy, unique } from 'remeda';

import type { PickVehiclesInput } from './pick-vehicles.types';

export const vehicleIndex = (catalog: readonly VehicleSummary[] | undefined): Partial<Record<number, VehicleSummary>> =>
  indexBy(catalog ?? [], (vehicle) => vehicle.tankId);

export const pickVehicles = ({ tankIds, catalog }: PickVehiclesInput): VehicleSummary[] => {
  const byId = vehicleIndex(catalog);

  return unique(tankIds).flatMap((tankId) => byId[tankId] ?? []);
};
