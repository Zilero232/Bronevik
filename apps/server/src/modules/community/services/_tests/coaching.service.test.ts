import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { CoachingOrder, CoachProfile } from '../../../../../generated';
import type { AppConfigService } from '../../../../config';
import type { PrismaService } from '../../../../core';
import type { YooKassaClient } from '../../../billing';
import type { CommunityAccountsService } from '../community-accounts.service';

import { Prisma } from '../../../../../generated';
import { AppBadRequestException, AppConflictException, AppNotFoundException } from '../../../../common/exceptions';
import { COACHING } from '../../config';
import { CoachingService } from '../coaching.service';

const now = new Date('2026-09-25T12:00:00Z');
const webUrl = 'https://bronevik.app';

const order: CoachingOrder = {
  id: '88888888-8888-4888-8888-888888888888',
  coachUserId: 'coach',
  studentUserId: 'student',
  offerId: null,
  replayId: null,
  paymentId: null,
  status: 'accepted',
  priceRub: new Prisma.Decimal(COACHING.minPriceRub),
  notes: null,
  review: null,
  score: null,
  createdAt: now,
  completedAt: null
};

const coach: CoachProfile = {
  userId: 'coach',
  accountId: 7n,
  headline: 'Heavy tanks coach',
  bio: null,
  priceRub: new Prisma.Decimal(COACHING.minPriceRub),
  tankIds: [],
  isActive: true,
  rating: null,
  ordersDone: 0,
  createdAt: now,
  updatedAt: now
};

const createService = ({ isConfigured = true } = {}) => {
  const prisma = mockDeep<PrismaService>();
  const accounts = mock<CommunityAccountsService>();
  const yookassa = mock<YooKassaClient>({ isConfigured });
  const config = mock<AppConfigService>();

  config.get.mockReturnValue(webUrl);
  prisma.coachingOrder.findUniqueOrThrow.mockResolvedValue(order);

  return { service: new CoachingService(prisma, accounts, yookassa, config), prisma, yookassa };
};

describe('CoachingService.order', () => {
  it('refuses to let a coach hire themselves', async () => {
    const { service, prisma } = createService();

    await expect(service.order({ userId: 'coach', coachUserId: 'coach' })).rejects.toBeInstanceOf(AppBadRequestException);
    expect(prisma.coachingOrder.create).not.toHaveBeenCalled();
  });

  it('charges the coach price when no offer is chosen', async () => {
    const { service, prisma } = createService();

    prisma.coachProfile.findFirst.mockResolvedValue(coach);
    prisma.coachingOrder.create.mockResolvedValue({ ...order, status: 'requested' });

    await service.order({ userId: 'student', coachUserId: 'coach' });

    expect(prisma.coachingOrder.create).toHaveBeenCalledWith({ data: expect.objectContaining({ priceRub: coach.priceRub, offerId: null }) });
  });

  it('refuses an offer that is not active for this coach', async () => {
    const { service, prisma } = createService();

    prisma.coachProfile.findFirst.mockResolvedValue(coach);
    prisma.coachingOffer.findFirst.mockResolvedValue(null);

    await expect(service.order({ userId: 'student', coachUserId: 'coach', offerId: 'offer' })).rejects.toBeInstanceOf(AppNotFoundException);
  });
});

describe('CoachingService.checkout', () => {
  it('refuses an order that is not accepted', async () => {
    const { service, prisma, yookassa } = createService();

    prisma.coachingOrder.findFirst.mockResolvedValue(null);

    await expect(service.checkout({ id: order.id, userId: 'student' })).rejects.toBeInstanceOf(AppConflictException);
    expect(prisma.coachingOrder.findFirst).toHaveBeenCalledWith({ where: { id: order.id, studentUserId: 'student', status: 'accepted' } });
    expect(yookassa.createPayment).not.toHaveBeenCalled();
  });

  it('stores the payment id and returns the confirmation url', async () => {
    const { service, prisma, yookassa } = createService();

    prisma.coachingOrder.findFirst.mockResolvedValue(order);

    yookassa.createPayment.mockResolvedValue({
      id: 'pay-1',
      status: 'pending',
      amount: { value: '100.00', currency: 'RUB' },
      confirmation: { confirmation_url: 'https://yookassa.ru/confirm' }
    });

    expect(await service.checkout({ id: order.id, userId: 'student' })).toEqual({
      confirmationUrl: 'https://yookassa.ru/confirm',
      paymentId: 'pay-1'
    });

    expect(prisma.coachingOrder.update).toHaveBeenCalledWith({ where: { id: order.id }, data: { paymentId: 'pay-1' } });

    expect(yookassa.createPayment).toHaveBeenCalledWith(
      expect.objectContaining({
        amountRub: COACHING.minPriceRub,
        returnUrl: new URL(COACHING.returnPath, webUrl).href,
        metadata: { product: COACHING.product, orderId: order.id, userId: 'student' }
      })
    );
  });

  it('does not store a payment without a confirmation url', async () => {
    const { service, prisma, yookassa } = createService();

    prisma.coachingOrder.findFirst.mockResolvedValue(order);
    yookassa.createPayment.mockResolvedValue({ id: 'pay-1', status: 'pending', amount: { value: '100.00', currency: 'RUB' } });

    await expect(service.checkout({ id: order.id, userId: 'student' })).rejects.toBeInstanceOf(AppBadRequestException);
    expect(prisma.coachingOrder.update).not.toHaveBeenCalled();
  });
});

describe('CoachingService.settlePending', () => {
  const payment = (status: 'canceled' | 'pending' | 'succeeded') => ({ id: 'pay-1', status, amount: { value: '100.00', currency: 'RUB' } });

  it('marks an order paid when YooKassa says the payment succeeded', async () => {
    const { service, prisma, yookassa } = createService();

    prisma.coachingOrder.findMany.mockResolvedValue([{ ...order, paymentId: 'pay-1' }]);
    prisma.coachingOrder.findUnique.mockResolvedValue({ ...order, paymentId: 'pay-1' });
    prisma.coachingOrder.updateMany.mockResolvedValue({ count: 1 });
    yookassa.getPayment.mockResolvedValue(payment('succeeded'));

    expect(await service.settlePending(now)).toBe(1);
    expect(prisma.coachingOrder.updateMany).toHaveBeenCalledWith({ where: { id: order.id, status: 'accepted' }, data: { status: 'paid' } });
  });

  it.each(['pending', 'canceled'] as const)('leaves the order alone while the payment is %s', async (status) => {
    const { service, prisma, yookassa } = createService();

    prisma.coachingOrder.findMany.mockResolvedValue([{ ...order, paymentId: 'pay-1' }]);
    prisma.coachingOrder.findUnique.mockResolvedValue({ ...order, paymentId: 'pay-1' });
    yookassa.getPayment.mockResolvedValue(payment(status));

    expect(await service.settlePending(now)).toBe(0);
    expect(prisma.coachingOrder.updateMany).not.toHaveBeenCalled();
  });

  it('does not ask YooKassa when it is not configured', async () => {
    const { service, prisma, yookassa } = createService({ isConfigured: false });

    prisma.coachingOrder.findMany.mockResolvedValue([{ ...order, paymentId: 'pay-1' }]);
    prisma.coachingOrder.findUnique.mockResolvedValue({ ...order, paymentId: 'pay-1' });

    expect(await service.settlePending(now)).toBe(0);
    expect(yookassa.getPayment).not.toHaveBeenCalled();
  });

  it('does not count an order another worker already settled', async () => {
    const { service, prisma, yookassa } = createService();

    prisma.coachingOrder.findMany.mockResolvedValue([{ ...order, paymentId: 'pay-1' }]);
    prisma.coachingOrder.findUnique.mockResolvedValue({ ...order, paymentId: 'pay-1' });
    prisma.coachingOrder.updateMany.mockResolvedValue({ count: 0 });
    yookassa.getPayment.mockResolvedValue(payment('succeeded'));

    expect(await service.settlePending(now)).toBe(0);
  });

  it('looks back only over the configured window', async () => {
    const { service, prisma } = createService();

    prisma.coachingOrder.findMany.mockResolvedValue([]);

    await service.settlePending(now);

    expect(prisma.coachingOrder.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          status: 'accepted',
          paymentId: { not: null },
          createdAt: { gte: new Date(now.getTime() - COACHING.settleLookbackDays * 86_400_000) }
        }
      })
    );
  });
});

describe('CoachingService.review', () => {
  it('recomputes the coach rating from all scored orders', async () => {
    const { service, prisma } = createService();

    prisma.coachingOrder.findFirst.mockResolvedValue({ ...order, status: 'completed' });
    prisma.coachingOrder.update.mockResolvedValue({ ...order, status: 'completed', score: 5 });
    prisma.coachingOrder.aggregate.mockResolvedValue({ _avg: { score: 4.5 }, _count: {}, _max: {}, _min: {}, _sum: {} });

    await service.review({ id: order.id, userId: 'student', score: 5 });

    expect(prisma.coachingOrder.aggregate).toHaveBeenCalledWith(expect.objectContaining({ where: { coachUserId: 'coach', score: { not: null } } }));
    expect(prisma.coachProfile.update).toHaveBeenCalledWith({ where: { userId: 'coach' }, data: { rating: 4.5 } });
  });

  it('refuses to review an order that is not completed', async () => {
    const { service, prisma } = createService();

    prisma.coachingOrder.findFirst.mockResolvedValue(null);

    await expect(service.review({ id: order.id, userId: 'student', score: 5 })).rejects.toBeInstanceOf(AppNotFoundException);
    expect(prisma.coachProfile.update).not.toHaveBeenCalled();
  });
});
