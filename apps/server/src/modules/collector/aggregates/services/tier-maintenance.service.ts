import { Injectable } from '@nestjs/common';
import { subDays } from 'date-fns';

import { PrismaService } from '../../../../core';
import { TIER_MAINTENANCE } from '../config';
import { demoteIdleSql, promotePinnedSql } from '../queries';

@Injectable()
export class TierMaintenanceService {
  constructor(private readonly prisma: PrismaService) {}

  async run() {
    const now = new Date();
    const dormantSince = subDays(now, TIER_MAINTENANCE.dormantAfterDays);
    const promoted = await this.prisma.$executeRaw(promotePinnedSql({ now }));
    const demoted = await this.prisma.$executeRaw(demoteIdleSql({ idleSince: subDays(now, TIER_MAINTENANCE.activeIdleDays) }));

    const revived = await this.prisma.player.updateMany({
      where: { trackingTier: 'dormant', lastBattleAt: { gte: dormantSince } },
      data: { trackingTier: 'population' }
    });

    const retired = await this.prisma.player.updateMany({
      where: { trackingTier: 'population', lastBattleAt: { lt: dormantSince } },
      data: { trackingTier: 'dormant' }
    });

    return { promoted, demoted, revived: revived.count, retired: retired.count };
  }
}
