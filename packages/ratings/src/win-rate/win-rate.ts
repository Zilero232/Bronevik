import type { WinRateDiff, WinRateDiffAggregate, WinRateDiffRow } from './win-rate.types';

import { safeDivide } from '../stats';

export const winRateDiffFromAggregate = ({ battles, wins, playerWinRateBattles }: WinRateDiffAggregate): WinRateDiff | null => {
  if (battles === 0) {
    return null;
  }

  const tankWinRate = safeDivide({ value: wins * 100, by: battles });
  const expectedWinRate = safeDivide({ value: playerWinRateBattles, by: battles });

  return { battles, tankWinRate, expectedWinRate, diff: tankWinRate - expectedWinRate };
};

export const aggregateWinRateDiff = (rows: readonly WinRateDiffRow[]): WinRateDiffAggregate =>
  rows.reduce(
    (aggregate, row) => ({
      battles: aggregate.battles + row.battles,
      wins: aggregate.wins + row.wins,
      playerWinRateBattles: aggregate.playerWinRateBattles + row.battles * row.playerWinRate
    }),
    { battles: 0, wins: 0, playerWinRateBattles: 0 }
  );

export const winRateDiff = (rows: readonly WinRateDiffRow[]): WinRateDiff | null => winRateDiffFromAggregate(aggregateWinRateDiff(rows));
