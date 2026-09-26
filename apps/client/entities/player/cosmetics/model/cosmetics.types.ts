import type { COSMETIC_ITEMS, CosmeticGrade, ProfileCosmeticSlot } from '@otmetki/schemas';

export type StaticCosmeticCode = (typeof COSMETIC_ITEMS)[number]['code'];

export type CosmeticTone = 'arctic' | 'bronze' | 'ember' | 'gold' | 'night' | 'olive' | 'plus' | 'silver' | 'steel';

export type CosmeticLabel =
  { kind: 'season'; season: string; slot: ProfileCosmeticSlot; grade: CosmeticGrade } | { kind: 'static'; code: StaticCosmeticCode };
