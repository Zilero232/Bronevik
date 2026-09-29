export type TierSelectionMode = 'multiple' | 'single';

export type TierRun = 'end' | 'middle' | 'single' | 'start';

export type TierRunsInput = {
  options: readonly number[];
  value: readonly number[];
};

export type NextTierSelectionInput = {
  options: readonly number[];
  value: readonly number[];
  tier: number;
  anchor: number | null;
  isRange: boolean;
  mode: TierSelectionMode;
  isRequired: boolean;
};

export type TierSummaryInput = {
  options: readonly number[];
  value: readonly number[];
};

export type TierSpan = {
  from: number;
  to: number;
};

export type SpanBetweenInput = {
  options: readonly number[];
  from: number;
  to: number;
};
