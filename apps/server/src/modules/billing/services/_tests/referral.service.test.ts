import { REFERRAL } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { Referral, User } from '../../../../../generated';
import type { PrismaService } from '../../../../core';
import type { SubscriptionService } from '../subscription.service';

import { AppBadRequestException, AppConflictException } from '../../../../common/exceptions';
import { ReferralService } from '../referral.service';

describe('ReferralService', () => {
  const createService = () => {
    const prisma = mockDeep<PrismaService>();
    const subscriptions = mock<SubscriptionService>();

    return { service: new ReferralService(prisma, subscriptions), prisma, subscriptions };
  };

  it('does not let a user refer themselves', async () => {
    const { service } = createService();

    await expect(service.register({ userId: 'u1', referrerId: 'u1' })).rejects.toBeInstanceOf(AppBadRequestException);
  });

  it('does not accept a referral for a user who already paid', async () => {
    const { service, prisma } = createService();

    prisma.user.findUnique.mockResolvedValue(mock<User>({ id: 'ref' }));
    prisma.payment.count.mockResolvedValue(1);

    await expect(service.register({ userId: 'u1', referrerId: 'ref' })).rejects.toBeInstanceOf(AppConflictException);
  });

  it('rewards the referrer once, on the first settled payment', async () => {
    const { service, prisma, subscriptions } = createService();
    const now = new Date();

    prisma.referral.findUnique.mockResolvedValue(mock<Referral>({ referrerUserId: 'ref', rewardedAt: null }));
    prisma.referral.updateMany.mockResolvedValueOnce({ count: 1 }).mockResolvedValueOnce({ count: 0 });

    expect(await service.reward({ db: prisma, userId: 'u1', now })).toBe('ref');
    expect(await service.reward({ db: prisma, userId: 'u1', now })).toBeNull();
    expect(subscriptions.grantDays).toHaveBeenCalledTimes(1);
    expect(subscriptions.grantDays).toHaveBeenCalledWith(expect.objectContaining({ userId: 'ref', days: REFERRAL.bonusDays }));
  });
});
