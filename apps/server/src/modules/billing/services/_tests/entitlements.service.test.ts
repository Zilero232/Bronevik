import { addDays } from 'date-fns';
import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { Subscription } from '../../../../../generated';
import type { PrismaService } from '../../../../core';

import { EntitlementsService } from '../entitlements.service';

describe('EntitlementsService.hasPlus', () => {
  it('is true only for an entitled, running subscription', async () => {
    const prisma = mockDeep<PrismaService>();
    const entitlements = new EntitlementsService(prisma);

    prisma.subscription.findUnique.mockResolvedValueOnce(mock<Subscription>({ status: 'active', currentPeriodEnd: addDays(new Date(), 1) }));
    prisma.subscription.findUnique.mockResolvedValueOnce(mock<Subscription>({ status: 'canceled', currentPeriodEnd: addDays(new Date(), 1) }));
    prisma.subscription.findUnique.mockResolvedValueOnce(null);

    expect(await entitlements.hasPlus('u1')).toBe(true);
    expect(await entitlements.hasPlus('u1')).toBe(false);
    expect(await entitlements.hasPlus('u1')).toBe(false);
  });
});
