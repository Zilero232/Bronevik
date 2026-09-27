import type { ExpectedValuesTable, TankReference } from '@otmetki/ratings';
import type { TimeSeriesMetric } from '@otmetki/schemas';

export type BucketTankRow = {
  bucket: Date;
  tank_id: number;
  battles: number;
  wins: number;
  damage: number;
  frags: number;
  spotted: number;
  def: number;
  cap: number;
};

export type SeriesPointsInput = {
  rows: readonly BucketTankRow[];
  metric: TimeSeriesMetric;
  expected: ExpectedValuesTable;
  tiers: ReadonlyMap<number, number>;
  references: ReadonlyMap<number, TankReference>;
};
