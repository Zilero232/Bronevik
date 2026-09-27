import type { CosmeticInventoryItem } from '@otmetki/schemas';

import type { CosmeticAction } from '../../../lib/cosmetic-action';
import type { EquipSlotInput } from '../../../model/hooks';

export type CosmeticTileProps = {
  item: CosmeticInventoryItem;
  action: CosmeticAction;
  isBusy: boolean;
  onBuy: (code: string) => void;
  onEquip: (input: EquipSlotInput) => void;
};
