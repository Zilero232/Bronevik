import type { TankTiers } from '../eff';
import type { ExpectedValuesTable } from '../expected-values';
import type { BattleAverages, BattleTotals, TankTotals } from '../stats';
import type { RECENT_PERIODS } from './period.constants';

export type DiffTotalsInput<T extends BattleTotals> = {
  from: T;
  to: T;
};

export type DiffTankTotalsInput = {
  from: readonly TankTotals[];
  to: readonly TankTotals[];
};

export type PeriodRatingsInput = {
  from: readonly TankTotals[];
  to: readonly TankTotals[];
  expected: ExpectedValuesTable;
  tiers: TankTiers;
};

export type PeriodRatings = {
  tanks: TankTotals[];
  totals: BattleTotals;
  averages: BattleAverages;
  wn8: number | null;
  eff: number | null;
  averageTier: number | null;
};

export type SnapshotLike = {
  takenAt: Date;
  battles: number;
};

export type RecentPeriod = (typeof RECENT_PERIODS)[number];

export type PeriodWindow = { kind: 'battles'; count: number } | { kind: 'duration'; days: number };

export type PickSnapshotPairInput<S extends SnapshotLike> = {
  snapshots: readonly S[];
  window: PeriodWindow;
  now?: Date;
};

export type SnapshotPair<S extends SnapshotLike> = {
  from: S;
  to: S;
  isPartial: boolean;
};
