import { isNumber } from 'remeda';

import type { SpecBestInput, SpecDeltaInput, SpecVerdict } from './spec-rank.types';

import { TANK_SPEC_RANK } from '../../config';
import { specMeta } from '../spec-meta';

export const isLowerBetter = (key: string): boolean => specMeta(key)?.lowerIsBetter === true;

export const specBest = ({ key, values }: SpecBestInput): number | null => {
  const numbers = values.filter(isNumber);

  if (numbers.length < 2 || new Set(numbers).size < 2) {
    return null;
  }

  return isLowerBetter(key) ? Math.min(...numbers) : Math.max(...numbers);
};

export const specDelta = ({ key, before, after }: SpecDeltaInput): SpecVerdict => {
  if (!isNumber(before) || !isNumber(after) || Math.abs(after - before) < TANK_SPEC_RANK.epsilon) {
    return 'same';
  }

  const isHigher = after > before;

  return isHigher !== isLowerBetter(key) ? 'better' : 'worse';
};
