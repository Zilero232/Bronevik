import type { MockBattle, MockBattleMode, MockGarage, MockPlayer, MockPlayerState, MockVehicle, MockWorld } from '../../lesta-mock.types';
import type { MockRng } from '../random';

export type BattleOdds = {
  perf: number;
  winChance: number;
};

export type SimulateBattleInput = BattleOdds & {
  rng: MockRng;
  vehicle: MockVehicle;
  endedAt: number;
  durationSec: number;
  mode: MockBattleMode;
  premiumAccount: boolean;
};

export type SimulatedBattle = Omit<MockBattle, 'marksOnGun' | 'moeEma' | 'moePercent'>;

export type AggregateInput = BattleOdds & {
  rng: MockRng;
  vehicle: MockVehicle;
  battles: number;
};

export type PlannedBattle = {
  endedAt: number;
  durationSec: number;
  tankId: number;
  mode: MockBattleMode;
  sequence: number;
  day: number;
};

export type DayPlanInput = {
  world: MockWorld;
  player: MockPlayer;
  garage: MockGarage;
  day: number;
};

export type AdvanceInput = {
  world: MockWorld;
  player: MockPlayer;
  garage: MockGarage;
  state: MockPlayerState;
  fromDay: number;
  toDay: number;
  after: number;
  until: number;
  onBattle?: (battle: MockBattle) => void;
};

export type BattlesBetweenInput = {
  world: MockWorld;
  player: MockPlayer;
  from: number;
  to: number;
};

export type MoePercentInput = {
  vehicle: MockVehicle;
  ema: number;
};

export type PopulationSample = {
  xp: number[];
  damage: number[];
  frags: number[];
};

export type MasteryThresholds = {
  third: number;
  second: number;
  first: number;
  ace: number;
};
