import type { MoeThresholdValues } from '@otmetki/schemas';

export type ProjectMarksInput = {
  thresholds: MoeThresholdValues;
  currentPercent: number | null;
  targetMarks: number;
  avgDamage: number;
};
