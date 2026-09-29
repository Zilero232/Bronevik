import type { TierSelectionMode } from '../tier-selection';

export type UseTierPickerInput = {
  options: readonly number[];
  value: readonly number[];
  mode: TierSelectionMode;
  isRequired: boolean;
  onChange: (value: number[]) => void;
};

export type TierPickInput = {
  tier: number;
  isRange: boolean;
};
