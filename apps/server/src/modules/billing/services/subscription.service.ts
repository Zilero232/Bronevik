import { Injectable } from '@nestjs/common';
import { isPlusState, PLUS } from '@otmetki/schemas';

import type { ActivateInput, BillingStatus, GrantDaysInput, PaymentHistoryItem, SetAutoRenewInput } from '../billing.types';

import { AppBadRequestException } from '../../../common/exceptions';
import { isEntitled, toIso } from '../../../common/lib';
import { AppConfigService } from '../../../config';
import { PrismaService } from '../../../core';
import { PLUS_PLANS, PLUS_SUBSCRIPTION } from '../config';
import { cancelsAtPeriodEnd, extendPeriod } from '../lib';
import { EntitlementsService } from './entitlements.service';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: AppConfigService,
    private readonly entitlements: EntitlementsService
  ) {}

  get isRecurringEnabled(): boolean {
    return this.config.get('YOOKASSA_RECURRING');
  }

  async activate({ db, userId, plan, method, now }: ActivateInput): Promise<string> {
    const current = await db.subscription.findUnique({ where: { userId_product: { userId, product: PLUS_SUBSCRIPTION.product } } });
    const isRunning = isEntitled({ subscription: current, now });

    const data = {
      plan,
      status: 'active' as const,
      currentPeriodEnd: extendPeriod({
        currentPeriodEnd: isRunning ? (current?.currentPeriodEnd ?? null) : null,
        now,
        months: PLUS_PLANS[plan].months
      }),
      cancelAtPeriodEnd: cancelsAtPeriodEnd({
        isRecurringEnabled: this.isRecurringEnabled,
        hasMethod: Boolean(method?.id ?? current?.savedCardId),
        wasCancelled: isRunning && (current?.cancelAtPeriodEnd ?? false)
      }),
      ...(method ? { savedCardId: method.id, savedCardTitle: method.title } : {})
    };

    const subscription = await db.subscription.upsert({
      where: { userId_product: { userId, product: PLUS_SUBSCRIPTION.product } },
      create: { userId, product: PLUS_SUBSCRIPTION.product, ...data },
      update: data,
      select: { id: true }
    });

    return subscription.id;
  }

  async grantDays({ db, userId, days, now }: GrantDaysInput): Promise<void> {
    const current = await db.subscription.findUnique({ where: { userId_product: { userId, product: PLUS_SUBSCRIPTION.product } } });
    const isRunning = isEntitled({ subscription: current, now });
    const currentPeriodEnd = extendPeriod({ currentPeriodEnd: isRunning ? (current?.currentPeriodEnd ?? null) : null, now, days });

    await db.subscription.upsert({
      where: { userId_product: { userId, product: PLUS_SUBSCRIPTION.product } },
      create: { userId, product: PLUS_SUBSCRIPTION.product, status: 'active', currentPeriodEnd, cancelAtPeriodEnd: true },
      update: { currentPeriodEnd, ...(isRunning ? {} : { status: 'active' as const, cancelAtPeriodEnd: true }) }
    });
  }

  async status(userId: string): Promise<BillingStatus> {
    const [subscription, plus] = await Promise.all([
      this.prisma.subscription.findUnique({ where: { userId_product: { userId, product: PLUS_SUBSCRIPTION.product } } }),
      this.entitlements.refresh(userId)
    ]);

    return {
      isPlus: isPlusState(plus.state),
      plan: subscription?.plan ?? null,
      status: subscription?.status ?? null,
      currentPeriodEnd: toIso(subscription?.currentPeriodEnd),
      cancelAtPeriodEnd: subscription?.cancelAtPeriodEnd ?? false,
      card: subscription?.savedCardTitle ?? null,
      isRecurringAvailable: this.isRecurringEnabled,
      isCheckoutAvailable: PLUS.checkoutEnabled,
      plus,
      plans: this.plans()
    };
  }

  plans() {
    return Object.values(PLUS_PLANS).map(({ plan, months, priceRub }) => ({ plan, months, priceRub }));
  }

  async history(userId: string): Promise<PaymentHistoryItem[]> {
    const payments = await this.prisma.payment.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });

    return payments.map((payment) => ({
      id: payment.id,
      amount: payment.amount.toNumber(),
      currency: payment.currency,
      status: payment.status,
      plan: payment.plan,
      isAutoCharge: payment.isAutoCharge,
      promoCode: payment.promoCode,
      createdAt: payment.createdAt.toISOString(),
      paidAt: toIso(payment.paidAt)
    }));
  }

  async setAutoRenew({ userId, isEnabled }: SetAutoRenewInput): Promise<BillingStatus> {
    const subscription = await this.prisma.subscription.findUnique({ where: { userId_product: { userId, product: PLUS_SUBSCRIPTION.product } } });

    if (!subscription) {
      throw new AppBadRequestException('SUBSCRIPTION_REQUIRED', 'There is no Plus subscription to change');
    }

    if (isEnabled && (!this.isRecurringEnabled || !subscription.savedCardId)) {
      throw new AppBadRequestException('PAYMENT_REQUIRED', 'Auto-renewal needs a saved card');
    }

    await this.prisma.subscription.update({ where: { id: subscription.id }, data: { cancelAtPeriodEnd: !isEnabled } });

    return this.status(userId);
  }
}
