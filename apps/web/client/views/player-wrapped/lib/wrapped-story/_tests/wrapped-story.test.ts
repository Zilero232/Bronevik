import { describe, expect, it } from 'vitest';

import type { WrappedStoryData } from '../wrapped-story.types';

import { parseWrappedYear, wrappedChapters, wrappedYears } from '../wrapped-story';

const STORY: WrappedStoryData = {
  battles: 1_200,
  damageDealt: 2_400_000,
  topTanks: [{ tankId: 1, battles: 300, damageDealt: 900_000 }],
  marksGained: 2,
  masteriesGained: 1,
  badges: ['weekly-battles-50'],
  bestBattle: { tankId: 1, damageDealt: 9_000, frags: 5, at: '2026-05-01T20:00:00Z', replayId: null }
};

describe('parseWrappedYear', () => {
  it('accepts a four-digit year in range', () => {
    expect(parseWrappedYear('2025')).toBe(2025);
  });

  it('rejects years before tracking began, junk and padding', () => {
    expect(parseWrappedYear('2019')).toBeNull();
    expect(parseWrappedYear('20x5')).toBeNull();
    expect(parseWrappedYear('02025')).toBeNull();
    expect(parseWrappedYear('')).toBeNull();
  });
});

describe('wrappedYears', () => {
  it('lists every year from the current one down to the first', () => {
    expect(wrappedYears({ now: new Date('2026-09-27T12:00:00Z'), year: 2025 })).toEqual([2026, 2025, 2024, 2023]);
  });

  it('falls back to the requested year before the clock is known', () => {
    expect(wrappedYears({ now: null, year: 2024 })).toEqual([2024, 2023]);
  });
});

describe('wrappedChapters', () => {
  it('shows every chapter with data', () => {
    expect(wrappedChapters(STORY)).toEqual(['activity', 'damage', 'tanks', 'marks', 'best']);
  });

  it('drops the chapters without data', () => {
    expect(wrappedChapters({ ...STORY, topTanks: [], marksGained: 0, masteriesGained: 0, badges: [], bestBattle: null })).toEqual([
      'activity',
      'damage'
    ]);
  });

  it('has nothing to tell for an empty year', () => {
    expect(wrappedChapters({ battles: 0, damageDealt: 0, topTanks: [], marksGained: 0, masteriesGained: 0, badges: [], bestBattle: null })).toEqual(
      []
    );
  });
});
