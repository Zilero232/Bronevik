import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { PromoCode } from '../../../../../generated';
import type { PrismaService } from '../../../../core';
import type { EntitlementsService } from '../entitlements.service';
import type { SubscriptionService } from '../subscription.service';

import { AppBadRequestException } from '../../../../common/exceptions';
import { PromoService } from '../promo.service';

const promo = mock<PromoCode>({ code: 'FREE7', product: null, discountPercent: null, freeDays: 7, maxUses: null, usedCount: 0, expiresAt: null });

describe('PromoService', () => {
  const createService = () => {
    const prisma = mockDeep<PrismaService>();
    const subscriptions = mock<SubscriptionService>();

    prisma.$transaction.mockImplementation(async (run) => (typeof run === 'function' ? run(prisma) : Promise.all(run)));

    return { service: new PromoService(prisma, subscriptions, mock<EntitlementsService>()), prisma, subscriptions };
  };

  it('looks codes up case-insensitively', async () => {
    const { service, prisma } = createService();

    prisma.promoCode.findUnique.mockResolvedValue(promo);
    prisma.promoRedemption.findUnique.mockResolvedValue(null);

    await service.usable({ userId: 'u1', code: ' free7 ' });

    expect(prisma.promoCode.findUnique).toHaveBeenCalledWith({ where: { code: 'FREE7' } });
  });

  it('grants the free days and counts the use', async () => {
    const { service, prisma, subscriptions } = createService();

    prisma.promoCode.findUnique.mockResolvedValue(promo);
    prisma.promoRedemption.findUnique.mockResolvedValue(null);

    await service.redeemFreeDays({ userId: 'u1', code: 'FREE7' });

    expect(subscriptions.grantDays).toHaveBeenCalledWith(expect.objectContaining({ userId: 'u1', days: 7 }));
    expect(prisma.promoCode.update).toHaveBeenCalledWith({ where: { code: 'FREE7' }, data: { usedCount: { increment: 1 } } });
  });

  it('refuses a code the user already redeemed', async () => {
    const { service, prisma, subscriptions } = createService();

    prisma.promoCode.findUnique.mockResolvedValue(promo);
    prisma.promoRedemption.findUnique.mockResolvedValue({ code: 'FREE7', userId: 'u1', redeemedAt: new Date() });

    await expect(service.redeemFreeDays({ userId: 'u1', code: 'FREE7' })).rejects.toBeInstanceOf(AppBadRequestException);
    expect(subscriptions.grantDays).not.toHaveBeenCalled();
  });

  it('refuses to redeem a discount code without a payment', async () => {
    const { service, prisma } = createService();

    prisma.promoCode.findUnique.mockResolvedValue({ ...promo, discountPercent: 20, freeDays: null });
    prisma.promoRedemption.findUnique.mockResolvedValue(null);

    await expect(service.redeemFreeDays({ userId: 'u1', code: 'FREE7' })).rejects.toBeInstanceOf(AppBadRequestException);
  });
});
