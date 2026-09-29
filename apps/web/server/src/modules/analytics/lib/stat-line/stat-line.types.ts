import type { ExpectedValuesTable, TankTotals } from '@otmetki/ratings';
import type { VehicleSummary } from '@otmetki/schemas';

export type AggregateRow = TankTotals & {
  survivedBattles: number;
};

export type StatLineInput = {
  rows: readonly AggregateRow[];
  expected: ExpectedValuesTable;
};

export type BreakdownVehicle = Pick<VehicleSummary, 'nation' | 'tier' | 'type'>;

export type BreakdownInput = StatLineInput & {
  vehicles: ReadonlyMap<number, BreakdownVehicle>;
};

export type GroupRowsInput = BreakdownInput & {
  keyOf: (vehicle: BreakdownVehicle) => string;
};

export type RawTankRow = {
  tank_id: number;
  battles: number;
  wins: number;
  damage: number;
  frags: number;
  spotted: number;
  cap: number;
  def: number;
  survived: number;
};

type BucketedRow = AggregateRow & {
  bucket: Date;
};

export type TrendPointsInput = {
  rows: readonly BucketedRow[];
  expected: StatLineInput['expected'];
};
