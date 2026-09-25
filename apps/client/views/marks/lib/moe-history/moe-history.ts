import type { MoeHistory } from '@bronevik/schemas';

import type { MoeHistorySeries, SparkDirection, SparkPointsInput } from './moe-history.types';

export const historySeries = (history: MoeHistory): MoeHistorySeries => ({
  dates: history.map(({ date }) => date),
  p65: history.map(({ p65 }) => p65),
  p85: history.map(({ p85 }) => p85),
  p95: history.map(({ p95 }) => p95),
  p100: history.flatMap(({ p100 }) => (p100 === null ? [] : [p100]))
});

export const sparkPoints = ({ history, count }: SparkPointsInput): number[] => history.slice(-count).map(({ p95 }) => p95);

export const sparkDirection = (points: number[]): SparkDirection => {
  const first = points.at(0) ?? 0;
  const last = points.at(-1) ?? 0;

  if (last > first) {
    return 'up';
  }

  return last < first ? 'down' : 'flat';
};
