import type { ExpectedValuesTable, TankTotals } from '@otmetki/ratings';

import type { GoalMetric, GoalStatus } from '../../../../../generated';

export type WindowTotalsInput = {
  mod: readonly TankTotals[];
  api: readonly TankTotals[];
};

export type GoalCurrentInput = {
  metric: GoalMetric;
  tanks: readonly TankTotals[];
  expected: ExpectedValuesTable;
  level: number | null;
};

export type GoalOutcomeInput = {
  metric: GoalMetric;
  current: number | null;
  target: number;
  hasEnded: boolean;
};

export type GoalOutcome = Extract<GoalStatus, 'achieved' | 'failed'> | null;
