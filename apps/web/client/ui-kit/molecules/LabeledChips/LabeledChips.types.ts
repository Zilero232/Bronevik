import type { ToggleChipsProps } from '../ToggleChips';

export type LabeledChipsProps<T extends string = string> = Omit<ToggleChipsProps<T>, 'aria-label' | 'className'> & {
  label: string;
};
