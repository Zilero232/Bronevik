import type { MockCatalog, MockPlayer, MockVehicle, MockWorld } from '../../lesta-mock.types';
import type { MockRng } from '../random';

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

export type SampleInput<T> = {
  rng: MockRng;
  items: readonly T[];
  count: number;
  weight: (item: T) => number;
};

export type PlanInput = {
  rng: MockRng;
  player: MockPlayer;
  catalog: MockCatalog;
  anchorDay: number;
};

export type OtherShareOfInput = {
  rng: MockRng;
  player: MockPlayer;
  world: MockWorld;
};

export type BuildGarageInput = {
  world: MockWorld;
  player: MockPlayer;
};
