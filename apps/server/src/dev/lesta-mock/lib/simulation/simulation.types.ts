import type {
  MockBattle,
  MockBattleMode,
  MockGarage,
  MockGarageTank,
  MockPlayer,
  MockPlayerState,
  MockVehicle,
  MockWorld
} from '../../lesta-mock.types';
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

export type ClampInput = {
  value: number;
  min: number;
  max: number;
};

export type SurvivalChanceInput = {
  vehicle: MockVehicle;
  perf: number;
  won: boolean;
};

export type AccuracyInput = {
  vehicle: MockVehicle;
  perf: number;
};

export type MoeThresholdDamageInput = {
  vehicle: MockVehicle;
  percent: number;
};

export type OddsForInput = {
  player: MockPlayer;
  vehicle: MockVehicle;
  affinity: number;
  battlesOnTank: number;
  at: number;
};

export type BaseOddsForInput = {
  player: MockPlayer;
  vehicle: MockVehicle;
  affinity: number;
  battles: number;
};

export type ScaledInput = {
  rng: AggregateInput['rng'];
  count: number;
  mean: number;
  cv: number;
};

export type OutcomeInput = {
  win: number;
  loss: number;
};

export type PercentileOfInput = {
  sorted: readonly number[];
  percentile: number;
};

export type PopulationSampleInput = {
  seed: number;
  vehicle: MockVehicle;
};

export type MasteryThresholdsInput = {
  seed: number;
  vehicle: MockVehicle;
};

export type MasteryLevelInput = {
  thresholds: MasteryThresholds;
  maxXp: number;
};

export type FocusOfInput = {
  input: DayPlanInput;
  available: readonly MockGarageTank[];
};

export type BaseTankStateInput = {
  world: MockWorld;
  player: MockPlayer;
  tank: MockGarageTank;
};

export type BaseStateInput = {
  world: MockWorld;
  player: MockPlayer;
};

export type CheckpointForInput = {
  world: MockWorld;
  player: MockPlayer;
  day: number;
};

export type PlayerStateAtInput = {
  world: MockWorld;
  player: MockPlayer;
  at: number;
};
