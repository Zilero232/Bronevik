import type { LucideIcon } from 'lucide-react';

import { COSMETIC_ITEMS, cosmeticOf, profileCosmeticSlotSchema } from '@otmetki/schemas';

import type { CosmeticLabel, CosmeticTone, StaticCosmeticCode } from '../../model/cosmetics.types';

import { BADGE_ICONS, COSMETIC_TONES } from '../../config';

const staticCode = (code: string): StaticCosmeticCode | null => COSMETIC_ITEMS.find((item) => item.code === code)?.code ?? null;

export const cosmeticLabel = (code: string): CosmeticLabel | null => {
  const known = staticCode(code);

  if (known !== null) {
    return { kind: 'static', code: known };
  }

  const item = cosmeticOf(code);
  const slot = profileCosmeticSlotSchema.safeParse(item?.slot);

  if (!item?.season || !item.grade || !slot.success) {
    return null;
  }

  return { kind: 'season', season: item.season, slot: slot.data, grade: item.grade };
};

export const cosmeticTone = (code: string | null): CosmeticTone | null => {
  if (code === null) {
    return null;
  }

  const known = staticCode(code);

  if (known !== null) {
    return COSMETIC_TONES[known];
  }

  return cosmeticOf(code)?.grade ?? null;
};

export const badgeIcon = (code: string): LucideIcon => {
  const icons: Partial<Record<string, LucideIcon>> = BADGE_ICONS;

  return icons[code] ?? BADGE_ICONS.season;
};
