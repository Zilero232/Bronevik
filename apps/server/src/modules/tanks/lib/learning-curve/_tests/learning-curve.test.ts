import { LEARNING_CURVE, LEARNING_DIFFICULTIES } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import type { LearningCurveRow } from '../learning-curve.types';

import { TANK_LEARNING } from '../../../config';
import { bucketOf, learningDifficulty, toTankLearning } from '../learning-curve';

const computedAt = new Date('2026-09-26T07:45:00Z');
const enough: number = TANK_LEARNING.minBucketBattles;

const row = (bucket: number, winRate: number, battles = enough): LearningCurveRow => ({
  bucket,
  battles,
  players: 10,
  wins: Math.round((battles * winRate) / 100),
  damage: BigInt(battles * 1_500),
  windowDays: LEARNING_CURVE.windowDays,
  computedAt
});

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

describe('toTankLearning', () => {
  it('returns one bucket per configured start, empty ones included', () => {
    const learning = toTankLearning({ tankId: 1, rows: [row(1, 50)] });

    expect(learning.buckets.map((bucket) => bucket.from)).toEqual([...LEARNING_CURVE.bucketStarts]);
    expect(learning.buckets[0]?.winRate).toBeNull();
    expect(learning.buckets.at(-1)?.to).toBeNull();
  });

  it('measures the gain between the first and the last bucket with enough battles', () => {
    const learning = toTankLearning({ tankId: 1, rows: [row(0, 46), row(1, 48), row(3, 53), row(2, 70, enough - 1)] });

    expect(learning.gain).toBeCloseTo(53 - 46, 0);
    expect(learning.difficulty).toBe(learningDifficulty(learning.gain));
  });

  it('gives no gain when only one bucket has enough battles', () => {
    const learning = toTankLearning({ tankId: 1, rows: [row(0, 46), row(1, 60, enough - 1)] });

    expect(learning.gain).toBeNull();
    expect(learning.difficulty).toBeNull();
  });

  it('reports no computation time for a tank with no curve yet', () => {
    expect(toTankLearning({ tankId: 1, rows: [] }).computedAt).toBeNull();
  });
});
