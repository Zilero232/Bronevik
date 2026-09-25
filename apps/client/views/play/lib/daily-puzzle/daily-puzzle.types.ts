import type { VehicleSummary } from '@bronevik/schemas';

export type PickDailyTankInput = {
  vehicles: VehicleSummary[];
  day: string;
};
