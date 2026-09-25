import { Injectable } from '@nestjs/common';

import { previousWeek } from '../../../common/lib';
import { PrismaService } from '../../../core';
import { BEST_OF_WEEK } from '../config';
import { publicReplayWhere } from '../lib';

@Injectable()
export class BestOfWeekService {
  constructor(private readonly prisma: PrismaService) {}

  async feature(now: Date): Promise<number> {
    const { start, end } = previousWeek(now);
    const top = await this.prisma.replay.findMany({
      where: { ...publicReplayWhere, playedAt: { gte: start, lt: end }, damageDealt: { not: null } },
      orderBy: { damageDealt: 'desc' },
      take: BEST_OF_WEEK.size,
      select: { id: true }
    });

    if (top.length === 0) {
      return 0;
    }

    const { count } = await this.prisma.replay.updateMany({ where: { id: { in: top.map((row) => row.id) } }, data: { isFeatured: true } });

    return count;
  }
}
