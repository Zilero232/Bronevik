import type { MapSummary } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { compareMaps } from '../map-hints';

const map = (arenaId: string, patch: Partial<MapSummary> = {}): MapSummary => ({
  arenaId,
  slug: arenaId,
  name: arenaId,
  nameEn: null,
  image: null,
  sizeMeters: 1000,
  camouflage: 'summer',
  modes: [],
  ...patch
});

describe('compareMaps', () => {
  it('marks the target itself as correct with matching hints', () => {
    expect(compareMaps({ guess: map('a'), target: map('a') })).toEqual({ isCorrect: true, camouflage: 'match', size: 'match' });
  });

  it('tells whether the target is larger or smaller than the guess', () => {
    expect(compareMaps({ guess: map('a', { sizeMeters: 800 }), target: map('b', { sizeMeters: 1000 }) }).size).toBe('larger');
    expect(compareMaps({ guess: map('a', { sizeMeters: 1200 }), target: map('b', { sizeMeters: 1000 }) }).size).toBe('smaller');
  });

  it('compares the camouflage type', () => {
    expect(compareMaps({ guess: map('a', { camouflage: 'winter' }), target: map('b') }).camouflage).toBe('miss');
  });

  it('gives no hint when a map has no size or camouflage in the data', () => {
    const hints = compareMaps({ guess: map('a', { sizeMeters: null, camouflage: null }), target: map('b') });

    expect(hints).toEqual({ isCorrect: false, camouflage: 'unknown', size: 'unknown' });
  });
});
