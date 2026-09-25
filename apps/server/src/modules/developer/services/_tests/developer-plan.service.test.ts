import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { Subscription } from '../../../../../generated';
import type { PrismaService } from '../../../../core';

import { DeveloperPlanService } from '../developer-plan.service';

const createService = ({ partnerKeys, subscription }: { partnerKeys: number; subscription: boolean }) => {
  const prisma = mockDeep<PrismaService>();

  prisma.apiKey.count.mockResolvedValue(partnerKeys);
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
