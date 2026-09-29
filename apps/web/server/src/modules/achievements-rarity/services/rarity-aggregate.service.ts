import { Injectable } from '@nestjs/common';

import type { RarityAggregateResult, StoredCountsRow, WriteAchievementsInput } from '../achievements-rarity.types';
import type { RollupRow, TankOwnersRow } from '../queries';

import { PrismaService } from '../../../core';
import { ACHIEVEMENTS_AGGREGATE } from '../config';
import { accountRollup, heldNames, obtainableNames, rarityPoints, readCounts, shareOf } from '../lib';
import { rollupUpdateSql, tankOwnersSql } from '../queries';

@Injectable()
export class RarityAggregateService {
  constructor(private readonly prisma: PrismaService) {}

  async compute(now = new Date()): Promise<RarityAggregateResult> {
    const catalog = await this.prisma.achievement.findMany({ select: { name: true, section: true } });
    const holders = new Map<string, number>();
    let sample = 0;

    for await (const chunk of this.chunks()) {
      for (const row of chunk) {
        sample += 1;

        for (const name of heldNames(readCounts(row.counts))) {
          holders.set(name, (holders.get(name) ?? 0) + 1);
        }
      }
    }

    const achievements = sample > 0 ? await this.writeAchievements({ catalog, holders, sample, now }) : 0;
    const tanks = await this.writeTanks(now);

    return { sample, achievements, tanks };
  }

  private async writeAchievements({ catalog, holders, sample, now }: WriteAchievementsInput): Promise<number> {
    const names = new Set([...catalog.map((row) => row.name), ...holders.keys()]);
    const rows = [...names].map((name) => {
      const count = holders.get(name) ?? 0;
      const share = shareOf({ part: count, whole: sample });

      return { name, holders: count, sample, share, points: rarityPoints(share), computedAt: now };
    });

    await this.prisma.$transaction([this.prisma.achievementRarity.deleteMany(), this.prisma.achievementRarity.createMany({ data: rows })]);

    const points = new Map(rows.map((row) => [row.name, row.points]));
    const obtainable = obtainableNames(catalog);

    for await (const chunk of this.chunks()) {
      const rollups: RollupRow[] = chunk.map((row) => ({
        accountId: row.accountId,
        ...accountRollup({ counts: readCounts(row.counts), points, obtainable })
      }));

      await this.prisma.$executeRaw(rollupUpdateSql({ rows: rollups, computedAt: now }));
    }

    return rows.length;
  }

  private async writeTanks(now: Date): Promise<number> {
    const owners = await this.prisma.$queryRaw<TankOwnersRow[]>(tankOwnersSql());

    await this.prisma.$transaction([
      this.prisma.tankRarity.deleteMany(),
      this.prisma.tankRarity.createMany({
        data: owners.map((row) => ({ ...row, share: shareOf({ part: row.owners, whole: row.sample }), computedAt: now }))
      })
    ]);

    return owners.length;
  }

  private async *chunks(): AsyncGenerator<StoredCountsRow[]> {
    let cursor: bigint | undefined;
    let hasMore = true;

    while (hasMore) {
      const chunk = await this.prisma.accountAchievements.findMany({
        where: cursor === undefined ? {} : { accountId: { gt: cursor } },
        orderBy: { accountId: 'asc' },
        take: ACHIEVEMENTS_AGGREGATE.chunk,
        select: { accountId: true, counts: true }
      });

      if (chunk.length > 0) {
        yield chunk;
      }

      cursor = chunk.at(-1)?.accountId;
      hasMore = chunk.length === ACHIEVEMENTS_AGGREGATE.chunk;
    }
  }
}
