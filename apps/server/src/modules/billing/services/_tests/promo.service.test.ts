import { addMilliseconds } from 'date-fns';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { PromoCode } from '../../../../../generated';
import type { PrismaService } from '../../../../core';
import type { EntitlementsService } from '../entitlements.service';
import type { SubscriptionService } from '../subscription.service';

import { PROMO_REJECTION_CODE } from '../../config';
import { PromoService } from '../promo.service';

const NOW = new Date('2026-09-26T12:00:00Z');

const promo = mock<PromoCode>({ code: 'FREE7', discountPercent: null, freeDays: 7, maxUses: null, usedCount: 0, expiresAt: null });

const createService = () => {
  const prisma = mockDeep<PrismaService>();
  const subscriptions = mock<SubscriptionService>();
  const entitlements = mock<EntitlementsService>();

  prisma.$transaction.mockImplementation(async (run) => (typeof run === 'function' ? run(prisma) : Promise.all(run)));

  return { service: new PromoService(prisma, subscriptions, entitlements), prisma, subscriptions, entitlements };
};

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('PromoService.normalise', () => {
  it('trims and upper-cases a code', () => {
    const { service } = createService();

    expect(service.normalise('  free7 ')).toBe('FREE7');
  });
});

describe('PromoService.usable', () => {
  it('looks codes up case-insensitively', async () => {
    const { service, prisma } = createService();

    prisma.promoCode.findUnique.mockResolvedValue(promo);
    prisma.promoRedemption.findUnique.mockResolvedValue(null);

    await expect(service.usable({ userId: 'u1', code: ' free7 ' })).resolves.toBe(promo);
  });

  it.each([
    ['an unknown code', null, null, PROMO_REJECTION_CODE.unknown],
    ['a code that expires right now', { ...promo, expiresAt: NOW }, null, PROMO_REJECTION_CODE.expired],
    ['a used-up code', { ...promo, maxUses: 1, usedCount: 1 }, null, PROMO_REJECTION_CODE.exhausted],
    ['a code already redeemed', promo, { code: 'FREE7', userId: 'u1', redeemedAt: NOW }, PROMO_REJECTION_CODE.alreadyRedeemed]
  ])('names the reason for %s in the error code', async (_, row, redemption, code) => {
    const { service, prisma } = createService();

    prisma.promoCode.findUnique.mockResolvedValue(row);
    prisma.promoRedemption.findUnique.mockResolvedValue(redemption);

    await expect(service.usable({ userId: 'u1', code: 'FREE7' })).rejects.toMatchObject({ status: 400, response: { code } });
  });

  it('accepts a code until the millisecond it expires', async () => {
    const { service, prisma } = createService();
    const expiring = { ...promo, expiresAt: addMilliseconds(NOW, 1) };

    prisma.promoCode.findUnique.mockResolvedValue(expiring);
    prisma.promoRedemption.findUnique.mockResolvedValue(null);

    await expect(service.usable({ userId: 'u1', code: 'FREE7' })).resolves.toBe(expiring);
  });
});

describe('PromoService.redeemFreeDays', () => {
  it('grants the free days of the code, counts the use and syncs tracking', async () => {
    const { service, prisma, subscriptions, entitlements } = createService();

    prisma.promoCode.findUnique.mockResolvedValue(promo);
    prisma.promoRedemption.findUnique.mockResolvedValue(null);
    prisma.promoCode.updateMany.mockResolvedValue({ count: 1 });
    prisma.promoRedemption.createMany.mockResolvedValue({ count: 1 });

    await service.redeemFreeDays({ userId: 'u1', code: 'FREE7' });

    expect(subscriptions.grantDays).toHaveBeenCalledWith(expect.objectContaining({ userId: 'u1', days: promo.freeDays, now: NOW }));
    expect(prisma.promoCode.updateMany).toHaveBeenCalledWith(expect.objectContaining({ data: { usedCount: { increment: 1 } } }));
    expect(entitlements.syncTracking).toHaveBeenCalledWith('u1');
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
    prisma.promoRedemption.findUnique.mockResolvedValue({ code: 'FREE7', userId: 'u1', redeemedAt: NOW });

    await expect(service.redeemFreeDays({ userId: 'u1', code: 'FREE7' })).rejects.toMatchObject({
      response: { code: PROMO_REJECTION_CODE.alreadyRedeemed }
    });

    expect(subscriptions.grantDays).not.toHaveBeenCalled();
  });

  it('tells a discount code apart from a free-days one', async () => {
    const { service, prisma, subscriptions } = createService();

    prisma.promoCode.findUnique.mockResolvedValue({ ...promo, discountPercent: 20, freeDays: null });
    prisma.promoRedemption.findUnique.mockResolvedValue(null);

    await expect(service.redeemFreeDays({ userId: 'u1', code: 'FREE7' })).rejects.toMatchObject({ response: { code: 'PROMO_CHECKOUT_ONLY' } });
    expect(subscriptions.grantDays).not.toHaveBeenCalled();
  });
});

describe('PromoService.recordRedemption', () => {
  it('counts a paid redemption', async () => {
    const { service, prisma } = createService();

    prisma.promoRedemption.createMany.mockResolvedValue({ count: 1 });

    await service.recordRedemption({ db: prisma, userId: 'u1', code: 'SPRING' });

    expect(prisma.promoCode.update).toHaveBeenCalledWith({ where: { code: 'SPRING' }, data: { usedCount: { increment: 1 } } });
  });

  it('counts a paid redemption once even when the webhook repeats', async () => {
    const { service, prisma } = createService();

    prisma.promoRedemption.createMany.mockResolvedValue({ count: 0 });

    await service.recordRedemption({ db: prisma, userId: 'u1', code: 'SPRING' });

    expect(prisma.promoCode.update).not.toHaveBeenCalled();
  });
});
