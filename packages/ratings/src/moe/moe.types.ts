export type MoeCombinedDamageInput = {
  damage: number;
  spottingAssist: number;
  trackingAssist: number;
  stunAssist?: number;
};

export type MoeThresholds = {
  oneMark: number;
  twoMarks: number;
  threeMarks: number;
  hundredPercent?: number;
};

export type MoeThresholdPercentiles = {
  p65: number;
  p85: number;
  p95: number;
  p100?: number | null;
};

export type MoeDamageForPercentInput = {
  percent: number;
  thresholds: MoeThresholds;
};

export type MoePercentForDamageInput = {
  damage: number;
  thresholds: MoeThresholds;
};

export type NextMoeEmaInput = {
  ema: number;
  combinedDamage: number;
  emaBattles?: number;
};

export type ProjectMoeBattlesInput = {
  currentPercent: number;
  targetPercent: number;
  averageCombinedDamage: number;
  thresholds: MoeThresholds;
  emaBattles?: number;
};

export type MoeProjection = {
  battles: number | null;
  currentEma: number;
  targetEma: number;
};

export type SimulateMoeInput = {
  startPercent: number;
  combinedDamages: readonly number[];
  thresholds: MoeThresholds;
  emaBattles?: number;
};
