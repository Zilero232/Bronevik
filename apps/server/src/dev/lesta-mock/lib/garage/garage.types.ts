import type { MockVehicle } from '../../lesta-mock.types';

export type GarageLine = {
  key: string;
  vehicles: MockVehicle[];
  weight: number;
};

export type GaragePools = {
  lines: GarageLine[];
  starters: MockVehicle[];
  premiums: MockVehicle[];
  collectibles: MockVehicle[];
};

export type PlannedTank = {
  vehicle: MockVehicle;
  role: 'grind' | 'keeper' | 'starter';
  availableFromDay: number;
};
