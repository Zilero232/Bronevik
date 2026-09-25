import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../core';
import { PLUS_PRODUCT } from '../config';
import { isEntitled } from '../lib';

@Injectable()
export class EntitlementsService {
  constructor(private readonly prisma: PrismaService) {}

  async hasPlus(userId: string): Promise<boolean> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId_product: { userId, product: PLUS_PRODUCT } },
      select: { status: true, currentPeriodEnd: true }
    });

    return isEntitled({ subscription, now: new Date() });
  }

  async syncTracking(userId: string): Promise<number> {
    const accounts = await this.prisma.userLestaAccount.findMany({ where: { userId }, select: { accountId: true } });

    if (accounts.length === 0) {
      return 0;
    }

    const updated = await this.prisma.player.updateMany({
      where: { accountId: { in: accounts.map((account) => account.accountId) } },
      data: { trackingTier: 'active', nextPollAt: new Date() }
    });

    return updated.count;
  }
}
