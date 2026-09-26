import type { MoeThresholdValues } from '@otmetki/schemas';

export type NextMarkInput = {
  percent: number | null;
  marksOnGun: number | null;
  thresholds: MoeThresholdValues | null;
  movingDamage: number | null;
};

export type NextMark = {
  percent: number | null;
  damage: number | null;
};

export type ThresholdForInput = {
  thresholds: MoeThresholdValues;
  percent: number;
};

export type CombinedSourceInput = {
  fromBattles: number | undefined;
  fromRating: number | undefined;
};
