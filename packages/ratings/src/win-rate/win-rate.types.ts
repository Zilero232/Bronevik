export type WinRateDiffRow = {
  battles: number;
  wins: number;
  playerWinRate: number;
};

export type WinRateDiffAggregate = {
  battles: number;
  wins: number;
  playerWinRateBattles: number;
};

export type WinRateDiff = {
  battles: number;
  tankWinRate: number;
  expectedWinRate: number;
  diff: number;
};
