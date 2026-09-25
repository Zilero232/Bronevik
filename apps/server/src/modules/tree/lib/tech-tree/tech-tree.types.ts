import type { VehicleSummary } from '@bronevik/schemas';

import type { Vehicle } from '../../../../../generated';

export type TreeVehicleRow = Pick<Vehicle, 'nextTanks' | 'prevTankIds' | 'priceCredit' | 'priceGold' | 'tankId'>;

export type BuildTechTreeInput = {
  nation: string;
  vehicles: readonly TreeVehicleRow[];
  summaries: ReadonlyMap<number, VehicleSummary>;
};

export type EdgeEnds = {
  from: number;
  to: number;
};
