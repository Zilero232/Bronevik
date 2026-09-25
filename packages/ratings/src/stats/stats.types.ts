export type BattleTotals = {
  battles: number;
  wins: number;
  damageDealt: number;
  frags: number;
  spotted: number;
  capturePoints: number;
  droppedCapturePoints: number;
  losses?: number;
  xp?: number;
  survivedBattles?: number;
  damageReceived?: number;
  hits?: number;
  shots?: number;
};

export type TankTotals = BattleTotals & {
  tankId: number;
};

export type BattleAverages = {
  battles: number;
  winRate: number;
  damage: number;
  frags: number;
  spotted: number;
  capture: number;
  defence: number;
  xp: number | null;
  survivalRate: number | null;
  hitRate: number | null;
  damageRatio: number | null;
};

export type SafeDivideInput = {
  value: number;
  by: number;
};

export type WinRateInput = {
  wins: number;
  battles: number;
};

export type OptionalDivideInput = {
  value: number | undefined;
  by: number | undefined;
};
