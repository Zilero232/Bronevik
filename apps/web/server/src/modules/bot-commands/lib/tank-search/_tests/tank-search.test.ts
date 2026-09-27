import { describe, expect, it } from 'vitest';

import { findTanks, normaliseTankName } from '../tank-search';

describe('findTanks', () => {
  const entries = [
    { name: 'Объект 140', shortName: 'Об. 140' },
    { name: 'Т-34', shortName: 'Т-34' },
    { name: 'Т-34-85', shortName: 'Т-34-85' },
    { name: 'Ёжик', shortName: 'Ёжик' }
  ];

  const names = (entry: (typeof entries)[number]) => [entry.name, entry.shortName];

  it('prefers an exact name over a longer one that starts the same', () => {
    expect(findTanks({ entries, query: 'т-34', limit: 1, names })).toEqual([entries[1]]);
  });

  it('ignores punctuation and spaces', () => {
    expect(findTanks({ entries, query: 'об140', limit: 1, names })).toEqual([entries[0]]);
  });

  it('treats ё as е', () => {
    expect(normaliseTankName('Ёжик')).toBe(normaliseTankName('Ежик'));
    expect(findTanks({ entries, query: 'ежик', limit: 1, names })).toEqual([entries[3]]);
  });

  it('returns nothing for an empty query', () => {
    expect(findTanks({ entries, query: ' - ', limit: 5, names })).toEqual([]);
  });
});
