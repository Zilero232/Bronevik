import { Injectable, Logger } from '@nestjs/common';

import type { YooKassaWebhook } from '../lib';

import { PrismaService } from '../../../core';
import { describeCard, isPlusPlan, YooKassaClient } from '../lib';
import { EntitlementsService } from './entitlements.service';
import { PromoService } from './promo.service';
import { ReferralService } from './referral.service';
import { SubscriptionService } from './subscription.service';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly yookassa: YooKassaClient,
    private readonly subscriptions: SubscriptionService,
    private readonly entitlements: EntitlementsService,
    private readonly promos: PromoService,
    private readonly referrals: ReferralService
  ) {}

  async handle(event: YooKassaWebhook): Promise<void> {
    if (event.event.startsWith('refund.')) {
      if (event.object.payment_id) {
        await this.prisma.payment.updateMany({ where: { yookassaPaymentId: event.object.payment_id }, data: { status: 'refunded' } });
      }

      return;
    }

    await this.settle(event.object.id);
  }

  async settle(paymentId: string): Promise<boolean> {
    const row = await this.prisma.payment.findUnique({ where: { yookassaPaymentId: paymentId } });

    if (!row) {
      this.logger.warn(`webhook for an unknown payment ${paymentId}`);

      return false;
    }

    if (row.status !== 'pending') {
      return false;
    }

    const remote = await this.yookassa.getPayment(paymentId);

    if (remote.status === 'canceled') {
      await this.prisma.payment.updateMany({ where: { id: row.id, status: 'pending' }, data: { status: 'canceled' } });

      if (row.isAutoCharge && row.subscriptionId) {
        await this.prisma.subscription.update({ where: { id: row.subscriptionId }, data: { status: 'pastDue' } });
        this.entitlements.invalidate(row.userId);
      }

      return false;
    }

    if (remote.status !== 'succeeded') {
      return false;
    }

    const now = new Date();
    const plan = isPlusPlan(row.plan) ? row.plan : 'monthly';
    const method = remote.payment_method?.saved ? { id: remote.payment_method.id, title: describeCard(remote.payment_method) } : null;

    const settled = await this.prisma.$transaction(
      async (tx) => {
        const claimed = await tx.payment.updateMany({ where: { id: row.id, status: 'pending' }, data: { status: 'succeeded', paidAt: now } });

        if (claimed.count === 0) {
          return null;
        }

        const subscriptionId = await this.subscriptions.activate({ db: tx, userId: row.userId, plan, method, now });

        await tx.payment.update({ where: { id: row.id }, data: { subscriptionId } });

        if (row.promoCode) {
          await this.promos.recordRedemption({ db: tx, userId: row.userId, code: row.promoCode });
        }

        return { referrer: await this.referrals.reward({ db: tx, userId: row.userId, now }) };
      },
      { isolationLevel: 'Serializable' }
    );

    if (!settled) {
      return false;
    }

    await this.entitlements.syncTracking(row.userId);

    if (settled.referrer) {
      await this.entitlements.syncTracking(settled.referrer);
    }

    this.logger.log(`payment ${paymentId} settled for ${row.userId}`);

    return true;
  }
}
