import { Injectable, Logger } from '@nestjs/common';
import { addHours, subDays } from 'date-fns';

import type { Subscription } from '../../../../generated';

import { PrismaService } from '../../../core';
import { PLUS_PLANS, PLUS_PRODUCT, RENEWAL } from '../config';
import { describePlan, isPlusPlan, planPrice, renewalIdempotenceKey, YooKassaClient } from '../lib';
import { SubscriptionService } from './subscription.service';
import { WebhookService } from './webhook.service';

@Injectable()
export class RenewalService {
  private readonly logger = new Logger(RenewalService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly yookassa: YooKassaClient,
    private readonly subscriptions: SubscriptionService,
    private readonly webhooks: WebhookService
  ) {}

  async chargeDue(now = new Date()): Promise<number> {
    if (!this.subscriptions.isRecurringEnabled || !this.yookassa.isConfigured) {
      return 0;
    }

    const due = await this.prisma.subscription.findMany({
      where: {
        product: PLUS_PRODUCT,
        status: { in: ['active', 'pastDue'] },
        cancelAtPeriodEnd: false,
        savedCardId: { not: null },
        currentPeriodEnd: { lte: addHours(now, RENEWAL.leadHours), gt: subDays(now, RENEWAL.pastDueGraceDays) }
      },
      take: RENEWAL.batchSize
    });

    let charged = 0;

    for (const subscription of due) {
      try {
        charged += (await this.charge(subscription)) ? 1 : 0;
      } catch (error) {
        this.logger.warn(`renewal of ${subscription.id} failed: ${error instanceof Error ? error.message : String(error)}`);
        await this.prisma.subscription.update({ where: { id: subscription.id }, data: { status: 'pastDue' } });
      }
    }

    return charged;
  }

  async expireDue(now = new Date()): Promise<number> {
    const [lapsed, overdue, unpaid] = await this.prisma.$transaction([
      this.prisma.subscription.updateMany({
        where: {
          status: { in: ['active', 'trialing'] },
          currentPeriodEnd: { lt: now },
          OR: [{ cancelAtPeriodEnd: true }, { savedCardId: null }]
        },
        data: { status: 'expired' }
      }),
      this.prisma.subscription.updateMany({
        where: { status: 'pastDue', currentPeriodEnd: { lt: subDays(now, RENEWAL.pastDueGraceDays) } },
        data: { status: 'expired' }
      }),
      this.prisma.subscription.updateMany({
        where: { status: 'active', currentPeriodEnd: { lt: now }, cancelAtPeriodEnd: false, savedCardId: { not: null } },
        data: { status: 'pastDue' }
      })
    ]);

    return lapsed.count + overdue.count + unpaid.count;
  }

  private async charge(subscription: Subscription): Promise<boolean> {
    const pending = await this.prisma.payment.count({ where: { subscriptionId: subscription.id, isAutoCharge: true, status: 'pending' } });

    if (pending > 0 || !subscription.savedCardId || !subscription.currentPeriodEnd) {
      return false;
    }

    const plan = isPlusPlan(subscription.plan) ? subscription.plan : PLUS_PLANS.monthly.plan;
    const amountRub = planPrice({ plan, discountPercent: null });

    const payment = await this.yookassa.chargeSavedMethod({
      amountRub,
      description: describePlan({ plan, isRenewal: true }),
      paymentMethodId: subscription.savedCardId,
      idempotenceKey: renewalIdempotenceKey({ subscriptionId: subscription.id, currentPeriodEnd: subscription.currentPeriodEnd }),
      metadata: { userId: subscription.userId, plan, product: PLUS_PRODUCT, subscriptionId: subscription.id }
    });

    await this.prisma.payment.upsert({
      where: { yookassaPaymentId: payment.id },
      create: {
        userId: subscription.userId,
        subscriptionId: subscription.id,
        yookassaPaymentId: payment.id,
        amount: amountRub,
        status: 'pending',
        kind: 'subscription',
        product: PLUS_PRODUCT,
        plan,
        isAutoCharge: true
      },
      update: {}
    });

    return payment.status === 'pending' ? true : this.webhooks.settle(payment.id);
  }
}
