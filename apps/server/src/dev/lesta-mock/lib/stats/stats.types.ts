import type { MockBattle, MockTotals } from '../../lesta-mock.types';

export type AddBattleInput = {
  totals: MockTotals;
  battle: MockBattle;
};

export type MergeTotalsInput = {
  target: MockTotals;
  source: MockTotals;
};

export type AverageInput = {
  value: number;
  battles: number;
  digits?: number;
};
