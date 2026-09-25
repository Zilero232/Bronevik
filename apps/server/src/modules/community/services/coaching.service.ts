import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import type {
  Checkout,
  CloseOwnInput,
  CoachesQuery,
  CoachingOrderView,
  CoachPage,
  CoachView,
  CreateOfferRequest,
  CreateOrderRequest,
  OrderTransition,
  ReviewOrderRequest,
  UpdateOfferRequest,
  UpsertCoachRequest
} from '../community.types';

import { AppBadRequestException, AppConflictException, AppForbiddenException, AppNotFoundException } from '../../../common/exceptions';
import { AppConfigService } from '../../../config';
import { PrismaService } from '../../../core';
import { YooKassaClient } from '../../billing';
import { AUTHOR_SELECT, COACHING } from '../config';
import { toCoachView, toOfferView, toOrderView } from '../lib/community-views';
import { CommunityAccountsService } from './community-accounts.service';

@Injectable()
export class CoachingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accounts: CommunityAccountsService,
    private readonly yookassa: YooKassaClient,
    private readonly config: AppConfigService
  ) {}

  async list({ tankId, limit, offset }: CoachesQuery): Promise<CoachPage> {
    const where = { isActive: true, ...(tankId === undefined ? {} : { tankIds: { has: tankId } }) };
    const [rows, total] = await Promise.all([
      this.prisma.coachProfile.findMany({
        where,
        orderBy: [{ rating: { sort: 'desc', nulls: 'last' } }, { ordersDone: 'desc' }],
        take: limit,
        skip: offset,
        include: { user: { select: AUTHOR_SELECT }, offers: { where: { isActive: true } } }
      }),
      this.prisma.coachProfile.count({ where })
    ]);

    const stats = await this.accounts.statsOf(rows.map((row) => row.accountId));

    return { items: rows.map((coach) => toCoachView({ coach, stats })), total, limit, offset };
  }

  async get(userId: string): Promise<CoachView> {
    const coach = await this.prisma.coachProfile.findUnique({
      where: { userId },
      include: { user: { select: AUTHOR_SELECT }, offers: { orderBy: { createdAt: 'asc' } } }
    });

    if (!coach) {
      throw new AppNotFoundException('NOT_FOUND', `No coach ${userId}`);
    }

    return toCoachView({ coach, stats: await this.accounts.statsOf([coach.accountId]) });
  }

  async upsertProfile({ userId, accountId, headline, bio, priceRub, tankIds, isActive }: UpsertCoachRequest): Promise<CoachView> {
    const account = await this.accounts.accountOf({ userId, accountId });
    const data = { accountId: account, headline, bio: bio ?? null, priceRub, tankIds, isActive };

    await this.prisma.coachProfile.upsert({ where: { userId }, create: { userId, ...data }, update: data });

    return this.get(userId);
  }

  async createOffer({ userId, title, description, priceRub, durationMinutes, withReplay }: CreateOfferRequest) {
    await this.get(userId);

    const offer = await this.prisma.coachingOffer.create({
      data: { coachUserId: userId, title, description: description ?? null, priceRub, durationMinutes, withReplay }
    });

    return toOfferView(offer);
  }

  async updateOffer({ id, userId, ...changes }: UpdateOfferRequest) {
    const { count } = await this.prisma.coachingOffer.updateMany({ where: { id, coachUserId: userId }, data: changes });

    if (count === 0) {
      throw new AppNotFoundException('NOT_FOUND', `No offer ${id} of yours`);
    }

    return toOfferView(await this.prisma.coachingOffer.findUniqueOrThrow({ where: { id } }));
  }

  async orders(userId: string): Promise<CoachingOrderView[]> {
    const rows = await this.prisma.coachingOrder.findMany({
      where: { OR: [{ coachUserId: userId }, { studentUserId: userId }] },
      orderBy: { createdAt: 'desc' }
    });

    return rows.map(toOrderView);
  }

  async order({ userId, coachUserId, offerId, replayId, notes }: CreateOrderRequest): Promise<CoachingOrderView> {
    if (coachUserId === userId) {
      throw new AppBadRequestException('VALIDATION_FAILED', 'You cannot hire yourself');
    }

    const coach = await this.prisma.coachProfile.findFirst({ where: { userId: coachUserId, isActive: true } });

    if (!coach) {
      throw new AppNotFoundException('NOT_FOUND', `No active coach ${coachUserId}`);
    }

    const offer = offerId ? await this.prisma.coachingOffer.findFirst({ where: { id: offerId, coachUserId, isActive: true } }) : null;

    if (offerId && !offer) {
      throw new AppNotFoundException('NOT_FOUND', `No active offer ${offerId}`);
    }

    const order = await this.prisma.coachingOrder.create({
      data: {
        coachUserId,
        studentUserId: userId,
        offerId: offer?.id ?? null,
        replayId: replayId ?? null,
        notes: notes ?? null,
        priceRub: offer?.priceRub ?? coach.priceRub
      }
    });

    return toOrderView(order);
  }

  async accept({ id, userId }: CloseOwnInput): Promise<CoachingOrderView> {
    return this.transition({ id, where: { coachUserId: userId, status: 'requested' }, status: 'accepted' });
  }

  async cancel({ id, userId }: CloseOwnInput): Promise<CoachingOrderView> {
    return this.transition({
      id,
      where: { OR: [{ coachUserId: userId }, { studentUserId: userId }], status: { in: ['requested', 'accepted'] } },
      status: 'cancelled'
    });
  }

  async complete({ id, userId }: CloseOwnInput): Promise<CoachingOrderView> {
    const order = await this.transition({ id, where: { coachUserId: userId, status: 'paid' }, status: 'completed', completedAt: new Date() });

    await this.prisma.coachProfile.update({ where: { userId }, data: { ordersDone: { increment: 1 } } });

    return order;
  }

  async review({ id, userId, score, review }: ReviewOrderRequest): Promise<CoachingOrderView> {
    const order = await this.prisma.coachingOrder.findFirst({ where: { id, studentUserId: userId, status: 'completed' } });

    if (!order) {
      throw new AppNotFoundException('NOT_FOUND', `No completed order ${id} of yours`);
    }

    const updated = await this.prisma.coachingOrder.update({ where: { id }, data: { score, review: review ?? null } });
    const average = await this.prisma.coachingOrder.aggregate({
      where: { coachUserId: order.coachUserId, score: { not: null } },
      _avg: { score: true }
    });

    await this.prisma.coachProfile.update({ where: { userId: order.coachUserId }, data: { rating: average._avg.score } });

    return toOrderView(updated);
  }

  async checkout({ id, userId }: CloseOwnInput): Promise<Checkout> {
    const order = await this.prisma.coachingOrder.findFirst({ where: { id, studentUserId: userId, status: 'accepted' } });

    if (!order) {
      throw new AppConflictException('CONFLICT', `Order ${id} is not waiting for payment`);
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

    await this.prisma.coachingOrder.update({ where: { id }, data: { paymentId: payment.id } });

    return { confirmationUrl, paymentId: payment.id };
  }

  async confirmPayment({ id, userId }: CloseOwnInput): Promise<CoachingOrderView> {
    const order = await this.prisma.coachingOrder.findFirst({ where: { id, OR: [{ studentUserId: userId }, { coachUserId: userId }] } });

    if (!order) {
      throw new AppNotFoundException('NOT_FOUND', `No order ${id} of yours`);
    }

    await this.settle(order.id);

    return toOrderView(await this.prisma.coachingOrder.findUniqueOrThrow({ where: { id } }));
  }

  async settlePending(now: Date): Promise<number> {
    const since = new Date(now.getTime() - COACHING.settleLookbackDays * 86_400_000);
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

    if (payment.status !== 'succeeded') {
      return false;
    }

    const { count } = await this.prisma.coachingOrder.updateMany({ where: { id, status: 'accepted' }, data: { status: 'paid' } });

    return count > 0;
  }

  private async transition({ id, where, status, completedAt }: OrderTransition): Promise<CoachingOrderView> {
    const { count } = await this.prisma.coachingOrder.updateMany({
      where: { id, ...where },
      data: { status, ...(completedAt ? { completedAt } : {}) }
    });

    if (count === 0) {
      throw new AppForbiddenException('FORBIDDEN', `Order ${id} cannot move to ${status}`);
    }

    return toOrderView(await this.prisma.coachingOrder.findUniqueOrThrow({ where: { id } }));
  }
}
