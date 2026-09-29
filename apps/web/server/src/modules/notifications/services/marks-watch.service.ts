import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { isNonNullish, unique, uniqueBy } from 'remeda';

import type { MarkBattle } from '../lib';
import type { PreviousMarksInput } from '../notifications.types';
import type { PreviousBattleMarksRow } from '../queries';

import { PrismaService, REDIS } from '../../../core';
import { VehicleCatalogService } from '../../reference';
import { MARKS_WATCH } from '../config';
import { detectMarkGains, markPairKey } from '../lib';
import { previousBattleMarksSql } from '../queries';
import { NotificationService } from './notification.service';

@Injectable()
export class MarksWatchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: VehicleCatalogService,
    private readonly notifications: NotificationService,
    @Inject(REDIS) private readonly redis: Redis
  ) {}

  async run(): Promise<number> {
    const cursor = await this.redis.get(MARKS_WATCH.cursorKey);

    if (!cursor) {
      await this.redis.set(MARKS_WATCH.cursorKey, new Date().toISOString());

      return 0;
    }

    const since = new Date(cursor);
    const rows = await this.prisma.battle.findMany({
      where: { receivedAt: { gt: since }, marksOnGun: { not: null } },
      orderBy: { receivedAt: 'asc' },
      take: MARKS_WATCH.batchSize,
      select: { id: true, accountId: true, tankId: true, marksOnGun: true, startedAt: true, receivedAt: true }
    });

    const last = rows.at(-1);

    if (!last) {
      return 0;
    }

    const battles: MarkBattle[] = rows.flatMap((row) => (row.marksOnGun === null ? [] : [{ ...row, marksOnGun: row.marksOnGun }]));
    const previous = await this.previousMarks({ battles, since });
    const gains = detectMarkGains({ battles, previous });

    if (gains.length > 0) {
      await this.announce(gains);
    }

    await this.redis.set(MARKS_WATCH.cursorKey, last.receivedAt.toISOString());

    return gains.length;
  }

  private async previousMarks({ battles, since }: PreviousMarksInput): Promise<Map<string, number>> {
    const pairs = uniqueBy(battles, markPairKey);

    const [earlier, tanks] = await Promise.all([
      this.prisma.$queryRaw<PreviousBattleMarksRow[]>(previousBattleMarksSql({ pairs, since })),
      this.prisma.playerTank.findMany({
        where: { OR: pairs.map(({ accountId, tankId }) => ({ accountId, tankId })) },
        select: { accountId: true, tankId: true, marksOnGun: true }
      })
    ]);

    const fromBattles = new Map(earlier.map((row) => [markPairKey(row), row.marksOnGun]));
    const fromTanks = new Map(tanks.map((tank) => [markPairKey(tank), tank.marksOnGun]));

    return new Map(
      pairs.flatMap((pair) => {
        const key = markPairKey(pair);
        const marks = fromBattles.get(key) ?? fromTanks.get(key) ?? null;

        return isNonNullish(marks) ? [[key, marks] as const] : [];
      })
    );
  }

  private async announce(gains: readonly MarkBattle[]): Promise<void> {
    const players = await this.prisma.player.findMany({
      where: { accountId: { in: unique(gains.map((gain) => gain.accountId)) } },
      select: { accountId: true, nickname: true }
    });

    const nicknames = new Map(players.map((player) => [player.accountId, player.nickname]));

    for (const gain of gains) {
      const vehicle = await this.catalog.summary(gain.tankId);

      await this.notifications.notifyAccount({
        accountId: gain.accountId,
        notification: {
          event: 'moeGained',
          accountId: Number(gain.accountId),
          nickname: nicknames.get(gain.accountId) ?? String(gain.accountId),
          tankId: gain.tankId,
          tankName: vehicle.shortName || vehicle.name,
          marks: gain.marksOnGun
        },
        dedupeKey: `moe-${gain.id}`
      });
    }
  }
}
