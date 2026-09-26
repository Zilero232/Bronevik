import { PLUS_LIMITS } from '@otmetki/schemas';
import { addDays } from 'date-fns';
import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { Subscription, UserLestaAccount } from '../../../../../generated';
import type { PrismaService } from '../../../../core';

import { AppForbiddenException } from '../../../../common/exceptions';
import { EntitlementsService } from '../entitlements.service';

const createService = () => {
  const prisma = mockDeep<PrismaService>();

  prisma.userLestaAccount.findMany.mockResolvedValue([mock<UserLestaAccount>({ accountId: 1n })]);
  prisma.referral.count.mockResolvedValue(0);
  prisma.plusTrial.count.mockResolvedValue(0);

  return { service: new EntitlementsService(prisma), prisma };
};

const running = (status: Subscription['status']) => mock<Subscription>({ status, currentPeriodEnd: addDays(new Date(), 5), trialStartedAt: null });

describe('EntitlementsService.plusState', () => {
  it('reads the subscription once within the cache window', async () => {
    const { service, prisma } = createService();

    prisma.subscription.findUnique.mockResolvedValue(running('active'));

    await service.plusState('u1');
    await service.plusState('u1');

    expect(prisma.subscription.findUnique).toHaveBeenCalledTimes(1);
  });

  it('reads again after an invalidation', async () => {
    const { service, prisma } = createService();

    prisma.subscription.findUnique.mockResolvedValueOnce(running('active')).mockResolvedValueOnce(null);

    expect((await service.plusState('u1')).state).toBe('active');
    service.invalidate('u1');
    expect((await service.plusState('u1')).state).toBe('none');
  });

  it('offers the trial only to a user with an untried linked account', async () => {
    const { service, prisma } = createService();

    prisma.subscription.findUnique.mockResolvedValue(null);
    prisma.plusTrial.count.mockResolvedValueOnce(0).mockResolvedValueOnce(1);

    expect((await service.refresh('u1')).trialAvailable).toBe(true);
    expect((await service.refresh('u1')).trialAvailable).toBe(false);
  });

  it('gives a referred user the longer trial', async () => {
    const { service, prisma } = createService();

    prisma.subscription.findUnique.mockResolvedValue(null);
    prisma.referral.count.mockResolvedValue(1);

    expect((await service.refresh('u1')).trialDays).toBe(14);
  });
});

describe('EntitlementsService.assertWithinLimit', () => {
  it('asks a free user at the free limit to subscribe, naming the limit', async () => {
    const { service, prisma } = createService();

    prisma.subscription.findUnique.mockResolvedValue(null);

    const failure = service.assertWithinLimit({ userId: 'u1', key: 'goals', count: PLUS_LIMITS.goals.free });

    await expect(failure).rejects.toBeInstanceOf(AppForbiddenException);
    await expect(failure).rejects.toMatchObject({ response: { code: 'SUBSCRIPTION_REQUIRED', details: { limitKey: 'goals', limit: 3 } } });
  });

  it('lets a subscriber past the free limit up to the plus limit', async () => {
    const { service, prisma } = createService();

    prisma.subscription.findUnique.mockResolvedValue(running('trialing'));

    await expect(service.assertWithinLimit({ userId: 'u1', key: 'goals', count: PLUS_LIMITS.goals.free })).resolves.toBeUndefined();

    await expect(service.assertWithinLimit({ userId: 'u1', key: 'goals', count: PLUS_LIMITS.goals.plus })).rejects.toMatchObject({
      response: { code: 'PLAN_LIMIT_REACHED' }
    });
  });
});

describe('EntitlementsService.syncTracking', () => {
  it('pulls a subscriber forward in the poll queue and leaves a lapsed user on the normal cadence', async () => {
    const { service, prisma } = createService();

    prisma.subscription.findUnique.mockResolvedValueOnce(running('active')).mockResolvedValueOnce(null);
    prisma.player.updateMany.mockResolvedValue({ count: 1 });

    await service.syncTracking('u1');
    await service.syncTracking('u1');

    expect(prisma.player.updateMany.mock.calls[0]?.[0].data).toHaveProperty('nextPollAt');
    expect(prisma.player.updateMany.mock.calls[1]?.[0].data).not.toHaveProperty('nextPollAt');
  });
});
