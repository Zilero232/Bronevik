import type { ApiPlan } from '@bronevik/schemas';

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../core';
import { DEVELOPER_PLAN } from '../config';

@Injectable()
export class DeveloperPlanService {
  constructor(private readonly prisma: PrismaService) {}

  async planFor(userId: string): Promise<ApiPlan> {
    const [partner, subscription] = await Promise.all([
      this.prisma.apiKey.count({ where: { userId, plan: 'partner', revokedAt: null } }),
      this.prisma.subscription.findFirst({
        where: {
          userId,
          product: { in: [...DEVELOPER_PLAN.proProducts] },
          status: { in: [...DEVELOPER_PLAN.activeStatuses] },
          OR: [{ currentPeriodEnd: null }, { currentPeriodEnd: { gt: new Date() } }]
        },
        select: { id: true }
      })
    ]);

    if (partner > 0) {
      return 'partner';
    }

    return subscription ? 'pro' : 'free';
  }
}
