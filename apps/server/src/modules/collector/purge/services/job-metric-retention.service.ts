import { Injectable } from '@nestjs/common';
import { subDays } from 'date-fns';

import { PrismaService } from '../../../../core';
import { PURGE } from '../config';

@Injectable()
export class JobMetricRetentionService {
  constructor(private readonly prisma: PrismaService) {}

  async purgeExpired(now = new Date()): Promise<number> {
    const cutoff = subDays(now, PURGE.jobMetricRetentionDays);
    let deleted = 0;

    for (;;) {
      const batch = await this.prisma.collectorJobMetric.findMany({
        where: { bucketStart: { lt: cutoff } },
        select: { bucketStart: true },
        orderBy: { bucketStart: 'asc' },
        take: PURGE.jobMetricDeleteBatch
      });

      const last = batch.at(-1);

      if (!last) {
        return deleted;
      }

      const { count } = await this.prisma.collectorJobMetric.deleteMany({
        where: { bucketStart: { lt: cutoff, lte: last.bucketStart } }
      });

      deleted += count;

      if (batch.length < PURGE.jobMetricDeleteBatch) {
        return deleted;
      }
    }
  }
}
