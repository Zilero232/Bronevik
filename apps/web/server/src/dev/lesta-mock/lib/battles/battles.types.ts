import type { ModBattleLoadout } from '@otmetki/schemas';

import type { MockBattle, MockPlayer, MockProvision, MockVehicle, MockWorld } from '../../lesta-mock.types';
import type { MockRng } from '../random';

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

export type FitsInput = {
  provision: MockProvision;
  vehicle: MockVehicle;
};

export type VariantScoreInput = {
  tag: string;
  skilled: boolean;
};

export type PickDevicesInput = {
  rng: MockRng;
  devices: readonly MockProvision[];
  vehicle: MockVehicle;
  skilled: boolean;
};

export type ByTagInput = {
  provisions: readonly MockProvision[];
  tag: string;
};

export type PickConsumablesInput = {
  rng: MockRng;
  equipment: readonly MockProvision[];
  skilled: boolean;
};

export type CrewOfInput = {
  world: LoadoutInput['world'];
  vehicle: MockVehicle;
  skills: number;
};

export type ShellCostInput = {
  vehicle: MockVehicle;
  loadout: ModBattleLoadout;
  shots: number;
};
