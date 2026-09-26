import type { CompareRow, CompareRowsInput, DisplayValueInput } from './compare-rows.types';

import { COMPARE_METRICS } from '../../config';
import { bestIndices } from '../compare-math';

export const compareRows = ({ sources }: CompareRowsInput): CompareRow[] =>
  COMPARE_METRICS.map(({ key, format, direction, pick }) => {
    const values = sources.map((source) => pick(source));

    return { key, format, values, best: bestIndices({ values, direction }) };
  });

export const displayValue = ({ value, format }: DisplayValueInput): number => (format === 'percent' ? value / 100 : value);
