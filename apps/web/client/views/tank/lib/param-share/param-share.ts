import { clamp, isNumber } from 'remeda';

import { isLowerBetter } from '@/entities/tank/tank';

import type { ParamSharesInput } from './param-share.types';

export const paramShares = ({ key, values }: ParamSharesInput): (number | null)[] => {
  const numbers = values.filter(isNumber).filter((value) => value > 0);

  if (numbers.length < 2) {
    return values.map(() => null);
  }

  const isLower = isLowerBetter(key);
  const reference = isLower ? Math.min(...numbers) : Math.max(...numbers);

  return values.map((value) => {
    if (!isNumber(value) || value <= 0) {
      return null;
    }

    return clamp(isLower ? reference / value : value / reference, { min: 0, max: 1 });
  });
};
