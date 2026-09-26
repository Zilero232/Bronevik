import { Injectable } from '@nestjs/common';
import { match } from 'ts-pattern';

import type { BaselineInput, CreateGoalInput, Goal, OwnedInput, UpdateGoalInput } from '../me.types';

import { AppBadRequestException, AppForbiddenException, AppNotFoundException } from '../../../common/exceptions';
import { PrismaService } from '../../../core';
import { EntitlementsService } from '../../billing';
import { GOALS } from '../config';
import { isGoalEndAllowed, toGoal } from '../lib';

@Injectable()
export class GoalsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly entitlements: EntitlementsService
  ) {}

  async list(userId: string): Promise<Goal[]> {
    const rows = await this.prisma.goal.findMany({ where: { userId }, orderBy: [{ status: 'asc' }, { endsAt: 'asc' }] });

    return rows.map(toGoal);
  }

  async create({ userId, accountId, metric, tankId, target, endsAt }: CreateGoalInput): Promise<Goal> {
    const account = BigInt(accountId);
    const ends = new Date(endsAt);
    const now = new Date();

    if (!isGoalEndAllowed({ endsAt: ends, now })) {
      throw new AppBadRequestException('VALIDATION_FAILED', `A goal must end within ${GOALS.maxDurationDays} days from now`);
    }

    const [link, active] = await Promise.all([
      this.prisma.userLestaAccount.findUnique({ where: { accountId: account } }),
      this.prisma.goal.count({ where: { userId, status: 'active' } })
    ]);

    if (link?.userId !== userId) {
      throw new AppForbiddenException('FORBIDDEN', 'Goals can be set only for your own linked accounts');
    }

    await this.entitlements.assertWithinLimit({ userId, key: 'goals', count: active });

    const baseline = await this.baseline({ accountId: account, metric, tankId: tankId ?? null });

    const row = await this.prisma.goal.create({
      data: {
        userId,
        accountId: account,
        metric,
        tankId: tankId ?? null,
        target,
        baseline: baseline ?? 0,
        current: baseline,
        startsAt: now,
        endsAt: ends
      }
    });

    return toGoal(row);
  }

  async update({ userId, id, target, endsAt, status }: UpdateGoalInput): Promise<Goal> {
    if (endsAt !== undefined && !isGoalEndAllowed({ endsAt: new Date(endsAt), now: new Date() })) {
      throw new AppBadRequestException('VALIDATION_FAILED', `A goal must end within ${GOALS.maxDurationDays} days from now`);
    }

    const existing = await this.prisma.goal.findFirst({ where: { id, userId } });

    if (!existing) {
      throw new AppNotFoundException('NOT_FOUND', 'Goal not found');
    }

    const row = await this.prisma.goal.update({
      where: { id },
      data: {
        ...(target === undefined ? {} : { target }),
        ...(endsAt === undefined ? {} : { endsAt: new Date(endsAt) }),
        ...(status === undefined ? {} : { status })
      }
    });

    return toGoal(row);
  }

  async remove({ userId, id }: OwnedInput): Promise<void> {
    const removed = await this.prisma.goal.deleteMany({ where: { id, userId } });

    if (removed.count === 0) {
      throw new AppNotFoundException('NOT_FOUND', 'Goal not found');
    }
  }

  private async baseline({ accountId, metric, tankId }: BaselineInput): Promise<number | null> {
    if (metric === 'moe') {
      const progress = tankId === null ? null : await this.prisma.moeProgress.findUnique({ where: { accountId_tankId: { accountId, tankId } } });

      return progress?.percent ?? null;
    }

    const rating =
      tankId === null
        ? await this.prisma.accountRating.findUnique({ where: { accountId_period: { accountId, period: 'overall' } } })
        : await this.prisma.accountTankRating.findUnique({ where: { accountId_tankId_period: { accountId, tankId, period: 'overall' } } });

    if (!rating) {
      return null;
    }

    return match(metric)
      .with('winRate', () => rating.winRate)
      .with('wn8', () => rating.wn8)
      .with('avgDamage', () => rating.avgDamage)
      .with('battles', () => rating.battles)
      .with('broneIndex', () => ('broneIndex' in rating ? rating.broneIndex : null))
      .exhaustive();
  }
}
