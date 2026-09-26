import type { CosmeticInventoryItem, EquippedCosmetics } from '@otmetki/schemas';

export type CosmeticAction = 'buy' | 'equip' | 'owned' | 'plus' | 'short' | 'unequip';

export type CosmeticActionInput = {
  item: Pick<CosmeticInventoryItem, 'code' | 'isUsable' | 'price' | 'slot' | 'source'>;
  equipped: EquippedCosmetics;
  isPlus: boolean;
  balance: number;
};

export type LockedActionInput = Omit<CosmeticActionInput, 'equipped'>;
