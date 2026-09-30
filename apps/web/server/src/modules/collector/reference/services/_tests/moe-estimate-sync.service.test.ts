import { MOE_CURVE } from '@otmetki/schemas';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import type { PrismaService } from '../../../../../core';
import type { MoeEstimateRow } from '../../queries';

import { moeThresholdLevels } from '../../../../reference';
import { MOE_ESTIMATE } from '../../config';
import { MoeEstimateSyncService } from '../moe-estimate-sync.service';

const NOW = new Date('2026-09-30T15:00:00Z');
const TODAY = new Date('2026-09-30T00:00:00Z');

const point = (tankId: number, percent: number, damage: number): MoeEstimateRow => ({ tankId, percent, damage, players: MOE_CURVE.minPlayers });

const fullTank = (tankId: number): MoeEstimateRow[] => [
  point(tankId, MOE_ESTIMATE.percents.p65, 2_000.4),
  point(tankId, MOE_ESTIMATE.percents.p85, 2_600),
  point(tankId, MOE_ESTIMATE.percents.p95, 3_100),
  point(tankId, MOE_ESTIMATE.percents.p100, 3_900)
];

const createSync = (rows: MoeEstimateRow[]) => {
  const prisma = mockDeep<PrismaService>();

  prisma.$queryRaw.mockResolvedValue(rows);
  prisma.$transaction.mockResolvedValue([]);

  return { prisma, service: new MoeEstimateSyncService(prisma) };
};

describe('MoeEstimateSyncService.sync', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('keeps the stored thresholds when no tank has enough mod battles', async () => {
    const { prisma, service } = createSync([point(1, MOE_ESTIMATE.percents.p65, 2_000)]);

    expect(await service.sync()).toEqual({ vehicles: 0 });
    expect(prisma.$transaction).not.toHaveBeenCalled();
    expect(prisma.tankThreshold.deleteMany).not.toHaveBeenCalled();
  });

  it('replaces today’s own thresholds for every tank the mod players reported enough', async () => {
    const { prisma, service } = createSync([...fullTank(1), ...fullTank(2)]);

    expect(await service.sync()).toEqual({ vehicles: 2 });

    expect(prisma.tankThreshold.deleteMany.mock.calls[0]?.[0]?.where).toEqual({ kind: 'moe', source: 'otmetki', date: TODAY });

    expect(prisma.tankThreshold.createMany.mock.calls[0]?.[0]?.data).toEqual([
      {
        kind: 'moe',
        tankId: 1,
        date: TODAY,
        source: 'otmetki',
        sampleSize: MOE_CURVE.minPlayers,
        ...moeThresholdLevels({ p65: 2_000, p85: 2_600, p95: 3_100, p100: 3_900 })
      },
      expect.objectContaining({ tankId: 2, source: 'otmetki' })
    ]);
  });

  it('reads the last curve window of random battles only', async () => {
    const { prisma, service } = createSync([]);

    await service.sync();

    const sql = prisma.$queryRaw.mock.calls[0]?.[0];

    expect(sql).toMatchObject({ values: expect.arrayContaining([MOE_ESTIMATE.randomBattleType, MOE_CURVE.bandPercent]) });
    expect(sql).toMatchObject({ values: expect.arrayContaining([new Date('2026-09-16T15:00:00Z')]) });
  });
});
