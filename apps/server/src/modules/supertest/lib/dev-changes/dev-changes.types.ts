import type { VehicleStats } from '@otmetki/schemas';

export type DevChangesInput = {
  stats: VehicleStats;
  variant: number;
};

export type RoundInput = {
  value: number;
  digits: number;
};
