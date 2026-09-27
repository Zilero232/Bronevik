import type { Vehicle } from '../../../../../lib/lesta';

export type SpecChange = {
  from: number | null;
  to: number | null;
};

export type SpecDiffInput = {
  previous: unknown;
  next: unknown;
};

export type VehicleSlugsInput = {
  vehicles: readonly Pick<Vehicle, 'tag' | 'tank_id'>[];
};
