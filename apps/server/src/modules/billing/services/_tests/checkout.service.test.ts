import { PLUS } from '@otmetki/schemas';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { PromoCode } from '../../../../../generated';
import type { AppConfigService } from '../../../../config';
import type { PrismaService } from '../../../../core';
import type { YooKassaClient, YooKassaPayment } from '../../lib';
import type { PromoService } from '../promo.service';
import type { SubscriptionService } from '../subscription.service';

import { BILLING_LINKS, PLUS_PLANS } from '../../config';
import { planPrice } from '../../lib';
import { CheckoutService } from '../checkout.service';

const initialCheckout = PLUS.checkoutEnabled;
const setCheckoutEnabled = (isEnabled: boolean) => Reflect.set(PLUS, 'checkoutEnabled', isEnabled);

const webUrl = 'https://otmetki.test';
const confirmationUrl = 'https://yookassa.test/confirm';

const created = (confirmation: YooKassaPayment['confirmation'] = { confirmation_url: confirmationUrl }): YooKassaPayment => ({
  id: 'pay-1',
  status: 'pending',
  amount: { value: '0.00', currency: 'RUB' },
  confirmation
});

const createService = (isRecurring = true) => {
  const prisma = mockDeep<PrismaService>();
  const config = mock<AppConfigService>();
  const yookassa = mock<YooKassaClient>();
  const promos = mock<PromoService>();
  const subscriptions = mock<SubscriptionService>({ isRecurringEnabled: isRecurring });

  config.get.mockReturnValue(webUrl);
  yookassa.createPayment.mockResolvedValue(created());

  return { service: new CheckoutService(prisma, config, yookassa, promos, subscriptions), prisma, yookassa, promos };
};

beforeEach(() => {
  setCheckoutEnabled(true);
});

afterEach(() => {
  setCheckoutEnabled(initialCheckout);
});

describe('CheckoutService.createCheckout', () => {
  it('refuses while paid checkout is closed', async () => {
    setCheckoutEnabled(false);
    const { service, yookassa } = createService();

    await expect(service.createCheckout({ userId: 'u1', plan: 'monthly' })).rejects.toMatchObject({ response: { code: 'CHECKOUT_UNAVAILABLE' } });
    expect(yookassa.createPayment).not.toHaveBeenCalled();
  });

  it('asks for the list price of the plan without a promo code', async () => {
    const { service, yookassa, promos } = createService();

    await service.createCheckout({ userId: 'u1', plan: 'yearly' });

    expect(promos.usable).not.toHaveBeenCalled();
    expect(yookassa.createPayment).toHaveBeenCalledWith(expect.objectContaining({ amountRub: PLUS_PLANS.yearly.priceRub }));
  });

  it('applies the promo discount to the price and records the code on the payment', async () => {
    const { service, yookassa, promos, prisma } = createService();

    promos.usable.mockResolvedValue(mock<PromoCode>({ code: 'SPRING', discountPercent: 25 }));

    await service.createCheckout({ userId: 'u1', plan: 'quarterly', promoCode: 'spring' });

    const amountRub = planPrice({ plan: 'quarterly', discountPercent: 25 });

    expect(amountRub).toBeLessThan(PLUS_PLANS.quarterly.priceRub);
    expect(yookassa.createPayment).toHaveBeenCalledWith(expect.objectContaining({ amountRub }));

    expect(prisma.payment.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ amount: amountRub, promoCode: 'SPRING' }) })
    );
  });

  it('sends a free-days promo code to redemption instead of a payment', async () => {
    const { service, yookassa, promos } = createService();

    promos.usable.mockResolvedValue(mock<PromoCode>({ code: 'FREE7', discountPercent: null, freeDays: 7 }));

    await expect(service.createCheckout({ userId: 'u1', plan: 'monthly', promoCode: 'FREE7' })).rejects.toMatchObject({
      response: { code: 'PROMO_REDEEM_ONLY' }
    });

    expect(yookassa.createPayment).not.toHaveBeenCalled();
  });

  it('gives every checkout its own idempotence key', async () => {
    const { service, yookassa } = createService();

    await service.createCheckout({ userId: 'u1', plan: 'monthly' });
    await service.createCheckout({ userId: 'u1', plan: 'monthly' });

    const [first, second] = yookassa.createPayment.mock.calls.map(([input]) => input.idempotenceKey);

    expect(first).toEqual(expect.any(String));
    expect(second).not.toBe(first);
  });

  it('returns the shopper to the billing page of the site', async () => {
    const { service, yookassa } = createService();

    await service.createCheckout({ userId: 'u1', plan: 'monthly' });

    expect(yookassa.createPayment).toHaveBeenCalledWith(expect.objectContaining({ returnUrl: new URL(BILLING_LINKS.returnPath, webUrl).href }));
  });

  it.each([true, false])('asks to save the card only when recurring payments are on (%s)', async (isRecurring) => {
    const { service, yookassa } = createService(isRecurring);

    await service.createCheckout({ userId: 'u1', plan: 'monthly' });

    expect(yookassa.createPayment).toHaveBeenCalledWith(expect.objectContaining({ savePaymentMethod: isRecurring }));
  });

  it('records a pending payment and hands back the confirmation link', async () => {
    const { service, prisma } = createService();

    await expect(service.createCheckout({ userId: 'u1', plan: 'monthly' })).resolves.toEqual({ confirmationUrl, paymentId: 'pay-1' });

    expect(prisma.payment.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ userId: 'u1', yookassaPaymentId: 'pay-1', status: 'pending', plan: 'monthly', promoCode: null })
      })
    );
  });

  it('fails without recording anything when YooKassa returns no confirmation link', async () => {
    const { service, yookassa, prisma } = createService();

    yookassa.createPayment.mockResolvedValue(created({}));

    await expect(service.createCheckout({ userId: 'u1', plan: 'monthly' })).rejects.toMatchObject({ response: { code: 'PAYMENT_FAILED' } });
    expect(prisma.payment.create).not.toHaveBeenCalled();
  });
});
