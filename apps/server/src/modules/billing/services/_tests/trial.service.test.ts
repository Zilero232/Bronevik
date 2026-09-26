import type { PlusState } from '@otmetki/schemas';

import { addDays } from 'date-fns';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { UserLestaAccount } from '../../../../../generated';
import type { PrismaService } from '../../../../core';
import type { EntitlementsService } from '../entitlements.service';
import type { SubscriptionService } from '../subscription.service';

import { TrialService } from '../trial.service';

const state = (overrides: Partial<PlusState> = {}): PlusState => ({
  state: 'none',
  periodEnd: null,
  graceEndsAt: null,
  trialAvailable: true,
  trialDays: 7,
  ...overrides
});

const createService = () => {
  const prisma = mockDeep<PrismaService>();
  const entitlements = mock<EntitlementsService>();
  const subscriptions = mock<SubscriptionService>();

  prisma.$transaction.mockImplementation(async (run) => (typeof run === 'function' ? run(prisma) : Promise.all(run)));
  prisma.userLestaAccount.findMany.mockResolvedValue([mock<UserLestaAccount>({ accountId: 1n }), mock<UserLestaAccount>({ accountId: 2n })]);
  prisma.plusTrial.count.mockResolvedValue(0);

  return { service: new TrialService(prisma, entitlements, subscriptions), prisma, entitlements };
};

const now = new Date('2026-09-26T12:00:00Z');

afterEach(() => {
  vi.useRealTimers();
});

describe('TrialService.start', () => {
  it('refuses a user whose trial is not available', async () => {
    const { service, prisma, entitlements } = createService();

    entitlements.refresh.mockResolvedValue(state({ trialAvailable: false }));

    await expect(service.start('u1')).rejects.toMatchObject({ response: { code: 'TRIAL_UNAVAILABLE' } });
    expect(prisma.subscription.upsert).not.toHaveBeenCalled();
  });

  it('burns the trial for every linked account and runs it for the offered days without a card', async () => {
    const { service, prisma, entitlements } = createService();

    vi.useFakeTimers({ now });
    entitlements.refresh.mockResolvedValue(state({ trialDays: 14 }));

    await service.start('u1');

    expect(prisma.plusTrial.createMany.mock.calls[0]?.[0]?.data).toEqual([
      expect.objectContaining({ accountId: 1n, userId: 'u1' }),
      expect.objectContaining({ accountId: 2n, userId: 'u1' })
    ]);

    expect(prisma.subscription.upsert.mock.calls[0]?.[0].update).toMatchObject({
      status: 'trialing',
      cancelAtPeriodEnd: true,
      trialStartedAt: now,
      currentPeriodEnd: addDays(now, 14)
    });

    expect(entitlements.syncTracking).toHaveBeenCalledWith('u1');
  });

  it('refuses when an account got a trial meanwhile', async () => {
    const { service, prisma, entitlements } = createService();

    entitlements.refresh.mockResolvedValue(state());
    prisma.plusTrial.count.mockResolvedValue(1);

    await expect(service.start('u1')).rejects.toMatchObject({ response: { code: 'TRIAL_UNAVAILABLE' } });
    expect(prisma.plusTrial.createMany).not.toHaveBeenCalled();
  });
});
