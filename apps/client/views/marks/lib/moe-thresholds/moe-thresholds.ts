import type { MoeThresholds } from '@bronevik/ratings';
import type { MoeThreshold } from '@bronevik/schemas';

import type { ThresholdVerdict } from './moe-thresholds.types';

export const toMoeThresholds = ({ p65, p85, p95, p100 }: MoeThreshold): MoeThresholds => ({
  oneMark: p65,
  twoMarks: p85,
  threeMarks: p95,
  hundredPercent: p100 ?? undefined
});

export const thresholdVerdict = (delta: number | null): ThresholdVerdict => {
  if (delta === null || delta === 0) {
    return 'same';
  }

  return delta < 0 ? 'better' : 'worse';
};
