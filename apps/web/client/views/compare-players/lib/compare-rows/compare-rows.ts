import { ratingTone } from '@/shared/lib';

import type { CompareMetric } from '../../model/compare.types';
import type { CompareRow, CompareRowsInput, DisplayValueInput } from './compare-rows.types';

import { COMPARE_METRICS } from '../../config';
import { bestIndices, deltasToBest } from '../compare-math';

export const compareRows = ({ sources }: CompareRowsInput): CompareRow[] =>
  COMPARE_METRICS.map(({ key, format, direction, scale, pick }: CompareMetric) => {
    const values = sources.map((source) => pick(source));
    const best = bestIndices({ values, direction });

    return {
      key,
      format,
      values,
      best,
      deltas: deltasToBest({ values, best }),
      tones: values.map((value) => (value === null || scale === undefined ? null : ratingTone({ scale, value }))),
      isLowerBetter: direction === 'lower'
    };
  });

export const displayValue = ({ value, format }: DisplayValueInput): number => (format === 'percent' ? value / 100 : value);
