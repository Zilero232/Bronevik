import { clamp } from 'remeda';

import type { WilsonInterval, WilsonIntervalInput } from './wilson.types';

import { WILSON } from './wilson.constants';

export const wilsonInterval = ({ rate, trials, z = WILSON.z }: WilsonIntervalInput): WilsonInterval => {
  if (trials <= 0) {
    return { lower: 0, upper: WILSON.percent };
  }

  const share = clamp(rate / WILSON.percent, { min: 0, max: 1 });
  const zSquared = z * z;
  const denominator = 1 + zSquared / trials;
  const center = share + zSquared / (2 * trials);
  const margin = z * Math.sqrt((share * (1 - share)) / trials + zSquared / (4 * trials * trials));

  return {
    lower: clamp((center - margin) / denominator, { min: 0, max: 1 }) * WILSON.percent,
    upper: clamp((center + margin) / denominator, { min: 0, max: 1 }) * WILSON.percent
  };
};
