import type { TrayChipData } from '../../../lib/tray-chips';

export type TrayChipProps = {
  chip: TrayChipData;
  isOver: boolean;
  removeLabel: string;
  onRemove: (id: number) => void;
  onNavigate: () => void;
};
