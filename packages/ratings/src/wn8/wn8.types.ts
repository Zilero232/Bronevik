import type { ExpectedValues, ExpectedValuesTable } from '../expected-values';
import type { TankTotals } from '../stats';

export type Wn8Ratios = {
  rDamage: number;
  rSpot: number;
  rFrag: number;
  rDef: number;
  rWin: number;
};

export type Wn8Breakdown = Wn8Ratios & {
  rDamageC: number;
  rSpotC: number;
  rFragC: number;
  rDefC: number;
  rWinC: number;
  wn8: number;
};

export type TankWn8Input = {
  totals: TankTotals;
  expected: ExpectedValues;
};

export type AccountWn8Input = {
  tanks: readonly TankTotals[];
  expected: ExpectedValuesTable;
};

export type AccountWn8Result = {
  wn8: number | null;
  battles: number;
  battlesWithoutExpected: number;
  tanksWithoutExpected: number[];
};

export type Wn8NormalizeInput = {
  ratio: number;
  floor: number;
};
