import { apiPlanSchema } from '@bronevik/schemas';
import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { ApiKey, Subscription } from '../../../../../generated';
import type { PrismaService } from '../../../../core';

import { API_PLANS } from '../../config';
import { DeveloperPlanService } from '../developer-plan.service';

const createService = ({ partnerKeys, subscription }: { partnerKeys: number; subscription: boolean }) => {
  const prisma = mockDeep<PrismaService>();

  prisma.apiKey.findMany.mockResolvedValue(
    Array.from({ length: partnerKeys }, () => mock<ApiKey>({ metadata: JSON.stringify({ plan: 'partner' }) }))
  );

  prisma.subscription.findFirst.mockResolvedValue(subscription ? mock<Subscription>() : null);

  return new DeveloperPlanService(prisma);
};

describe('DeveloperPlanService.planFor', () => {
  it('gives everybody the free plan by default', async () => {
    expect(await createService({ partnerKeys: 0, subscription: false }).planFor('user')).toBe('free');
  });

  it('upgrades an active Developer Pro subscriber', async () => {
    expect(await createService({ partnerKeys: 0, subscription: true }).planFor('user')).toBe('pro');
  });

  it('keeps a partner on the partner plan whatever they pay for', async () => {
    expect(await createService({ partnerKeys: 1, subscription: true }).planFor('user')).toBe('partner');
  });
});

describe('DeveloperPlanService.cachedPlanFor', () => {
  it('answers from the cache after the first lookup', async () => {
    const prisma = mockDeep<PrismaService>();

    prisma.apiKey.findMany.mockResolvedValue([]);
    prisma.subscription.findFirst.mockResolvedValue(null);

    const service = new DeveloperPlanService(prisma);

    await service.cachedPlanFor('user');
    await service.cachedPlanFor('user');

    expect(prisma.subscription.findFirst).toHaveBeenCalledTimes(1);
  });
});

describe('DeveloperPlanService.plans', () => {
  it('lists every plan once, each with the limits the rate limiter enforces', () => {
    const plans = createService({ partnerKeys: 0, subscription: false }).plans();

    expect(plans.map(({ plan }) => plan)).toEqual(apiPlanSchema.options);

    for (const { plan, limits } of plans) {
      expect(limits).toEqual(API_PLANS[plan]);
    }
  });
});
