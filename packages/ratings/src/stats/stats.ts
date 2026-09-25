import { sumBy } from 'remeda';

import type { BattleAverages, BattleTotals, OptionalDivideInput, SafeDivideInput, WinRateInput } from './stats.types';

export const safeDivide = ({ value, by }: SafeDivideInput): number => (by === 0 ? 0 : value / by);

const optionalDivide = ({ value, by }: OptionalDivideInput): number | null => {
  if (value === undefined || by === undefined || by === 0) {
    return null;
  }

  return value / by;
};

export const winRate = ({ wins, battles }: WinRateInput): number => safeDivide({ value: wins * 100, by: battles });

export const computeAverages = (totals: BattleTotals): BattleAverages => {
  const { battles } = totals;
  const perBattle = (value: number) => safeDivide({ value, by: battles });
  const survivalShare = optionalDivide({ value: totals.survivedBattles, by: battles });
  const hitShare = optionalDivide({ value: totals.hits, by: totals.shots });

  return {
    battles,
    winRate: winRate(totals),
    damage: perBattle(totals.damageDealt),
    frags: perBattle(totals.frags),
    spotted: perBattle(totals.spotted),
    capture: perBattle(totals.capturePoints),
    defence: perBattle(totals.droppedCapturePoints),
    xp: optionalDivide({ value: totals.xp, by: battles }),
    survivalRate: survivalShare === null ? null : survivalShare * 100,
    hitRate: hitShare === null ? null : hitShare * 100,
    damageRatio: optionalDivide({ value: totals.damageDealt, by: totals.damageReceived })
  };
};

export const sumTotals = (rows: readonly BattleTotals[]): BattleTotals => {
  const sum = (pick: (row: BattleTotals) => number): number => sumBy(rows, pick);

  const sumOptional = (pick: (row: BattleTotals) => number | undefined): number | undefined =>
    rows.every((row) => pick(row) !== undefined) ? sumBy(rows, (row) => pick(row) ?? 0) : undefined;

  return {
    battles: sum((row) => row.battles),
    wins: sum((row) => row.wins),
    damageDealt: sum((row) => row.damageDealt),
    frags: sum((row) => row.frags),
    spotted: sum((row) => row.spotted),
    capturePoints: sum((row) => row.capturePoints),
    droppedCapturePoints: sum((row) => row.droppedCapturePoints),
    losses: sumOptional((row) => row.losses),
    xp: sumOptional((row) => row.xp),
    survivedBattles: sumOptional((row) => row.survivedBattles),
    damageReceived: sumOptional((row) => row.damageReceived),
    hits: sumOptional((row) => row.hits),
    shots: sumOptional((row) => row.shots)
  };
};
