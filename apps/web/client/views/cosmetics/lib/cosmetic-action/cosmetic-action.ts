import type { CosmeticAction, CosmeticActionInput, LockedActionInput } from './cosmetic-action.types';

const lockedAction = ({ item, isPlus, balance }: LockedActionInput): CosmeticAction => {
  if (item.source === 'plus' || !isPlus) {
    return 'plus';
  }

  if (item.source === 'shop' && item.price !== null) {
    return balance >= item.price ? 'buy' : 'short';
  }

  return 'owned';
};

export const cosmeticAction = ({ item, equipped, isPlus, balance }: CosmeticActionInput): CosmeticAction => {
  if (!item.isUsable) {
    return lockedAction({ item, isPlus, balance });
  }

  if (item.slot === 'overlayTheme') {
    return 'owned';
  }

  return equipped[item.slot] === item.code ? 'unequip' : 'equip';
};
