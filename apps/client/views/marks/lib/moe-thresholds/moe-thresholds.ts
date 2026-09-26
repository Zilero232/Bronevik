import type { ThresholdVerdict } from './moe-thresholds.types';

export const thresholdVerdict = (delta: number | null): ThresholdVerdict => {
  if (delta === null || delta === 0) {
    return 'same';
  }

  return delta < 0 ? 'better' : 'worse';
};
