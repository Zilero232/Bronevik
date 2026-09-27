import type { VehicleSummary } from '@otmetki/schemas';

export type PickDailyTankInput = {
  vehicles: VehicleSummary[];
  day: string;
};
