import type { VehicleSummary } from '@otmetki/schemas';

export type PickVehiclesInput = {
  tankIds: readonly number[];
  catalog: readonly VehicleSummary[] | undefined;
};
