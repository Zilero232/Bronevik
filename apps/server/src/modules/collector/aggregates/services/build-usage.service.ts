import { Injectable } from '@nestjs/common';
import { BUILD_USAGE } from '@otmetki/schemas';
import { subDays } from 'date-fns';
import { entries, unique } from 'remeda';

import type { BuildRankRow, ComputeTankUsageInput, TankRanksInput } from '../aggregates.types';
import type { CohortRank, UsageSample } from '../lib/build-usage';

import { Prisma } from '../../../../../generated';
import { toJsonValue } from '../../../../common/lib';
import { PrismaService } from '../../../../core';
import { readStoredLoadout } from '../../../mod';
import { BUILD_MODE_BONUS_TYPES, BUILD_USAGE_AGGREGATE, groupUsage, modeOfBonusType } from '../lib/build-usage';

@Injectable()
export class BuildUsageService {
  constructor(private readonly prisma: PrismaService) {}

  async compute() {
    const startedAt = new Date();
    const since = subDays(startedAt, BUILD_USAGE.windowDays);
    const battleTypes = entries(BUILD_MODE_BONUS_TYPES).flatMap(([, types]) => types.map(String));
    const gameVersion = await this.gameVersion();

    const tanks = await this.prisma.battle.findMany({
      where: { startedAt: { gte: since }, battleType: { in: battleTypes }, loadout: { not: Prisma.DbNull } },
      select: { tankId: true },
      distinct: ['tankId']
    });

    let groups = 0;

    for (const { tankId } of tanks) {
      groups += await this.computeTank({ tankId, since, battleTypes, gameVersion });
    }

    const stale = await this.prisma.buildUsageAggregate.deleteMany({ where: { gameVersion, computedAt: { lt: startedAt } } });

    return { tanks: tanks.length, groups, removed: stale.count, gameVersion };
  }

  private async computeTank({ tankId, since, battleTypes, gameVersion }: ComputeTankUsageInput): Promise<number> {
    const rows = await this.prisma.battle.findMany({
      where: { tankId, startedAt: { gte: since }, battleType: { in: battleTypes }, loadout: { not: Prisma.DbNull } },
      select: { accountId: true, battleType: true, result: true, damageDealt: true, loadout: true },
      orderBy: { startedAt: 'desc' },
      take: BUILD_USAGE_AGGREGATE.maxBattlesPerTank
    });

    const samples = rows.flatMap((row): UsageSample[] => {
      const mode = modeOfBonusType(row.battleType);
      const loadout = readStoredLoadout(row.loadout);

      return mode && loadout
        ? [{ accountId: String(row.accountId), mode, won: row.result === 'draw' ? null : row.result === 'win', damage: row.damageDealt, loadout }]
        : [];
    });

    const ranks = await this.ranks({ tankId, accountIds: unique(rows.map((row) => row.accountId)) });
    const groups = groupUsage({ samples, ranks });
    const computedAt = new Date();

    await this.prisma.$transaction(
      groups.map((group) => {
        const values = {
          battles: group.battles,
          players: group.players,
          winRate: group.winRate,
          avgDamage: group.avgDamage,
          usage: toJsonValue(group.usage),
          windowDays: BUILD_USAGE.windowDays,
          computedAt
        };

        return this.prisma.buildUsageAggregate.upsert({
          where: { tankId_mode_cohort_gameVersion: { tankId, mode: group.mode, cohort: group.cohort, gameVersion } },
          create: { tankId, mode: group.mode, cohort: group.cohort, gameVersion, ...values },
          update: values
        });
      })
    );

    return groups.length;
  }

  private async ranks({ tankId, accountIds }: TankRanksInput): Promise<CohortRank[]> {
    if (accountIds.length === 0) {
      return [];
    }

    const rows = await this.prisma.$queryRaw<BuildRankRow[]>`
      SELECT account_id, rank
      FROM (
        SELECT account_id, percent_rank() OVER (ORDER BY wn8 DESC) AS rank
        FROM account_tank_rating
        WHERE tank_id = ${tankId} AND period = 'overall' AND wn8 IS NOT NULL AND battles >= ${BUILD_USAGE_AGGREGATE.cohortMinBattles}
      ) ranked
      WHERE account_id = ANY(${accountIds}::bigint[])
    `;

    return rows.map((row) => ({ accountId: String(row.account_id), rank: Number(row.rank) }));
  }

  private async gameVersion(): Promise<string> {
    const current = await this.prisma.gameVersion.findFirst({
      where: { isCurrent: true, isTest: false },
      select: { version: true },
      orderBy: { detectedAt: 'desc' }
    });

    return current?.version ?? BUILD_USAGE_AGGREGATE.unknownVersion;
  }
}
