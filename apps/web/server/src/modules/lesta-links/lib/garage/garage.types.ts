import type { TankGarage } from '../../../../lib/lesta';

export type GarageRow = Pick<TankGarage, 'in_garage' | 'tank_id'>;

export type GarageSplit = {
  inGarage: number[];
  sold: number[];
};
