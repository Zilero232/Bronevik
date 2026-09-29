import { sumBy } from 'remeda';

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

export const aggregateWinRateDiff = (rows: readonly WinRateDiffRow[]): WinRateDiffAggregate => ({
  battles: sumBy(rows, (row) => row.battles),
  wins: sumBy(rows, (row) => row.wins),
  playerWinRateBattles: sumBy(rows, (row) => row.battles * row.playerWinRate)
});

export const winRateDiff = (rows: readonly WinRateDiffRow[]): WinRateDiff | null => winRateDiffFromAggregate(aggregateWinRateDiff(rows));
