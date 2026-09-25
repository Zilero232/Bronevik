import type { MoeThresholds } from '@bronevik/ratings';

export type ProjectionCurveInput = {
  currentPercent: number;
  averageDamage: number;
  thresholds: MoeThresholds;
  battlesNeeded: number | null;
};

export type MoeCurvePoint = {
  battle: number;
  percent: number;
};
