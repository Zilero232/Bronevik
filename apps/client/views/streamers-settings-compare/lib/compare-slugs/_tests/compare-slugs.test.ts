import { STREAMER_SETTINGS } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { compareSlugs, slotValues, withoutSlug, withSlug } from '..';
import { COMPARE_SLOTS } from '../../../config';

describe('compareSlugs', () => {
  it('reads slots in order, trims, lowercases and drops duplicates and blanks', () => {
    expect(compareSlugs({ a: ' Jove ', b: null, c: 'jove', d: 'near-you' })).toEqual(['jove', 'near-you']);
  });

  it('reads an empty set', () => {
    expect(compareSlugs({})).toEqual([]);
  });
});

describe('slotValues', () => {
  it('packs slugs into slots and clears the rest', () => {
    const values = slotValues(['jove']);

    expect(values[COMPARE_SLOTS[0]]).toBe('jove');
    expect(COMPARE_SLOTS.slice(1).every((slot) => values[slot] === null)).toBe(true);
  });
});

describe('withSlug and withoutSlug', () => {
  it('never exceeds the compare maximum', () => {
    const full = Array.from({ length: STREAMER_SETTINGS.compareMax }, (_, index) => `s${index}`);

    expect(withSlug({ slugs: full, slug: 'extra' })).toHaveLength(STREAMER_SETTINGS.compareMax);
    expect(withSlug({ slugs: ['a'], slug: 'B' })).toEqual(['a', 'b']);
    expect(withSlug({ slugs: ['a'], slug: 'a' })).toEqual(['a']);
  });

  it('removes a slug and keeps the order', () => {
    expect(withoutSlug({ slugs: ['a', 'b', 'c'], slug: 'b' })).toEqual(['a', 'c']);
  });
});
