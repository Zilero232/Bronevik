import { MOE_CURVE } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { PrismaService } from '../../../../core';
import type { ThresholdsService } from '../../../reference';

import { MoeCurveService } from '../moe-curve.service';

const createService = () => {
  const prisma = mockDeep<PrismaService>();
  const thresholds = mock<ThresholdsService>();

  thresholds.moe.mockResolvedValue(null);

  return { prisma, thresholds, service: new MoeCurveService(prisma, thresholds) };
};

describe('MoeCurveService.curve', () => {
  it('answers no points and no thresholds for a tank nobody reported', async () => {
    const { prisma, service } = createService();

    prisma.$queryRaw.mockResolvedValue([]);

    await expect(service.curve(1)).resolves.toMatchObject({ tankId: 1, thresholds: null, points: [], minPlayers: MOE_CURVE.minPlayers });
  });

  it('keeps only the percents enough players reported', async () => {
    const { prisma, service } = createService();

    prisma.$queryRaw.mockResolvedValue([
      { percent: 70, damage: 2_400, players: MOE_CURVE.minPlayers, battles: 90 },
      { percent: 75, damage: 2_500, players: 1, battles: 3 }
    ]);

    expect((await service.curve(1)).points.map(({ percent }) => percent)).toEqual([70]);
  });
});
