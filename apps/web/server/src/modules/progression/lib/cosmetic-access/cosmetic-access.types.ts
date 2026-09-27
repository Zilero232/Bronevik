import type { CosmeticItem, EquippedCosmetics } from '@otmetki/schemas';

export type CosmeticUsableInput = {
  item: Pick<CosmeticItem, 'source'>;
  isOwned: boolean;
  isPlus: boolean;
};

export type VisibleCosmeticsInput = {
  equipped: EquippedCosmetics;
  owned: ReadonlySet<string>;
  isPlus: boolean;
};
