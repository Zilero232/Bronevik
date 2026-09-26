import { addDays, addMonths } from 'date-fns';
import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { Subscription } from '../../../../../generated';
import type { AppConfigService } from '../../../../config';
import type { PrismaService } from '../../../../core';
import type { EntitlementsService } from '../entitlements.service';

import { PLUS_PLANS } from '../../config';
import { SubscriptionService } from '../subscription.service';

const now = new Date('2026-09-25T12:00:00Z');

const createService = (isRecurring: boolean) => {
  const prisma = mockDeep<PrismaService>();
  const config = mock<AppConfigService>();

  config.get.mockReturnValue(isRecurring);
  prisma.subscription.upsert.mockResolvedValue(mock<Subscription>({ id: 'sub-1' }));

  return { service: new SubscriptionService(prisma, config, mock<EntitlementsService>()), prisma };
};

const upserted = (prisma: ReturnType<typeof createService>['prisma']) => prisma.subscription.upsert.mock.calls[0]?.[0];

describe('SubscriptionService.activate', () => {
  it('adds the paid months on top of a running period', async () => {
    const { service, prisma } = createService(true);
    const currentPeriodEnd = addDays(now, 10);

    prisma.subscription.findUnique.mockResolvedValue(
      mock<Subscription>({ status: 'active', currentPeriodEnd, cancelAtPeriodEnd: false, savedCardId: 'card' })
    );

    await service.activate({ db: prisma, userId: 'u1', plan: 'monthly', method: null, now });

    expect(upserted(prisma)?.update).toEqual(
      expect.objectContaining({
        currentPeriodEnd: addMonths(currentPeriodEnd, PLUS_PLANS.monthly.months),
        cancelAtPeriodEnd: false,
        status: 'active'
      })
    );
  });

  it('restarts an expired subscription from now and forgets an old cancellation', async () => {
    const { service, prisma } = createService(true);

    prisma.subscription.findUnique.mockResolvedValue(
      mock<Subscription>({ status: 'expired', currentPeriodEnd: addDays(now, -5), cancelAtPeriodEnd: true, savedCardId: null })
    );

    await service.activate({ db: prisma, userId: 'u1', plan: 'yearly', method: { id: 'card', title: 'Visa' }, now });

    expect(upserted(prisma)?.update).toEqual(
      expect.objectContaining({ currentPeriodEnd: addMonths(now, PLUS_PLANS.yearly.months), cancelAtPeriodEnd: false, savedCardId: 'card' })
    );
  });

  it('never auto-renews when recurring payments are off', async () => {
    const { service, prisma } = createService(false);

    prisma.subscription.findUnique.mockResolvedValue(null);

    await service.activate({ db: prisma, userId: 'u1', plan: 'monthly', method: { id: 'card', title: null }, now });

    expect(upserted(prisma)?.create).toEqual(expect.objectContaining({ cancelAtPeriodEnd: true }));
  });
});

describe('SubscriptionService.setAutoRenew', () => {
  it('refuses to turn renewal on without a saved card', async () => {
    const { service, prisma } = createService(true);

    prisma.subscription.findUnique.mockResolvedValue(mock<Subscription>({ id: 'sub-1', savedCardId: null }));

    await expect(service.setAutoRenew({ userId: 'u1', isEnabled: true })).rejects.toThrow();
    expect(prisma.subscription.update).not.toHaveBeenCalled();
  });
});
