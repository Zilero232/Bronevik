import type { PlusState } from '@otmetki/schemas';

import { addDays, addMonths } from 'date-fns';
import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { Payment, Subscription } from '../../../../../generated';
import type { AppConfigService } from '../../../../config';
import type { PrismaService } from '../../../../core';
import type { EntitlementsService } from '../entitlements.service';

import { Prisma } from '../../../../../generated';
import { PLUS_PLANS } from '../../config';
import { SubscriptionService } from '../subscription.service';

const now = new Date('2026-09-25T12:00:00Z');

const plusState = (state: PlusState['state']): PlusState => ({ state, periodEnd: null, graceEndsAt: null, trialAvailable: false, trialDays: 7 });

const createService = (isRecurring: boolean) => {
  const prisma = mockDeep<PrismaService>();
  const config = mock<AppConfigService>();
  const entitlements = mock<EntitlementsService>();

  config.get.mockReturnValue(isRecurring);
  prisma.subscription.upsert.mockResolvedValue(mock<Subscription>({ id: 'sub-1' }));
  entitlements.refresh.mockResolvedValue(plusState('none'));

  return { service: new SubscriptionService(prisma, config, entitlements), prisma, entitlements };
};

const paymentRow = (overrides: Partial<Payment>): Payment => ({
  id: 'p',
  userId: 'u1',
  subscriptionId: null,
  yookassaPaymentId: 'yk',
  amount: new Prisma.Decimal(0),
  currency: 'RUB',
  status: 'pending',
  plan: 'monthly',
  isAutoCharge: false,
  promoCode: null,
  metadata: null,
  paidAt: null,
  createdAt: now,
  ...overrides
});

const storedSubscription = (overrides: Partial<Subscription>) =>
  mock<Subscription>({
    id: 'sub-1',
    plan: 'monthly',
    status: 'active',
    currentPeriodEnd: addDays(now, 5),
    cancelAtPeriodEnd: false,
    savedCardId: null,
    savedCardTitle: null,
    ...overrides
  });

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

  it('keeps the cancellation of a running subscription and its stored card', async () => {
    const { service, prisma } = createService(true);

    prisma.subscription.findUnique.mockResolvedValue(
      mock<Subscription>({ status: 'active', currentPeriodEnd: addDays(now, 3), cancelAtPeriodEnd: true, savedCardId: 'card' })
    );

    await service.activate({ db: prisma, userId: 'u1', plan: 'monthly', method: null, now });

    expect(upserted(prisma)?.update).toEqual(expect.objectContaining({ cancelAtPeriodEnd: true }));
    expect(upserted(prisma)?.update).not.toHaveProperty('savedCardId');
  });

  it('does not auto-renew a subscriber without any card even when recurring payments are on', async () => {
    const { service, prisma } = createService(true);

    prisma.subscription.findUnique.mockResolvedValue(null);

    await service.activate({ db: prisma, userId: 'u1', plan: 'monthly', method: null, now });

    expect(upserted(prisma)?.create).toEqual(expect.objectContaining({ cancelAtPeriodEnd: true }));
  });

  it('auto-renews through the card stored on a lapsed cancelled subscription', async () => {
    const { service, prisma } = createService(true);

    prisma.subscription.findUnique.mockResolvedValue(
      mock<Subscription>({ status: 'expired', currentPeriodEnd: addDays(now, -1), cancelAtPeriodEnd: true, savedCardId: 'card' })
    );

    await service.activate({ db: prisma, userId: 'u1', plan: 'monthly', method: null, now });

    expect(upserted(prisma)?.update).toEqual(
      expect.objectContaining({ cancelAtPeriodEnd: false, currentPeriodEnd: addMonths(now, PLUS_PLANS.monthly.months) })
    );
  });

  it('returns the id of the stored subscription', async () => {
    const { service, prisma } = createService(true);

    prisma.subscription.findUnique.mockResolvedValue(null);

    await expect(service.activate({ db: prisma, userId: 'u1', plan: 'monthly', method: null, now })).resolves.toBe('sub-1');
  });
});

describe('SubscriptionService.grantDays', () => {
  it('adds the days on top of a running period without touching its renewal', async () => {
    const { service, prisma } = createService(true);
    const currentPeriodEnd = addDays(now, 10);

    prisma.subscription.findUnique.mockResolvedValue(mock<Subscription>({ status: 'active', currentPeriodEnd, cancelAtPeriodEnd: false }));

    await service.grantDays({ db: prisma, userId: 'u1', days: 7, now });

    expect(upserted(prisma)?.update).toEqual({ currentPeriodEnd: addDays(currentPeriodEnd, 7) });
  });

  it('starts a non-renewing period from now for a lapsed subscription', async () => {
    const { service, prisma } = createService(true);

    prisma.subscription.findUnique.mockResolvedValue(
      mock<Subscription>({ status: 'expired', currentPeriodEnd: addDays(now, -3), cancelAtPeriodEnd: false })
    );

    await service.grantDays({ db: prisma, userId: 'u1', days: 7, now });

    expect(upserted(prisma)?.update).toEqual({ currentPeriodEnd: addDays(now, 7), status: 'active', cancelAtPeriodEnd: true });
  });

  it('creates a non-renewing subscription for a user who never had one', async () => {
    const { service, prisma } = createService(true);

    prisma.subscription.findUnique.mockResolvedValue(null);

    await service.grantDays({ db: prisma, userId: 'u1', days: 30, now });

    expect(upserted(prisma)?.create).toEqual(
      expect.objectContaining({ currentPeriodEnd: addDays(now, 30), status: 'active', cancelAtPeriodEnd: true })
    );
  });

  it('keeps the cancellation of a running subscription when days are granted', async () => {
    const { service, prisma } = createService(true);
    const currentPeriodEnd = addDays(now, 2);

    prisma.subscription.findUnique.mockResolvedValue(mock<Subscription>({ status: 'active', currentPeriodEnd, cancelAtPeriodEnd: true }));

    await service.grantDays({ db: prisma, userId: 'u1', days: 3, now });

    expect(upserted(prisma)?.update).not.toHaveProperty('cancelAtPeriodEnd');
  });

  it('writes through the transaction client it is given', async () => {
    const { service, prisma } = createService(true);
    const db = mockDeep<PrismaService>();

    db.subscription.findUnique.mockResolvedValue(null);

    await service.grantDays({ db, userId: 'u1', days: 7, now });

    expect(db.subscription.upsert).toHaveBeenCalledOnce();
    expect(prisma.subscription.upsert).not.toHaveBeenCalled();
  });
});

describe('SubscriptionService.status', () => {
  it('describes a user without a subscription as having nothing to renew', async () => {
    const { service, prisma } = createService(false);

    prisma.subscription.findUnique.mockResolvedValue(null);

    await expect(service.status('u1')).resolves.toEqual(
      expect.objectContaining({
        isPlus: false,
        plan: null,
        status: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        card: null,
        isRecurringAvailable: false
      })
    );
  });

  it('reports Plus from the refreshed entitlement state together with the stored card', async () => {
    const { service, prisma, entitlements } = createService(true);
    const currentPeriodEnd = addDays(now, 5);

    entitlements.refresh.mockResolvedValue(plusState('trial'));

    prisma.subscription.findUnique.mockResolvedValue(
      storedSubscription({ plan: 'quarterly', status: 'trialing', currentPeriodEnd, cancelAtPeriodEnd: true, savedCardTitle: 'Visa 4242' })
    );

    await expect(service.status('u1')).resolves.toEqual(
      expect.objectContaining({ isPlus: true, plan: 'quarterly', currentPeriodEnd: currentPeriodEnd.toISOString(), card: 'Visa 4242' })
    );
  });

  it('lists every plan with its price', async () => {
    const { service, prisma } = createService(true);

    prisma.subscription.findUnique.mockResolvedValue(null);

    const { plans } = await service.status('u1');

    expect(plans).toEqual(Object.values(PLUS_PLANS).map(({ plan, priceRub }) => expect.objectContaining({ plan, priceRub })));
  });
});

describe('SubscriptionService.history', () => {
  it('serialises payments with a numeric amount and ISO dates', async () => {
    const { service, prisma } = createService(true);
    const createdAt = new Date('2026-09-01T10:00:00Z');

    prisma.payment.findMany.mockResolvedValue([
      paymentRow({ id: 'p1', amount: new Prisma.Decimal(PLUS_PLANS.monthly.priceRub), status: 'succeeded', createdAt, paidAt: createdAt }),
      paymentRow({ id: 'p2', amount: new Prisma.Decimal(PLUS_PLANS.yearly.priceRub), createdAt })
    ]);

    await expect(service.history('u1')).resolves.toEqual([
      expect.objectContaining({ id: 'p1', amount: PLUS_PLANS.monthly.priceRub, createdAt: createdAt.toISOString(), paidAt: createdAt.toISOString() }),
      expect.objectContaining({ id: 'p2', amount: PLUS_PLANS.yearly.priceRub, paidAt: null })
    ]);
  });
});

describe('SubscriptionService.setAutoRenew', () => {
  it('refuses to turn renewal on without a saved card', async () => {
    const { service, prisma } = createService(true);

    prisma.subscription.findUnique.mockResolvedValue(storedSubscription({ savedCardId: null }));

    await expect(service.setAutoRenew({ userId: 'u1', isEnabled: true })).rejects.toThrow();
    expect(prisma.subscription.update).not.toHaveBeenCalled();
  });

  it('refuses when the user has no subscription', async () => {
    const { service, prisma } = createService(true);

    prisma.subscription.findUnique.mockResolvedValue(null);

    await expect(service.setAutoRenew({ userId: 'u1', isEnabled: false })).rejects.toMatchObject({ response: { code: 'SUBSCRIPTION_REQUIRED' } });
  });

  it('refuses to turn renewal on while recurring payments are off even with a card', async () => {
    const { service, prisma } = createService(false);

    prisma.subscription.findUnique.mockResolvedValue(storedSubscription({ savedCardId: 'card' }));

    await expect(service.setAutoRenew({ userId: 'u1', isEnabled: true })).rejects.toMatchObject({ response: { code: 'PAYMENT_REQUIRED' } });
    expect(prisma.subscription.update).not.toHaveBeenCalled();
  });

  it('turns renewal on for a saved card', async () => {
    const { service, prisma } = createService(true);

    prisma.subscription.findUnique.mockResolvedValue(storedSubscription({ savedCardId: 'card' }));

    await service.setAutoRenew({ userId: 'u1', isEnabled: true });

    expect(prisma.subscription.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'sub-1' }, data: { cancelAtPeriodEnd: false } }));
  });

  it('returns the billing status refreshed after the change', async () => {
    const { service, prisma, entitlements } = createService(true);

    prisma.subscription.findUnique.mockResolvedValue(storedSubscription({ savedCardId: 'card', savedCardTitle: 'Visa 4242' }));
    entitlements.refresh.mockResolvedValue(plusState('active'));

    await expect(service.setAutoRenew({ userId: 'u1', isEnabled: true })).resolves.toEqual(
      expect.objectContaining({ isPlus: true, card: 'Visa 4242' })
    );

    expect(entitlements.refresh).toHaveBeenCalledWith('u1');
  });

  it('lets a user cancel renewal without a card', async () => {
    const { service, prisma } = createService(false);

    prisma.subscription.findUnique.mockResolvedValue(storedSubscription({ savedCardId: null }));

    await service.setAutoRenew({ userId: 'u1', isEnabled: false });

    expect(prisma.subscription.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'sub-1' }, data: { cancelAtPeriodEnd: true } }));
  });
});
