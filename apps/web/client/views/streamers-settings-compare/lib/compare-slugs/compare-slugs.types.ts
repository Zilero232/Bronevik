import type { COMPARE_SLOTS } from '../../config';

export type CompareSlot = (typeof COMPARE_SLOTS)[number];

export type CompareSlotValues = Record<CompareSlot, string | null>;

export type CompareSlugInput = {
  slugs: readonly string[];
  slug: string;
};
