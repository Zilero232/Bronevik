import type { TargetMetric } from '../../../config';

export type TargetValues = {
  metric: TargetMetric;
  battles: number | null;
  current: number | null;
  expected: number | null;
  target: number | null;
};

export type TargetResultsProps = {
  values: TargetValues;
};
