import type { TierSelectionMode } from '@/shared/lib';

export type TierPickerProps = {
  value: readonly number[];
  options?: readonly number[];
  mode?: TierSelectionMode;
  isRequired?: boolean;
  size?: 'md' | 'sm';
  className?: string;
  'aria-label': string;
  onChange: (value: number[]) => void;
};
