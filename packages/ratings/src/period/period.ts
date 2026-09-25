import { subDays } from 'date-fns';
import { findLast, sortBy } from 'remeda';

import type { BattleTotals, TankTotals } from '../stats';
import type {
  DiffTankTotalsInput,
  DiffTotalsInput,
  PeriodRatings,
  PeriodRatingsInput,
  PickSnapshotPairInput,
  SnapshotLike,
  SnapshotPair
} from './period.types';

import { averageTier, eff } from '../eff';
import { computeAverages, sumTotals } from '../stats';
import { accountWn8 } from '../wn8';
import { EMPTY_TOTALS, OPTIONAL_TOTAL_KEYS } from './period.constants';

export const diffTotals = <T extends BattleTotals>({ from, to }: DiffTotalsInput<T>): BattleTotals | null => {
  if (to.battles < from.battles) {
    return null;
  }

  const delta: BattleTotals = {
    battles: to.battles - from.battles,
    wins: to.wins - from.wins,
    damageDealt: to.damageDealt - from.damageDealt,
    frags: to.frags - from.frags,
    spotted: to.spotted - from.spotted,
    capturePoints: to.capturePoints - from.capturePoints,
    droppedCapturePoints: to.droppedCapturePoints - from.droppedCapturePoints
  };

  for (const key of OPTIONAL_TOTAL_KEYS) {
    const end = to[key];
    const start = from[key];

    if (end !== undefined && start !== undefined) {
      delta[key] = end - start;
    }
  }

  return delta;
};

export const diffTankTotals = ({ from, to }: DiffTankTotalsInput): TankTotals[] => {
  const previous = new Map(from.map((tank) => [tank.tankId, tank]));
  const changed: TankTotals[] = [];

  for (const current of to) {
    const before = previous.get(current.tankId) ?? { ...EMPTY_TOTALS, tankId: current.tankId };
    const delta = diffTotals({ from: before, to: current });

    if (delta && delta.battles > 0) {
      changed.push({ ...delta, tankId: current.tankId });
    }
  }

  return changed;
};

export const periodRatings = ({ from, to, expected, tiers }: PeriodRatingsInput): PeriodRatings => {
  const tanks = diffTankTotals({ from, to });
  const totals = sumTotals(tanks);
  const tier = averageTier({ tanks, tiers });

  return {
    tanks,
    totals,
    averages: computeAverages(totals),
    wn8: accountWn8({ tanks, expected }).wn8,
    eff: tier === null ? null : eff({ totals, averageTier: tier }),
    averageTier: tier
  };
};

export const pickSnapshotPair = <S extends SnapshotLike>({
  snapshots,
  window,
  now = new Date()
}: PickSnapshotPairInput<S>): SnapshotPair<S> | null => {
  const ordered = sortBy([...snapshots], (snapshot) => snapshot.takenAt.getTime());
  const to = ordered.at(-1);
  const earliest = ordered.at(0);

  if (!to || !earliest) {
    return null;
  }

  const isBefore =
    window.kind === 'duration'
      ? (snapshot: S) => snapshot.takenAt.getTime() <= subDays(now, window.days).getTime()
      : (snapshot: S) => snapshot.battles <= to.battles - window.count;

  const from = findLast(ordered, isBefore);

  if (from) {
    return from === to ? null : { from, to, isPartial: false };
  }

  return earliest === to ? null : { from: earliest, to, isPartial: true };
};
