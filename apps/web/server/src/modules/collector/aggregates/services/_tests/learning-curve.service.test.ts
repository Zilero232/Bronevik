import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { LearningSqlRow } from '../../mappers';

import { LEARNING_CURVE_AGGREGATE } from '../../config';
import { LearningCurveService } from '../learning-curve.service';
import { createPrisma, queryValues } from './aggregates.fixtures';

const NOW = new Date('2026-09-26T12:00:00Z');

const createCurve = (rows: LearningSqlRow[]) => {
  const prisma = createPrisma();

  prisma.$queryRaw.mockResolvedValue(rows);

  return { prisma, service: new LearningCurveService(prisma) };
};

describe('LearningCurveService.compute', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('bounds the query by the minimum sample and the largest plausible battle jump', async () => {
    const { prisma, service } = createCurve([]);

    await service.compute();

    expect(queryValues(prisma)).toEqual(expect.arrayContaining([LEARNING_CURVE_AGGREGATE.minBattles, LEARNING_CURVE_AGGREGATE.maxBattleDelta]));
  });

  it('clears the curve when no bucket reaches the minimum sample', async () => {
    const { prisma, service } = createCurve([]);

    expect(await service.compute()).toEqual({ rows: 0 });
    expect(prisma.tankLearningCurve.createMany.mock.calls[0]?.[0]?.data).toEqual([]);
  });

  it('never stores more wins than battles in a bucket', async () => {
    const battles = LEARNING_CURVE_AGGREGATE.minBattles;
    const { prisma, service } = createCurve([{ tank_id: 1, bucket: 0, battles, players: 3, wins: battles + 5, damage: 90_000 }]);

    await service.compute();

    expect(prisma.tankLearningCurve.createMany.mock.calls[0]?.[0]?.data).toEqual([
      expect.objectContaining({ battles, wins: battles, damage: 90_000n })
    ]);
  });
});
