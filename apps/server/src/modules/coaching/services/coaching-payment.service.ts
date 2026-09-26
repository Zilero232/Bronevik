import { Injectable } from '@nestjs/common';
import { subDays } from 'date-fns';
import { randomUUID } from 'node:crypto';

import type { OwnedById } from '../../community-core';
import type { Checkout, CoachingOrderView, PaymentOfOrder } from '../coaching.types';

import { AppBadRequestException, AppConflictException, AppNotFoundException } from '../../../common/exceptions';
import { AppConfigService } from '../../../config';
import { PrismaService } from '../../../core';
import { YooKassaClient } from '../../billing';
import { COACHING } from '../config';
import { toOrderView } from '../lib';

@Injectable()
export class CoachingPaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly yookassa: YooKassaClient,
    private readonly config: AppConfigService
  ) {}

  async checkout({ id, userId }: OwnedById): Promise<Checkout> {
    const order = await this.prisma.coachingOrder.findFirst({ where: { id, studentUserId: userId, status: 'accepted' } });

    if (!order) {
      throw new AppConflictException('CONFLICT', `Order ${id} is not waiting for payment`);
    }

    const existing = order.paymentId ? await this.yookassa.getPayment(order.paymentId) : null;

    if (existing && existing.status !== 'canceled') {
      return this.resume({ order, payment: existing });
    }

    const payment = await this.yookassa.createPayment({
      amountRub: Number(order.priceRub),
      description: `Coaching order ${order.id}`,
      returnUrl: new URL(COACHING.returnPath, this.config.get('WEB_URL')).href,
      idempotenceKey: randomUUID(),
      savePaymentMethod: false,
      metadata: { product: COACHING.product, orderId: order.id, userId }
    });

    const confirmationUrl = payment.confirmation?.confirmation_url;

    if (!confirmationUrl) {
      throw new AppBadRequestException('PAYMENT_FAILED', 'YooKassa returned no confirmation URL');
    }

    const { count } = await this.prisma.coachingOrder.updateMany({
      where: { id, status: 'accepted', paymentId: order.paymentId },
      data: { paymentId: payment.id }
    });

    if (count === 0) {
      throw new AppConflictException('CONFLICT', `Order ${id} changed while the payment was being created`);
    }

    return { confirmationUrl, paymentId: payment.id };
  }

  async confirmPayment({ id, userId }: OwnedById): Promise<CoachingOrderView> {
    const order = await this.prisma.coachingOrder.findFirst({ where: { id, OR: [{ studentUserId: userId }, { coachUserId: userId }] } });

    if (!order) {
      throw new AppNotFoundException('NOT_FOUND', `No order ${id} of yours`);
    }

    await this.settle(order.id);

    return toOrderView(await this.prisma.coachingOrder.findUniqueOrThrow({ where: { id } }));
  }

  async settlePending(now: Date): Promise<number> {
    const since = subDays(now, COACHING.settleLookbackDays);
    const pending = await this.prisma.coachingOrder.findMany({
      where: { status: 'accepted', paymentId: { not: null }, createdAt: { gte: since } },
      select: { id: true }
    });

    let settled = 0;

    for (const { id } of pending) {
      if (await this.settle(id)) {
        settled += 1;
      }
    }

    return settled;
  }

  private async settle(id: string): Promise<boolean> {
    const order = await this.prisma.coachingOrder.findUnique({ where: { id } });

    if (!order?.paymentId || order.status !== 'accepted' || !this.yookassa.isConfigured) {
      return false;
    }

    const payment = await this.yookassa.getPayment(order.paymentId);

    if (payment.status !== 'succeeded' || !this.paysFor({ order, payment })) {
      return false;
    }

    const { count } = await this.prisma.coachingOrder.updateMany({ where: { id, status: 'accepted' }, data: { status: 'paid' } });

    return count > 0;
  }

  private async resume({ order, payment }: PaymentOfOrder): Promise<Checkout> {
    const confirmationUrl = payment.confirmation?.confirmation_url;

    if (payment.status === 'pending' && confirmationUrl) {
      return { confirmationUrl, paymentId: payment.id };
    }

    await this.settle(order.id);

    throw new AppConflictException('CONFLICT', `Order ${order.id} already has a payment in progress`);
  }

  private paysFor({ order, payment }: PaymentOfOrder): boolean {
    return (
      payment.metadata?.orderId === order.id &&
      payment.amount.currency === COACHING.currency &&
      Number(payment.amount.value) === Number(order.priceRub)
    );
  }
}
