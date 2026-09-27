import { Injectable } from '@nestjs/common';
import { subDays } from 'date-fns';

import { PrismaService } from '../../../../core';
import { TIER_MAINTENANCE } from '../config';

@Injectable()
export class TierMaintenanceService {
  constructor(private readonly prisma: PrismaService) {}

  async run() {
    const now = new Date();
    const pinned = await this.pinnedAccountIds();
    const idleSince = subDays(now, TIER_MAINTENANCE.activeIdleDays);
    const dormantSince = subDays(now, TIER_MAINTENANCE.dormantAfterDays);

    const promoted = await this.prisma.player.updateMany({
      where: { trackingTier: { not: 'active' }, accountId: { in: pinned } },
      data: { trackingTier: 'active', nextPollAt: now }
    });

    const demoted = await this.prisma.player.updateMany({
      where: {
        trackingTier: 'active',
        accountId: { notIn: pinned },
        OR: [{ lastViewedAt: null }, { lastViewedAt: { lt: idleSince } }]
      },
      data: { trackingTier: 'population' }
    });

    const revived = await this.prisma.player.updateMany({
      where: { trackingTier: 'dormant', lastBattleAt: { gte: dormantSince } },
      data: { trackingTier: 'population' }
    });

    const retired = await this.prisma.player.updateMany({
      where: { trackingTier: 'population', lastBattleAt: { lt: dormantSince } },
      data: { trackingTier: 'dormant' }
    });

    return { promoted: promoted.count, demoted: demoted.count, revived: revived.count, retired: retired.count };
  }

  private async pinnedAccountIds(): Promise<bigint[]> {
    const [follows, links, devices] = await Promise.all([
      this.prisma.follow.findMany({ where: { kind: 'player' }, select: { targetId: true }, distinct: ['targetId'] }),
      this.prisma.userLestaAccount.findMany({ select: { accountId: true } }),
      this.prisma.modDevice.findMany({ where: { revokedAt: null, accountId: { not: null } }, select: { accountId: true }, distinct: ['accountId'] })
    ]);

    const ids = new Set<bigint>([
      ...follows.map((follow) => follow.targetId),
      ...links.map((link) => link.accountId),
      ...devices.flatMap((device) => (device.accountId === null ? [] : [device.accountId]))
    ]);

    return [...ids];
  }
}
