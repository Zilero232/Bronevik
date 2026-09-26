import type { CheckoutResult } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';
import { PLUS } from '@otmetki/schemas';
import { randomUUID } from 'node:crypto';

import type { CheckoutInput } from '../billing.types';

import { AppBadRequestException, AppForbiddenException } from '../../../common/exceptions';
import { AppConfigService } from '../../../config';
import { PrismaService } from '../../../core';
import { BILLING_LINKS, PLUS_SUBSCRIPTION } from '../config';
import { describePlan, planPrice, YooKassaClient } from '../lib';
import { PromoService } from './promo.service';
import { SubscriptionService } from './subscription.service';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: AppConfigService,
    private readonly yookassa: YooKassaClient,
    private readonly promos: PromoService,
    private readonly subscriptions: SubscriptionService
  ) {}

  async createCheckout({ userId, plan, promoCode }: CheckoutInput): Promise<CheckoutResult> {
    if (!PLUS.checkoutEnabled) {
      throw new AppForbiddenException('CHECKOUT_UNAVAILABLE', 'Paid checkout is not open yet');
    }

    const promo = promoCode ? await this.promos.usable({ userId, code: promoCode }) : null;

    if (promo && !promo.discountPercent) {
      throw new AppBadRequestException('PROMO_REDEEM_ONLY', 'This promo code grants free days, redeem it without a payment');
    }

    const amountRub = planPrice({ plan, discountPercent: promo?.discountPercent ?? null });

    const payment = await this.yookassa.createPayment({
      amountRub,
      description: describePlan({ plan, isRenewal: false }),
      returnUrl: new URL(BILLING_LINKS.returnPath, this.config.get('WEB_URL')).href,
      idempotenceKey: randomUUID(),
      savePaymentMethod: this.subscriptions.isRecurringEnabled,
      metadata: { userId, plan, product: PLUS_SUBSCRIPTION.product }
    });

    const confirmationUrl = payment.confirmation?.confirmation_url;

    if (!confirmationUrl) {
      throw new AppBadRequestException('PAYMENT_FAILED', 'YooKassa returned no confirmation URL');
    }

    await this.prisma.payment.create({
      data: {
        userId,
        yookassaPaymentId: payment.id,
        amount: amountRub,
        status: 'pending',
        plan,
        promoCode: promo?.code ?? null
      }
    });

    return { confirmationUrl, paymentId: payment.id };
  }
}
