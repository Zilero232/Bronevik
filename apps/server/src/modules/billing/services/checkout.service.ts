import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import type { CheckoutInput, CheckoutResult } from '../billing.types';

import { AppBadRequestException } from '../../../common/exceptions';
import { AppConfigService } from '../../../config';
import { PrismaService } from '../../../core';
import { BILLING_LINKS, PLUS_PRODUCT } from '../config';
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
    const promo = promoCode ? await this.promos.usable({ userId, code: promoCode }) : null;

    if (promo && !promo.discountPercent) {
      throw new AppBadRequestException('VALIDATION_FAILED', 'This promo code grants free days, redeem it without a payment');
    }

    const amountRub = planPrice({ plan, discountPercent: promo?.discountPercent ?? null });

    const payment = await this.yookassa.createPayment({
      amountRub,
      description: describePlan({ plan, isRenewal: false }),
      returnUrl: new URL(BILLING_LINKS.returnPath, this.config.get('WEB_URL')).href,
      idempotenceKey: randomUUID(),
      savePaymentMethod: this.subscriptions.isRecurringEnabled,
      metadata: { userId, plan, product: PLUS_PRODUCT }
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
        kind: 'subscription',
        product: PLUS_PRODUCT,
        plan,
        promoCode: promo?.code ?? null
      }
    });

    return { confirmationUrl, paymentId: payment.id };
  }
}
