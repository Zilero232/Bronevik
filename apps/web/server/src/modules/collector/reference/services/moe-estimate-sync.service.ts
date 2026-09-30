import { utc } from '@date-fns/utc';
import { Injectable } from '@nestjs/common';
import { MOE_CURVE } from '@otmetki/schemas';
import { startOfDay, subDays } from 'date-fns';

import type { MoeEstimateRow } from '../queries';

import { PrismaService } from '../../../../core';
import { moeThresholdLevels } from '../../../reference';
import { MOE_ESTIMATE } from '../config';
import { moeEstimates } from '../lib/moe-estimate';
import { moeEstimateSql } from '../queries';

@Injectable()
export class MoeEstimateSyncService {
  constructor(private readonly prisma: PrismaService) {}

  async sync() {
    const now = new Date();

    const rows = await this.prisma.$queryRaw<MoeEstimateRow[]>(
      moeEstimateSql({
        since: subDays(now, MOE_CURVE.windowDays),
        steps: Object.values(MOE_ESTIMATE.percents),
        band: MOE_CURVE.bandPercent,
        battleType: MOE_ESTIMATE.randomBattleType
      })
    );

    const estimates = moeEstimates(rows);

    if (estimates.length === 0) {
      return { vehicles: 0 };
    }

    const date = startOfDay(now, { in: utc });

    await this.prisma.$transaction([
      this.prisma.tankThreshold.deleteMany({ where: { kind: 'moe', source: 'otmetki', date } }),
      this.prisma.tankThreshold.createMany({
        data: estimates.map(({ tankId, sampleSize, ...levels }) => ({
          kind: 'moe' as const,
          tankId,
          date,
          source: 'otmetki' as const,
          sampleSize,
          ...moeThresholdLevels(levels)
        }))
      })
    ]);

    return { vehicles: estimates.length };
  }
}
