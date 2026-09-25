type MarkThresholds = {
  p65: number;
  p85: number;
  p95: number;
  p100: number | null;
};

export type NextMarkInput = {
  percent: number | null;
  marksOnGun: number | null;
  thresholds: MarkThresholds | null;
  movingDamage: number | null;
};

export type NextMark = {
  percent: number | null;
  damage: number | null;
};

export type ThresholdForInput = {
  thresholds: MarkThresholds;
  percent: number;
};

export type CombinedSourceInput = {
  fromBattles: number | undefined;
  fromRating: number | undefined;
};
