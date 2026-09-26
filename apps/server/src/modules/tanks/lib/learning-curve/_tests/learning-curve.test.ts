import { LEARNING_CURVE, LEARNING_DIFFICULTIES } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { bucketOf, learningDifficulty } from '../learning-curve';

describe('bucketOf', () => {
  it('places a battle count in the bucket whose start it has reached', () => {
    LEARNING_CURVE.bucketStarts.forEach((start, index) => {
      expect(bucketOf(start)).toBe(index);
    });
  });

  it('keeps the count just below a boundary in the previous bucket', () => {
    const second = LEARNING_CURVE.bucketStarts[1];

    expect(bucketOf(second - 1)).toBe(0);
  });
});

describe('learningDifficulty', () => {
  it('never gets easier as the gain grows', () => {
    const gains = [-5, 0, 1, 3, 5, 7, 20];
    const ranks = gains.map((gain) => LEARNING_DIFFICULTIES.indexOf(learningDifficulty(gain) ?? 'easy'));

    expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
  });

  it('has no verdict without a gain', () => {
    expect(learningDifficulty(null)).toBeNull();
  });
});
