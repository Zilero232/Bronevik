import type { MockPlayer, MockWorld } from '../../lesta-mock.types';

export type SeedSelectionInput = {
  world: MockWorld;
  count: number;
  modPlayers: number;
};

export type SeedSelection = {
  accounts: MockPlayer[];
  active: MockPlayer[];
  mod: MockPlayer[];
};

export type SeedStepsInput = {
  now: number;
  days: number;
};

export type ClansOfInput = {
  world: MockWorld;
  accounts: readonly MockPlayer[];
  at: number;
};
