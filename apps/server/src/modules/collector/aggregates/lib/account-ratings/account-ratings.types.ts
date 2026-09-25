import type { ExpectedValuesTable, PeriodWindow, TankReferenceTable, TankTiers } from '@bronevik/ratings';

import type { Prisma, RatingPeriod } from '../../../../../../generated';

export type TankSnapshotTotals = {
  tankId: number;
  capturedAt: Date;
  battles: number;
  wins: number;
  losses: number;
  damageDealt: number;
  damageReceived: number;
  frags: number;
  spotted: number;
  xp: number;
  survived: number;
  hits: number;
  shots: number;
  capturePoints: number;
  droppedCapturePoints: number;
};

type AccountSnapshotPoint = {
  capturedAt: Date;
  battles: number;
};

export type PeriodCutoffInput = {
  window: PeriodWindow;
  accountSnapshots: readonly AccountSnapshotPoint[];
  now: Date;
};

export type PeriodCutoff = {
  cutoff: Date;
  isPartial: boolean;
};

export type TankPeriodTotalsInput = {
  tankSnapshots: readonly TankSnapshotTotals[];
  cutoff: Date | null;
};

export type BuildAccountRatingsInput = {
  accountId: bigint;
  accountSnapshots: readonly AccountSnapshotPoint[];
  tankSnapshots: readonly TankSnapshotTotals[];
  expected: ExpectedValuesTable;
  tiers: TankTiers;
  references: TankReferenceTable;
  now: Date;
};

export type AccountRatingsResult = {
  ratings: Prisma.AccountRatingCreateManyInput[];
  tankRatings: Prisma.AccountTankRatingCreateManyInput[];
};

export type PeriodRowsInput = {
  input: BuildAccountRatingsInput;
  period: RatingPeriod;
  cutoff: Date | null;
};
