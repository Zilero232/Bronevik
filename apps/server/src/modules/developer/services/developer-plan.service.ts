import type { ApiPlan, ApiPlans } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';
import { apiPlanSchema } from '@otmetki/schemas';
import { LRUCache } from 'lru-cache';

import { PrismaService } from '../../../core';
import { API_KEY_POLICY, API_PLANS, DEVELOPER_PLAN } from '../config';
import { keyPlanOf } from '../lib';

@Injectable()
export class DeveloperPlanService {
  private readonly cache = new LRUCache<string, ApiPlan>({ max: API_KEY_POLICY.planCacheMaxEntries, ttl: API_KEY_POLICY.planCacheTtlMs });

  constructor(private readonly prisma: PrismaService) {}

  plans(): ApiPlans {
    return apiPlanSchema.options.map((plan) => ({ plan, limits: API_PLANS[plan] }));
  }

  async planFor(userId: string): Promise<ApiPlan> {
    const [keys, subscription] = await Promise.all([
      this.prisma.apiKey.findMany({ where: { referenceId: userId, enabled: true }, select: { metadata: true } }),
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

    const plan = keys.some(({ metadata }) => keyPlanOf(metadata) === 'partner') ? 'partner' : subscription ? 'pro' : 'free';

    this.cache.set(userId, plan);

    return plan;
  }

  async cachedPlanFor(userId: string): Promise<ApiPlan> {
    return this.cache.get(userId) ?? this.planFor(userId);
  }
}
