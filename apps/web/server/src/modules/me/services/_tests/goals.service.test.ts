import { addDays } from 'date-fns';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { AccountRating, AccountTankRating, Goal, PlayerTank, UserLestaAccount } from '../../../../../generated';
import type { PrismaService } from '../../../../core';
import type { EntitlementsService } from '../../../billing';

import { AppBadRequestException, AppForbiddenException, AppNotFoundException } from '../../../../common/exceptions';
import { GOALS } from '../../config';
import { GoalsService } from '../goals.service';

const NOW = new Date('2026-09-26T12:00:00.000Z');
const ENDS_AT = addDays(NOW, 30).toISOString();

const goalRow = (overrides: Partial<Goal> = {}): Goal =>
  mock<Goal>({
    id: 'goal',
    accountId: 7n,
    metric: 'wn8',
    tankId: null,
    target: 2000,
    baseline: 0,
    current: null,
    status: 'active',
    startsAt: NOW,
    endsAt: new Date(ENDS_AT),
    achievedAt: null,
    createdAt: NOW,
    ...overrides
  });

const createService = () => {
  const prisma = mockDeep<PrismaService>();
  const entitlements = mock<EntitlementsService>();

  prisma.$transaction.mockImplementation(async (run) => (typeof run === 'function' ? run(prisma) : Promise.all(run)));
  prisma.userLestaAccount.findUnique.mockResolvedValue(mock<UserLestaAccount>({ userId: 'user', accountId: 7n }));
  prisma.goal.count.mockResolvedValue(0);
  prisma.goal.create.mockResolvedValue(goalRow());
  prisma.accountRating.findUnique.mockResolvedValue(null);
  prisma.accountTankRating.findUnique.mockResolvedValue(null);
  prisma.playerTank.findUnique.mockResolvedValue(null);

  return { service: new GoalsService(prisma, entitlements), prisma, entitlements };
};

const created = (prisma: ReturnType<typeof createService>['prisma']) => prisma.goal.create.mock.calls[0]?.[0].data;

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('GoalsService.create', () => {
  it('rejects an end date in the past or beyond the maximum duration', async () => {
    const { service, prisma } = createService();

    await expect(service.create({ userId: 'user', accountId: 7, metric: 'wn8', target: 2000, endsAt: NOW.toISOString() })).rejects.toBeInstanceOf(
      AppBadRequestException
    );

    await expect(
      service.create({ userId: 'user', accountId: 7, metric: 'wn8', target: 2000, endsAt: addDays(NOW, GOALS.maxDurationDays + 1).toISOString() })
    ).rejects.toBeInstanceOf(AppBadRequestException);

    expect(prisma.goal.create).not.toHaveBeenCalled();
  });

  it('refuses a goal for an account linked to someone else or to nobody', async () => {
    const { service, prisma } = createService();

    prisma.userLestaAccount.findUnique.mockResolvedValueOnce(mock<UserLestaAccount>({ userId: 'other' })).mockResolvedValueOnce(null);

    await expect(service.create({ userId: 'user', accountId: 7, metric: 'wn8', target: 2000, endsAt: ENDS_AT })).rejects.toBeInstanceOf(
      AppForbiddenException
    );

    await expect(service.create({ userId: 'user', accountId: 7, metric: 'wn8', target: 2000, endsAt: ENDS_AT })).rejects.toBeInstanceOf(
      AppForbiddenException
    );
  });

  it('checks the plan limit against the active goals inside the lock', async () => {
    const { service, prisma, entitlements } = createService();

    prisma.goal.count.mockResolvedValue(3);
    entitlements.assertWithinLimit.mockRejectedValue(new AppForbiddenException('PLAN_LIMIT_REACHED', 'limit'));

    await expect(service.create({ userId: 'user', accountId: 7, metric: 'wn8', target: 2000, endsAt: ENDS_AT })).rejects.toBeInstanceOf(
      AppForbiddenException
    );

    expect(entitlements.assertWithinLimit).toHaveBeenCalledWith({ userId: 'user', key: 'goals', count: 3 });
    expect(prisma.goal.create).not.toHaveBeenCalled();
  });

  it('takes the account baseline from the overall rating', async () => {
    const { service, prisma } = createService();

    prisma.accountRating.findUnique.mockResolvedValue(mock<AccountRating>({ wn8: 1500, winRate: 51 }));

    await service.create({ userId: 'user', accountId: 7, metric: 'wn8', target: 2000, endsAt: ENDS_AT });

    expect(created(prisma)).toMatchObject({ baseline: 1500, current: 1500, tankId: null });
  });

  it('takes a tank baseline from the tank rating', async () => {
    const { service, prisma } = createService();

    prisma.accountTankRating.findUnique.mockResolvedValue(mock<AccountTankRating>({ avgDamage: 2400 }));

    await service.create({ userId: 'user', accountId: 7, metric: 'avgDamage', tankId: 1, target: 3000, endsAt: ENDS_AT });

    expect(created(prisma)).toMatchObject({ baseline: 2400, tankId: 1 });
  });

  it('has no Bronya baseline for a single tank', async () => {
    const { service, prisma } = createService();

    prisma.accountTankRating.findUnique.mockResolvedValue(mock<AccountTankRating>({ avgDamage: 2400 }));

    await service.create({ userId: 'user', accountId: 7, metric: 'broneIndex', tankId: 1, target: 70, endsAt: ENDS_AT });

    expect(created(prisma)).toMatchObject({ baseline: 0, current: null });
  });

  it('takes a MoE baseline from the mark progress and none without a tank', async () => {
    const { service, prisma } = createService();

    prisma.playerTank.findUnique.mockResolvedValue(mock<PlayerTank>({ moePercent: 72.5 }));

    await service.create({ userId: 'user', accountId: 7, metric: 'moe', tankId: 1, target: 85, endsAt: ENDS_AT });
    await service.create({ userId: 'user', accountId: 7, metric: 'moe', target: 85, endsAt: ENDS_AT });

    expect(prisma.goal.create.mock.calls[0]?.[0].data).toMatchObject({ baseline: 72.5, current: 72.5 });
    expect(prisma.goal.create.mock.calls[1]?.[0].data).toMatchObject({ baseline: 0, current: null });
  });

  it('starts at zero with an unknown current value when there is no rating yet', async () => {
    const { service, prisma } = createService();

    await service.create({ userId: 'user', accountId: 7, metric: 'battles', target: 1000, endsAt: ENDS_AT });

    expect(created(prisma)).toMatchObject({ baseline: 0, current: null });
  });
});

describe('GoalsService.update', () => {
  it('answers 404 for a goal of another user', async () => {
    const { service, prisma } = createService();

    prisma.goal.findFirst.mockResolvedValue(null);

    await expect(service.update({ userId: 'user', id: 'goal', status: 'cancelled' })).rejects.toBeInstanceOf(AppNotFoundException);
    expect(prisma.goal.update).not.toHaveBeenCalled();
  });

  it('validates a new end date before touching the goal', async () => {
    const { service, prisma } = createService();

    await expect(service.update({ userId: 'user', id: 'goal', endsAt: addDays(NOW, -1).toISOString() })).rejects.toBeInstanceOf(
      AppBadRequestException
    );

    expect(prisma.goal.findFirst).not.toHaveBeenCalled();
  });

  it('changes only the fields that were sent', async () => {
    const { service, prisma } = createService();

    prisma.goal.findFirst.mockResolvedValue(goalRow());
    prisma.goal.update.mockResolvedValue(goalRow({ target: 2500 }));

    await expect(service.update({ userId: 'user', id: 'goal', target: 2500 })).resolves.toMatchObject({ target: 2500 });
    expect(prisma.goal.update.mock.calls[0]?.[0].data).toEqual({ target: 2500 });
  });
});

describe('GoalsService.remove', () => {
  it('answers 404 when nothing of the user was removed', async () => {
    const { service, prisma } = createService();

    prisma.goal.deleteMany.mockResolvedValue({ count: 0 });

    await expect(service.remove({ userId: 'user', id: 'goal' })).rejects.toBeInstanceOf(AppNotFoundException);
  });
});
