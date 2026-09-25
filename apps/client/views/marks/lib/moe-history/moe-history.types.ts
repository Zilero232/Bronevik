import type { MoeHistoryPoint } from '@bronevik/schemas';

export type MoeHistorySeries = {
  dates: string[];
  p65: number[];
  p85: number[];
  p95: number[];
  p100: number[];
};

export type SparkPointsInput = {
  history: readonly Pick<MoeHistoryPoint, 'p95'>[];
  count: number;
};

export type SparkDirection = 'down' | 'flat' | 'up';
