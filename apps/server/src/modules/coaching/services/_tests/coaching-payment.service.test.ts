import { subDays } from 'date-fns';
import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { CoachingOrder } from '../../../../../generated';
import type { AppConfigService } from '../../../../config';
import type { PrismaService } from '../../../../core';
import type { YooKassaClient } from '../../../billing';

import { Prisma } from '../../../../../generated';
import { AppBadRequestException, AppConflictException } from '../../../../common/exceptions';
import { COACHING } from '../../config';
import { CoachingPaymentService } from '../coaching-payment.service';

const now = new Date('2026-09-25T12:00:00Z');
const webUrl = 'https://otmetki.app';

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

const createService = ({ isConfigured = true } = {}) => {
  const prisma = mockDeep<PrismaService>();
  const yookassa = mock<YooKassaClient>({ isConfigured });
  const config = mock<AppConfigService>();

  config.get.mockReturnValue(webUrl);
  prisma.coachingOrder.findUniqueOrThrow.mockResolvedValue(order);

  return { service: new CoachingPaymentService(prisma, yookassa, config), prisma, yookassa };
};

describe('CoachingPaymentService.checkout', () => {
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
    prisma.coachingOrder.updateMany.mockResolvedValue({ count: 1 });

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

    expect(prisma.coachingOrder.updateMany).toHaveBeenCalledWith({
      where: { id: order.id, status: 'accepted', paymentId: null },
      data: { paymentId: 'pay-1' }
    });

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
    expect(prisma.coachingOrder.updateMany).not.toHaveBeenCalled();
  });

  it('hands back the pending payment instead of overwriting it on a repeated checkout', async () => {
    const { service, prisma, yookassa } = createService();

    prisma.coachingOrder.findFirst.mockResolvedValue({ ...order, paymentId: 'pay-1' });

    yookassa.getPayment.mockResolvedValue({
      id: 'pay-1',
      status: 'pending',
      amount: { value: '100.00', currency: 'RUB' },
      confirmation: { confirmation_url: 'https://yookassa.ru/confirm' }
    });

    expect(await service.checkout({ id: order.id, userId: 'student' })).toEqual({
      confirmationUrl: 'https://yookassa.ru/confirm',
      paymentId: 'pay-1'
    });

    expect(yookassa.createPayment).not.toHaveBeenCalled();
    expect(prisma.coachingOrder.updateMany).not.toHaveBeenCalled();
  });

  it('opens a new payment only after the previous one was canceled', async () => {
    const { service, prisma, yookassa } = createService();

    prisma.coachingOrder.findFirst.mockResolvedValue({ ...order, paymentId: 'pay-1' });
    prisma.coachingOrder.updateMany.mockResolvedValue({ count: 1 });
    yookassa.getPayment.mockResolvedValue({ id: 'pay-1', status: 'canceled', amount: { value: '100.00', currency: 'RUB' } });

    yookassa.createPayment.mockResolvedValue({
      id: 'pay-2',
      status: 'pending',
      amount: { value: '100.00', currency: 'RUB' },
      confirmation: { confirmation_url: 'https://yookassa.ru/confirm-2' }
    });

    await service.checkout({ id: order.id, userId: 'student' });

    expect(prisma.coachingOrder.updateMany).toHaveBeenCalledWith({
      where: { id: order.id, status: 'accepted', paymentId: 'pay-1' },
      data: { paymentId: 'pay-2' }
    });
  });

  it('refuses to store a payment when the order changed in between', async () => {
    const { service, prisma, yookassa } = createService();

    prisma.coachingOrder.findFirst.mockResolvedValue(order);
    prisma.coachingOrder.updateMany.mockResolvedValue({ count: 0 });

    yookassa.createPayment.mockResolvedValue({
      id: 'pay-1',
      status: 'pending',
      amount: { value: '100.00', currency: 'RUB' },
      confirmation: { confirmation_url: 'https://yookassa.ru/confirm' }
    });

    await expect(service.checkout({ id: order.id, userId: 'student' })).rejects.toBeInstanceOf(AppConflictException);
  });
});

describe('CoachingPaymentService.settlePending', () => {
  const payment = (status: 'canceled' | 'pending' | 'succeeded') => ({
    id: 'pay-1',
    status,
    amount: { value: String(COACHING.minPriceRub), currency: COACHING.currency },
    metadata: { orderId: order.id }
  });

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

  it.each([
    ['another order', { metadata: { orderId: 'other-order' } }],
    ['a smaller amount', { amount: { value: String(COACHING.minPriceRub - 1), currency: COACHING.currency } }]
  ])('does not settle on a succeeded payment made for %s', async (_, override) => {
    const { service, prisma, yookassa } = createService();

    prisma.coachingOrder.findMany.mockResolvedValue([{ ...order, paymentId: 'pay-1' }]);
    prisma.coachingOrder.findUnique.mockResolvedValue({ ...order, paymentId: 'pay-1' });
    yookassa.getPayment.mockResolvedValue({ ...payment('succeeded'), ...override });

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
          createdAt: { gte: subDays(now, COACHING.settleLookbackDays) }
        }
      })
    );
  });
});
