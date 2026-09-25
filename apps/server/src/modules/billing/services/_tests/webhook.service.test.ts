import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { Payment } from '../../../../../generated';
import type { PrismaService } from '../../../../core';
import type { YooKassaClient, YooKassaPayment } from '../../lib';
import type { EntitlementsService } from '../entitlements.service';
import type { PromoService } from '../promo.service';
import type { ReferralService } from '../referral.service';
import type { SubscriptionService } from '../subscription.service';

import { WebhookService } from '../webhook.service';

const pendingPayment = mock<Payment>({
  id: 'row',
  userId: 'u1',
  status: 'pending',
  plan: 'yearly',
  promoCode: null,
  isAutoCharge: false,
  subscriptionId: null
});

const remote = (status: YooKassaPayment['status'], saved = false): YooKassaPayment => ({
  id: 'p1',
  status,
  amount: { value: '1990.00', currency: 'RUB' },
  payment_method: { id: 'card-1', saved, card: { last4: '4242', card_type: 'Visa' } }
});

const createService = () => {
  const prisma = mockDeep<PrismaService>();
  const yookassa = mock<YooKassaClient>();
  const subscriptions = mock<SubscriptionService>();
  const entitlements = mock<EntitlementsService>();
  const promos = mock<PromoService>();
  const referrals = mock<ReferralService>();

  prisma.$transaction.mockImplementation(async (run) => (typeof run === 'function' ? run(prisma) : Promise.all(run)));
  subscriptions.activate.mockResolvedValue('sub-1');

  const service = new WebhookService(prisma, yookassa, subscriptions, entitlements, promos, referrals);

  return { service, prisma, yookassa, subscriptions, entitlements, promos, referrals };
};

describe('WebhookService.settle', () => {
  it('ignores a payment we never created', async () => {
    const { service, prisma, yookassa } = createService();

    prisma.payment.findUnique.mockResolvedValue(null);

    expect(await service.settle('p1')).toBe(false);
    expect(yookassa.getPayment).not.toHaveBeenCalled();
  });

  it('is idempotent for a payment already settled', async () => {
    const { service, prisma, yookassa } = createService();

    prisma.payment.findUnique.mockResolvedValue({ ...pendingPayment, status: 'succeeded' });

    expect(await service.settle('p1')).toBe(false);
    expect(yookassa.getPayment).not.toHaveBeenCalled();
  });

  it('trusts the re-fetched status, not the webhook body', async () => {
    const { service, prisma, yookassa, subscriptions } = createService();

    prisma.payment.findUnique.mockResolvedValue(pendingPayment);
    yookassa.getPayment.mockResolvedValue(remote('pending'));

    expect(await service.settle('p1')).toBe(false);
    expect(subscriptions.activate).not.toHaveBeenCalled();
  });

  it('activates the paid plan once, saves the card and rewards the referrer', async () => {
    const { service, prisma, yookassa, subscriptions, referrals, entitlements } = createService();

    prisma.payment.findUnique.mockResolvedValue(pendingPayment);
    prisma.payment.updateMany.mockResolvedValue({ count: 1 });
    yookassa.getPayment.mockResolvedValue(remote('succeeded', true));

    expect(await service.settle('p1')).toBe(true);

    expect(subscriptions.activate).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'u1', plan: 'yearly', method: { id: 'card-1', title: 'Visa •••• 4242' } })
    );

    expect(referrals.reward).toHaveBeenCalledWith(expect.objectContaining({ userId: 'u1' }));
    expect(entitlements.syncTracking).toHaveBeenCalledWith('u1');
  });

  it('does nothing when a concurrent webhook claimed the payment first', async () => {
    const { service, prisma, yookassa, subscriptions, entitlements } = createService();

    prisma.payment.findUnique.mockResolvedValue(pendingPayment);
    prisma.payment.updateMany.mockResolvedValue({ count: 0 });
    yookassa.getPayment.mockResolvedValue(remote('succeeded'));

    expect(await service.settle('p1')).toBe(false);
    expect(subscriptions.activate).not.toHaveBeenCalled();
    expect(entitlements.syncTracking).not.toHaveBeenCalled();
  });

  it('records the promo redemption with the payment', async () => {
    const { service, prisma, yookassa, promos } = createService();

    prisma.payment.findUnique.mockResolvedValue({ ...pendingPayment, promoCode: 'SPRING' });
    prisma.payment.updateMany.mockResolvedValue({ count: 1 });
    yookassa.getPayment.mockResolvedValue(remote('succeeded'));

    await service.settle('p1');

    expect(promos.recordRedemption).toHaveBeenCalledWith(expect.objectContaining({ userId: 'u1', code: 'SPRING' }));
  });

  it('marks a failed renewal as past due', async () => {
    const { service, prisma, yookassa } = createService();

    prisma.payment.findUnique.mockResolvedValue({ ...pendingPayment, isAutoCharge: true, subscriptionId: 'sub-1' });
    yookassa.getPayment.mockResolvedValue(remote('canceled'));

    expect(await service.settle('p1')).toBe(false);
    expect(prisma.subscription.update).toHaveBeenCalledWith({ where: { id: 'sub-1' }, data: { status: 'pastDue' } });
  });
});

describe('WebhookService.handle', () => {
  it('marks a refunded payment without settling anything', async () => {
    const { service, prisma, yookassa } = createService();

    await service.handle({ type: 'notification', event: 'refund.succeeded', object: { id: 'r1', payment_id: 'p1' } });

    expect(prisma.payment.updateMany).toHaveBeenCalledWith({ where: { yookassaPaymentId: 'p1' }, data: { status: 'refunded' } });
    expect(yookassa.getPayment).not.toHaveBeenCalled();
  });
});
