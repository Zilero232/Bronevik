import { Injectable } from '@nestjs/common';

import type { OwnedById } from '../../community-core';
import type { CoachingOrderView, CreateOrderRequest, OrderTransition, ReviewOrderRequest } from '../coaching.types';

import { AppBadRequestException, AppForbiddenException, AppNotFoundException } from '../../../common/exceptions';
import { PrismaService } from '../../../core';
import { toOrderView } from '../lib';

@Injectable()
export class CoachingOrderService {
  constructor(private readonly prisma: PrismaService) {}

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

  async accept({ id, userId }: OwnedById): Promise<CoachingOrderView> {
    return this.transition({ id, where: { coachUserId: userId, status: 'requested' }, status: 'accepted' });
  }

  async cancel({ id, userId }: OwnedById): Promise<CoachingOrderView> {
    return this.transition({
      id,
      where: { OR: [{ coachUserId: userId }, { studentUserId: userId }], status: { in: ['requested', 'accepted'] } },
      status: 'cancelled'
    });
  }

  async complete({ id, userId }: OwnedById): Promise<CoachingOrderView> {
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
