import type { BuildItem } from '../../../../../lib/build-catalog';

export type ItemSlotProps = {
  item: BuildItem | null;
  index: number;
  onOpen: () => void;
  onClear: () => void;
};
