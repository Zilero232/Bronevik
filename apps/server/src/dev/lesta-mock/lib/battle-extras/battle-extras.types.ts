import type { BattleResultEvent } from '../../../../modules/mod';
import type { MockBattle, MockVehicle } from '../../lesta-mock.types';
import type { MockRng } from '../random';

export type MockShot = NonNullable<BattleResultEvent['shots']>[number];

export type BattleExtrasInput = {
  battle: MockBattle;
  vehicle: MockVehicle;
  rng: MockRng;
};

export type ArenaWeightInput = {
  seed: number;
  index: number;
  tier: number;
};
