import { Injectable } from '@nestjs/common';

import type { RotationCount } from '../lib';
import type { QueueTimeRow } from '../queries';

import { PrismaService } from '../../../core';
import { MAP_STATS } from '../config';
import { statsWindow, withShares } from '../lib';
import { queueTimesSql, rotationCountsSql } from '../queries';

@Injectable()
export class MapStatsAggregateService {
  constructor(private readonly prisma: PrismaService) {}

  async compute(now = new Date()) {
    const window = statsWindow({ now, days: MAP_STATS.windowDays });
    const [counts, queues] = await Promise.all([
      this.prisma.$queryRaw<RotationCount[]>(rotationCountsSql(window)),
      this.prisma.$queryRaw<QueueTimeRow[]>(queueTimesSql(window))
    ]);

    const common = { windowDays: MAP_STATS.windowDays, computedAt: now };
    const rotation = withShares(counts).map((row) => ({ ...row, ...common }));
    const queue = queues.map((row) => ({ ...row, ...common }));

    await this.prisma.$transaction([
      this.prisma.mapRotationAggregate.deleteMany(),
      this.prisma.mapRotationAggregate.createMany({ data: rotation }),
      this.prisma.queueTimeAggregate.deleteMany(),
      this.prisma.queueTimeAggregate.createMany({ data: queue })
    ]);

    return { rotation: rotation.length, queue: queue.length };
  }
}
