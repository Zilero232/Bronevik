import type { ComparePreset } from '../../../config';

export type PresetCardProps = {
  preset: ComparePreset;
  isPending: boolean;
  isDisabled: boolean;
  onApply: () => void;
};
