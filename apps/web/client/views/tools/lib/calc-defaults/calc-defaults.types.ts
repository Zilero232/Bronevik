import type { ShellKind, TargetMetric } from '../../config';

export type ShellPriceValues = Record<`${ShellKind}Price`, number>;

export type TargetValues = {
  metric: TargetMetric;
  battles: number | null;
  current: number | null;
  expected: number | null;
  target: number | null;
};
