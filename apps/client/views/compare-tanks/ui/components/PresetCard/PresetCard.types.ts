import type { ComparePreset } from '../../../model/compare-presets.types';

export type PresetCardProps = {
  preset: ComparePreset;
  isPending: boolean;
  isDisabled: boolean;
  onApply: () => void;
};
