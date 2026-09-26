import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { PromoCode } from '../../../../../generated';
import type { PrismaService } from '../../../../core';
import type { EntitlementsService } from '../entitlements.service';
import type { SubscriptionService } from '../subscription.service';

import { AppBadRequestException } from '../../../../common/exceptions';
import { PROMO_REJECTION_CODE } from '../../config';
import { PromoService } from '../promo.service';

const promo = mock<PromoCode>({ code: 'FREE7', discountPercent: null, freeDays: 7, maxUses: null, usedCount: 0, expiresAt: null });

describe('PromoService.recordRedemption', () => {
  it('counts a paid redemption once even when the webhook repeats', async () => {
    const prisma = mockDeep<PrismaService>();
    const service = new PromoService(prisma, mock<SubscriptionService>(), mock<EntitlementsService>());

    prisma.promoRedemption.createMany.mockResolvedValue({ count: 0 });

    await service.recordRedemption({ db: prisma, userId: 'u1', code: 'SPRING' });

    expect(prisma.promoCode.update).not.toHaveBeenCalled();
  });
});

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

    prisma.promoCode.updateMany.mockResolvedValue({ count: 1 });
    prisma.promoRedemption.createMany.mockResolvedValue({ count: 1 });

    await service.redeemFreeDays({ userId: 'u1', code: 'FREE7' });

    expect(subscriptions.grantDays).toHaveBeenCalledWith(expect.objectContaining({ userId: 'u1', days: 7 }));
    expect(prisma.promoCode.updateMany).toHaveBeenCalledWith(expect.objectContaining({ data: { usedCount: { increment: 1 } } }));
  });

  it('refuses when a concurrent redemption took the last use', async () => {
    const { service, prisma, subscriptions } = createService();

    prisma.promoCode.findUnique.mockResolvedValue({ ...promo, maxUses: 1 });
    prisma.promoRedemption.findUnique.mockResolvedValue(null);
    prisma.promoCode.updateMany.mockResolvedValue({ count: 0 });

    await expect(service.redeemFreeDays({ userId: 'u1', code: 'FREE7' })).rejects.toMatchObject({
      response: { code: PROMO_REJECTION_CODE.exhausted }
    });

    expect(subscriptions.grantDays).not.toHaveBeenCalled();
  });

  it('refuses when a concurrent request of the same user redeemed first', async () => {
    const { service, prisma, subscriptions } = createService();

    prisma.promoCode.findUnique.mockResolvedValue(promo);
    prisma.promoRedemption.findUnique.mockResolvedValue(null);
    prisma.promoCode.updateMany.mockResolvedValue({ count: 1 });
    prisma.promoRedemption.createMany.mockResolvedValue({ count: 0 });

    await expect(service.redeemFreeDays({ userId: 'u1', code: 'FREE7' })).rejects.toMatchObject({
      response: { code: PROMO_REJECTION_CODE.alreadyRedeemed }
    });

    expect(subscriptions.grantDays).not.toHaveBeenCalled();
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

  it.each([
    ['an unknown code', null, null, PROMO_REJECTION_CODE.unknown],
    ['an expired code', { ...promo, expiresAt: new Date(Date.now() - 1000) }, null, PROMO_REJECTION_CODE.expired],
    ['a used-up code', { ...promo, maxUses: 1, usedCount: 1 }, null, PROMO_REJECTION_CODE.exhausted],
    ['a code already redeemed', promo, { code: 'FREE7', userId: 'u1', redeemedAt: new Date() }, PROMO_REJECTION_CODE.alreadyRedeemed]
  ])('names the reason for %s in the error code', async (_, row, redemption, code) => {
    const { service, prisma } = createService();

    prisma.promoCode.findUnique.mockResolvedValue(row);
    prisma.promoRedemption.findUnique.mockResolvedValue(redemption);

    await expect(service.usable({ userId: 'u1', code: 'FREE7' })).rejects.toMatchObject({ response: { code } });
  });

  it('tells a discount code apart from a free-days one', async () => {
    const { service, prisma } = createService();

    prisma.promoCode.findUnique.mockResolvedValue({ ...promo, discountPercent: 20, freeDays: null });
    prisma.promoRedemption.findUnique.mockResolvedValue(null);

    await expect(service.redeemFreeDays({ userId: 'u1', code: 'FREE7' })).rejects.toMatchObject({ response: { code: 'PROMO_CHECKOUT_ONLY' } });
  });
});
