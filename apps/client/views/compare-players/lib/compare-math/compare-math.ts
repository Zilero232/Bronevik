import type { BestIndicesInput } from './compare-math.types';

import { COMPARE_LIMIT } from '../../config';

export const bestIndices = ({ values, direction }: BestIndicesInput): number[] => {
  const known = values.filter((value): value is number => value !== null);

  if (direction === 'none' || known.length < COMPARE_LIMIT.min) {
    return [];
  }

  const target = direction === 'higher' ? Math.max(...known) : Math.min(...known);

  return values.flatMap((value, index) => (value === target ? [index] : []));
};

export const parseCompareIds = (raw: string | null): number[] =>
  [
    ...new Set(
      (raw ?? '')
        .split(',')
        .map((part) => Number(part.trim()))
        .filter((id) => Number.isInteger(id) && id > 0)
    )
  ].slice(0, COMPARE_LIMIT.max);
