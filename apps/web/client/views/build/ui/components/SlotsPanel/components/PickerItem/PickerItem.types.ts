import type { BuildItem } from '../../../../../lib/build-catalog';

export type PickerItemProps = {
  item: BuildItem;
  isSelected: boolean;
  isTaken: boolean;
  onPick: (id: number) => void;
};
