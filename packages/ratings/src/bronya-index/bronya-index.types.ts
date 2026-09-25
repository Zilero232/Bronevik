import type { TankTotals } from '../stats';
import type { BRONYA_COMPONENTS } from './bronya-index.constants';

export type BronyaComponent = (typeof BRONYA_COMPONENTS)[number];

export type TankReference = {
  tankId: number;
  quantiles: Record<BronyaComponent, readonly number[]>;
};

export type TankReferenceTable = ReadonlyMap<number, TankReference>;

export type PercentileInput = {
  value: number;
  quantiles: readonly number[];
  levels?: readonly number[];
};

export type TankBronyaScoreInput = {
  totals: TankTotals;
  reference: TankReference;
  priorBattles?: number;
};

export type TankBronyaScore = {
  tankId: number;
  battles: number;
  percentiles: Record<BronyaComponent, number>;
  rawScore: number;
  shrunkScore: number;
};

export type BronyaIndexInput = {
  tanks: readonly TankTotals[];
  references: TankReferenceTable;
  priorBattles?: number;
};

export type BronyaIndexResult = {
  index: number | null;
  confidence: number;
  battles: number;
  tanks: TankBronyaScore[];
  tanksWithoutReference: number[];
};
