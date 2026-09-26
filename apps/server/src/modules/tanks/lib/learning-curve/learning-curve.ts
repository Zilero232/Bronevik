import type { LearningBucket, LearningDifficulty, TankLearning } from '@otmetki/schemas';

import { LEARNING_CURVE } from '@otmetki/schemas';
import { firstBy, last } from 'remeda';

import type { ToTankLearningInput } from './learning-curve.types';

import { clampPercent, clampPercentDelta } from '../../../../common/lib';
import { TANK_LEARNING } from '../../config';

export const bucketOf = (battles: number): number => {
  const index = LEARNING_CURVE.bucketStarts.findLastIndex((start) => battles >= start);

  return Math.max(index, 0);
};

export const learningDifficulty = (gain: number | null): LearningDifficulty | null => {
  if (gain === null) {
    return null;
  }

  const { easy, moderate, hard } = TANK_LEARNING.difficultyGain;

  if (gain < easy) {
    return 'easy';
  }

  if (gain < moderate) {
    return 'moderate';
  }

  return gain < hard ? 'hard' : 'hardcore';
};

export const learningGain = (buckets: readonly LearningBucket[]): number | null => {
  const eligible = buckets.filter((bucket) => bucket.battles >= TANK_LEARNING.minBucketBattles && bucket.winRate !== null);
  const first = eligible.at(0);
  const final = last(eligible);

  if (!first || !final || first === final || first.winRate === null || final.winRate === null) {
    return null;
  }

  return clampPercentDelta(final.winRate - first.winRate);
};

export const toTankLearning = ({ tankId, rows }: ToTankLearningInput): TankLearning => {
  const starts = LEARNING_CURVE.bucketStarts;

  const buckets = starts.map((from, index): LearningBucket => {
    const row = rows.find((item) => item.bucket === index);
    const battles = row?.battles ?? 0;

    return {
      index,
      from,
      to: starts[index + 1] ?? null,
      battles,
      players: row?.players ?? 0,
      winRate: row && battles > 0 ? clampPercent((row.wins * 100) / battles) : null,
      avgDamage: row && battles > 0 ? Number(row.damage) / battles : null
    };
  });

  const gain = learningGain(buckets);
  const latest = firstBy(rows, [(row) => row.computedAt.getTime(), 'desc']);

  return {
    tankId,
    windowDays: latest?.windowDays ?? LEARNING_CURVE.windowDays,
    buckets,
    gain,
    difficulty: learningDifficulty(gain),
    computedAt: latest ? latest.computedAt.toISOString() : null
  };
};
