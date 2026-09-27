import { STREAMER_SETTINGS } from '@otmetki/schemas';
import { unique } from 'remeda';

import type { CompareSlot, CompareSlotValues, CompareSlugInput } from './compare-slugs.types';

import { COMPARE_SLOTS } from '../../config';

const normalize = (slug: string): string => slug.trim().toLowerCase();

export const compareSlugs = (values: Partial<Record<CompareSlot, string | null>>): string[] =>
  unique(COMPARE_SLOTS.map((slot) => normalize(values[slot] ?? '')).filter(Boolean)).slice(0, STREAMER_SETTINGS.compareMax);

export const slotValues = (slugs: readonly string[]): CompareSlotValues => {
  const [a = null, b = null, c = null, d = null] = slugs;

  return { a, b, c, d };
};

export const withSlug = ({ slugs, slug }: CompareSlugInput): string[] => compareSlugs(slotValues([...slugs, slug]));

export const withoutSlug = ({ slugs, slug }: CompareSlugInput): string[] => slugs.filter((item) => item !== normalize(slug));
