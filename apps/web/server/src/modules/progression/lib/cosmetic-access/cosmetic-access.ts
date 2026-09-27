import type { EquippedCosmetics } from '@otmetki/schemas';

import { cosmeticOf, PROFILE_COSMETIC_SLOTS } from '@otmetki/schemas';
import { match } from 'ts-pattern';

import type { CosmeticUsableInput, VisibleCosmeticsInput } from './cosmetic-access.types';

export const isCosmeticUsable = ({ item, isOwned, isPlus }: CosmeticUsableInput): boolean =>
  match(item.source)
    .with('default', () => true)
    .with('plus', () => isPlus)
    .with('shop', 'season', () => isOwned)
    .exhaustive();

export const visibleCosmetics = ({ equipped, owned, isPlus }: VisibleCosmeticsInput): EquippedCosmetics => {
  const visible: EquippedCosmetics = { badge: null, frame: null, banner: null };

  for (const slot of PROFILE_COSMETIC_SLOTS) {
    const code = equipped[slot];
    const item = code === null ? null : cosmeticOf(code);

    if (code !== null && item?.slot === slot && isCosmeticUsable({ item, isOwned: owned.has(code), isPlus })) {
      visible[slot] = code;
    }
  }

  return visible;
};
