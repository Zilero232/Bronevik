import { describe, expect, it } from 'vitest';

import { COMPARE_LIMIT } from '../../../config';
import { bestIndices, compareIds, deltasToBest } from '../compare-math';

describe('bestIndices', () => {
  it('marks the highest value when higher is better', () => {
    expect(bestIndices({ values: [1_200, 2_900, 800], direction: 'higher' })).toEqual([1]);
  });

  it('marks the lowest value when lower is better', () => {
    expect(bestIndices({ values: [1_200, 2_900, 800], direction: 'lower' })).toEqual([2]);
  });

  it('marks every player that shares the best value', () => {
    expect(bestIndices({ values: [60, 55, 60], direction: 'higher' })).toEqual([0, 2]);
  });

  it('skips players without a value', () => {
    expect(bestIndices({ values: [null, 55, 50], direction: 'higher' })).toEqual([1]);
  });

  it('names no winner for a neutral metric', () => {
    expect(bestIndices({ values: [6.5, 8.2], direction: 'none' })).toEqual([]);
  });

  it('names no winner when fewer than two players have a value', () => {
    expect(bestIndices({ values: [null, 55], direction: 'higher' })).toEqual([]);
  });
});

describe('compareIds', () => {
  it('drops zeros, negatives and duplicates', () => {
    expect(compareIds([12, 0, 12, -3, 34])).toEqual([12, 34]);
  });

  it('never returns more players than the page compares', () => {
    expect(compareIds([1, 2, 3, 4, 5, 6, 7])).toHaveLength(COMPARE_LIMIT.max);
  });
});

describe('deltasToBest', () => {
  it('measures every other player against the best value', () => {
    expect(deltasToBest({ values: [1_200, 2_900, null], best: [1] })).toEqual([-1_700, null, null]);
  });

  it('leaves every delta empty without a winner', () => {
    expect(deltasToBest({ values: [6.5, 8.2], best: [] })).toEqual([null, null]);
  });

  it('gives no delta to any player sharing the best value', () => {
    expect(deltasToBest({ values: [2_900, 1_200, 2_900], best: [0, 2] })).toEqual([null, -1_700, null]);
  });

  it('shows a positive delta for a worse value when lower is better', () => {
    expect(deltasToBest({ values: [6.5, 8.2], best: [0] })).toEqual([null, 8.2 - 6.5]);
  });

  it('measures a player at zero against the best rather than skipping them', () => {
    expect(deltasToBest({ values: [0, 40], best: [1] })).toEqual([-40, null]);
  });
});
