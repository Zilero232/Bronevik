import { isNumber } from 'remeda';

import type { SpecBestInput, SpecDeltaInput, SpecVerdict } from './spec-rank.types';

import { TANK_SPECS } from '../../config';

const EPSILON = 1e-9;

const LOWER_IS_BETTER = new Set(
  Object.entries(TANK_SPECS)
    .filter(([, meta]) => 'lowerIsBetter' in meta && meta.lowerIsBetter)
    .map(([key]) => key)
);

export const isLowerBetter = (key: string): boolean => LOWER_IS_BETTER.has(key);

export const specBest = ({ key, values }: SpecBestInput): number | null => {
  const numbers = values.filter(isNumber);

  if (numbers.length < 2 || new Set(numbers).size < 2) {
    return null;
  }

  return isLowerBetter(key) ? Math.min(...numbers) : Math.max(...numbers);
};

export const specDelta = ({ key, before, after }: SpecDeltaInput): SpecVerdict => {
  if (!isNumber(before) || !isNumber(after) || Math.abs(after - before) < EPSILON) {
    return 'same';
  }

  const isHigher = after > before;

  return isHigher !== isLowerBetter(key) ? 'better' : 'worse';
};
