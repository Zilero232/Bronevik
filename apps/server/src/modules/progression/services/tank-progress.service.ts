import type { TankChallenges, TankProgressList } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';
import { PROGRESSION_REWARDS, tankChallengeMetricSchema, tankLevelOf } from '@otmetki/schemas';
import { groupBy, sortBy } from 'remeda';

import type { UserAtInput } from '../progression.types';

import { toIsoDate, toNumber, weekWindow } from '../../../common/lib';
import { PrismaService } from '../../../core';
import { EntitlementsService } from '../../billing';
import { PROGRESS_LIST } from '../config';

@Injectable()
export class TankProgressService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly entitlements: EntitlementsService
  ) {}

  async list(userId: string): Promise<TankProgressList> {
    const [accountIds, isPlus] = await Promise.all([this.accountIds(userId), this.entitlements.isPlus(userId)]);
    const rows = await this.prisma.playerTank.findMany({
      where: { accountId: { in: accountIds }, progressXp: { gt: 0 } },
      orderBy: [{ progressXp: 'desc' }, { tankId: 'asc' }],
      take: PROGRESS_LIST.limit,
      select: { accountId: true, tankId: true, progressXp: true, progressBattles: true, updatedAt: true }
    });

    return {
      isAccruing: isPlus,
      items: rows.map((row) => {
        const { level, levelXp, nextLevelXp } = tankLevelOf(row.progressXp);

        return {
          accountId: toNumber(row.accountId),
          tankId: row.tankId,
          level,
          xp: row.progressXp,
          levelXp,
          nextLevelXp,
          battles: row.progressBattles,
          updatedAt: row.updatedAt.toISOString()
        };
      })
    };
  }

  async challenges({ userId, now }: UserAtInput): Promise<TankChallenges> {
    const { start, end } = weekWindow(now);
    const rows = await this.prisma.tankChallengeProgress.findMany({
      where: { accountId: { in: await this.accountIds(userId) }, weekStart: start },
      orderBy: [{ accountId: 'asc' }, { tankId: 'asc' }, { code: 'asc' }]
    });

    const sets = Object.values(groupBy(rows, (row) => `${row.accountId}:${row.tankId}`)).map((items) => ({
      accountId: toNumber(items[0].accountId),
      tankId: items[0].tankId,
      items: items.flatMap((row) => {
        const metric = tankChallengeMetricSchema.safeParse(row.metric);

        return metric.success
          ? [
              {
                code: row.code,
                metric: metric.data,
                target: row.target,
                threshold: row.threshold,
                progress: Math.min(row.progress, row.target),
                completedAt: row.completedAt?.toISOString() ?? null,
                shells: PROGRESSION_REWARDS.challengeShells,
                points: PROGRESSION_REWARDS.challengePoints
              }
            ]
          : [];
      })
    }));

    return {
      weekStart: toIsoDate(start) ?? '',
      endsAt: end.toISOString(),
      sets: sortBy(sets, [(set) => set.items.filter((item) => item.completedAt === null).length, 'desc'])
    };
  }

  private async accountIds(userId: string): Promise<bigint[]> {
    const links = await this.prisma.userLestaAccount.findMany({ where: { userId }, select: { accountId: true } });

    return links.map((link) => link.accountId);
  }
}
