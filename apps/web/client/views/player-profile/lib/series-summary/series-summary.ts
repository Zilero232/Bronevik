import { sum } from 'remeda';

import type { SeriesSummary } from './series-summary.types';

export const seriesSummary = (values: number[]): SeriesSummary | null => {
  if (values.length === 0) {
    return null;
  }

  const first = values[0];
  const last = values[values.length - 1];

  return {
    last,
    min: Math.min(...values),
    max: Math.max(...values),
    average: sum(values) / values.length,
    change: last - first
  };
};
