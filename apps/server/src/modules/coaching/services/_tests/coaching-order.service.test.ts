import { describe, expect, it } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import type { CoachingOrder, CoachProfile } from '../../../../../generated';
import type { PrismaService } from '../../../../core';

import { Prisma } from '../../../../../generated';
import { AppBadRequestException, AppNotFoundException } from '../../../../common/exceptions';
import { COACHING } from '../../config';
import { CoachingOrderService } from '../coaching-order.service';

const now = new Date('2026-09-25T12:00:00Z');

const order: CoachingOrder = {
  id: '88888888-8888-4888-8888-888888888888',
  coachUserId: 'coach',
  studentUserId: 'student',
  offerId: null,
  replayId: null,
  paymentId: null,
  status: 'accepted',
  priceRub: new Prisma.Decimal(COACHING.minPriceRub),
  notes: null,
  review: null,
  score: null,
  createdAt: now,
  completedAt: null
};

const coach: CoachProfile = {
  userId: 'coach',
  accountId: 7n,
  headline: 'Heavy tanks coach',
  bio: null,
  priceRub: new Prisma.Decimal(COACHING.minPriceRub),
  tankIds: [],
  isActive: true,
  rating: null,
  ordersDone: 0,
  createdAt: now,
  updatedAt: now
};

const createService = () => {
  const prisma = mockDeep<PrismaService>();

  prisma.coachingOrder.findUniqueOrThrow.mockResolvedValue(order);

  return { service: new CoachingOrderService(prisma), prisma };
};

describe('CoachingOrderService.order', () => {
  it('refuses to let a coach hire themselves', async () => {
    const { service, prisma } = createService();

    await expect(service.order({ userId: 'coach', coachUserId: 'coach' })).rejects.toBeInstanceOf(AppBadRequestException);
    expect(prisma.coachingOrder.create).not.toHaveBeenCalled();
  });

  it('charges the coach price when no offer is chosen', async () => {
    const { service, prisma } = createService();

    prisma.coachProfile.findFirst.mockResolvedValue(coach);
    prisma.coachingOrder.create.mockResolvedValue({ ...order, status: 'requested' });

    await service.order({ userId: 'student', coachUserId: 'coach' });

    expect(prisma.coachingOrder.create).toHaveBeenCalledWith({ data: expect.objectContaining({ priceRub: coach.priceRub, offerId: null }) });
  });

  it('refuses an offer that is not active for this coach', async () => {
    const { service, prisma } = createService();

    prisma.coachProfile.findFirst.mockResolvedValue(coach);
    prisma.coachingOffer.findFirst.mockResolvedValue(null);

    await expect(service.order({ userId: 'student', coachUserId: 'coach', offerId: 'offer' })).rejects.toBeInstanceOf(AppNotFoundException);
  });
});

describe('CoachingOrderService.review', () => {
  it('recomputes the coach rating from all scored orders', async () => {
    const { service, prisma } = createService();

    prisma.coachingOrder.findFirst.mockResolvedValue({ ...order, status: 'completed' });
    prisma.coachingOrder.update.mockResolvedValue({ ...order, status: 'completed', score: 5 });
    prisma.coachingOrder.aggregate.mockResolvedValue({ _avg: { score: 4.5 }, _count: {}, _max: {}, _min: {}, _sum: {} });

    await service.review({ id: order.id, userId: 'student', score: 5 });

    expect(prisma.coachingOrder.aggregate).toHaveBeenCalledWith(expect.objectContaining({ where: { coachUserId: 'coach', score: { not: null } } }));
    expect(prisma.coachProfile.update).toHaveBeenCalledWith({ where: { userId: 'coach' }, data: { rating: 4.5 } });
  });

  it('refuses to review an order that is not completed', async () => {
    const { service, prisma } = createService();

    prisma.coachingOrder.findFirst.mockResolvedValue(null);

    await expect(service.review({ id: order.id, userId: 'student', score: 5 })).rejects.toBeInstanceOf(AppNotFoundException);
    expect(prisma.coachProfile.update).not.toHaveBeenCalled();
  });
});
