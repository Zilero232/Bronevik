import { describe, expect, it } from 'vitest';

import { COMPARE_LIMIT } from '../../../config';
import { bestIndices, parseCompareIds } from '../compare-math';

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

describe('parseCompareIds', () => {
  it('reads a comma separated list', () => {
    expect(parseCompareIds('12,34')).toEqual([12, 34]);
  });

  it('drops junk, zeros and duplicates', () => {
    expect(parseCompareIds('12,abc,0,12,-3,34')).toEqual([12, 34]);
  });

  it('never returns more players than the page compares', () => {
    expect(parseCompareIds('1,2,3,4,5,6,7')).toHaveLength(COMPARE_LIMIT.max);
  });

  it('returns nothing for a missing parameter', () => {
    expect(parseCompareIds(null)).toEqual([]);
  });
});
