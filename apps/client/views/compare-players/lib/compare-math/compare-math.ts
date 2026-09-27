import { unique } from 'remeda';

import type { BestIndicesInput, DeltasToBestInput } from './compare-math.types';

import { COMPARE_LIMIT } from '../../config';

export const bestIndices = ({ values, direction }: BestIndicesInput): number[] => {
  const known = values.filter((value): value is number => value !== null);

  if (direction === 'none' || known.length < COMPARE_LIMIT.min) {
    return [];
  }

  const target = direction === 'higher' ? Math.max(...known) : Math.min(...known);

  return values.flatMap((value, index) => (value === target ? [index] : []));
};

export const deltasToBest = ({ values, best }: DeltasToBestInput): (number | null)[] => {
  const target = best.length > 0 ? values[best[0]] : null;

  return values.map((value, index) => (value === null || target === null || target === undefined || best.includes(index) ? null : value - target));
};

export const compareIds = (ids: readonly number[]): number[] => unique(ids.filter((id) => id > 0)).slice(0, COMPARE_LIMIT.max);
