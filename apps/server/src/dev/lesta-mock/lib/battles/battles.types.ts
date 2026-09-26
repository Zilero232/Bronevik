import type { MockBattle, MockPlayer, MockVehicle, MockWorld } from '../../lesta-mock.types';

export type LoadoutInput = {
  world: MockWorld;
  player: MockPlayer;
  vehicle: MockVehicle;
};

export type BattleEventInput = {
  world: MockWorld;
  player: MockPlayer;
  battle: MockBattle;
  platoonMates: readonly number[];
};
