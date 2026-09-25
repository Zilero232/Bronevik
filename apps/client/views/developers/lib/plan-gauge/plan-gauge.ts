import { clamp } from 'remeda';

import type { PlanGaugeInput } from './plan-gauge.types';

export const planGauge = ({ value, max }: PlanGaugeInput): number => {
  if (max <= 1 || value <= 1) {
    return 0;
  }

  return clamp(Math.log10(value) / Math.log10(max), { min: 0, max: 1 });
};
