import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { isNonNullish, uniqueBy } from 'remeda';

import type { MarkBattle } from '../lib';
import type { PreviousMarksInput } from '../notifications.types';

import { PrismaService, REDIS } from '../../../core';
import { VehicleCatalogService } from '../../reference';
import { MARKS_WATCH } from '../config';
import { detectMarkGains, markPairKey } from '../lib';
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

    for (const gain of gains) {
      await this.announce(gain);
    }

    await this.redis.set(MARKS_WATCH.cursorKey, last.receivedAt.toISOString());

    return gains.length;
  }

  private async previousMarks({ battles, since }: PreviousMarksInput): Promise<Map<string, number>> {
    const pairs = uniqueBy(battles, markPairKey);

    const known = await Promise.all(
      pairs.map(async ({ accountId, tankId }) => {
        const [battle, tank] = await Promise.all([
          this.prisma.battle.findFirst({
            where: { accountId, tankId, marksOnGun: { not: null }, receivedAt: { lte: since } },
            orderBy: { startedAt: 'desc' },
            select: { marksOnGun: true }
          }),
          this.prisma.playerTank.findUnique({ where: { accountId_tankId: { accountId, tankId } }, select: { marksOnGun: true } })
        ]);

        const marks = battle?.marksOnGun ?? tank?.marksOnGun ?? null;

        return isNonNullish(marks) ? ([markPairKey({ accountId, tankId }), marks] as const) : null;
      })
    );

    return new Map(known.filter(isNonNullish));
  }

  private async announce(gain: MarkBattle): Promise<void> {
    const [player, vehicle] = await Promise.all([
      this.prisma.player.findUnique({ where: { accountId: gain.accountId }, select: { nickname: true } }),
      this.catalog.summary(gain.tankId)
    ]);

    await this.notifications.notifyAccount({
      accountId: gain.accountId,
      notification: {
        event: 'moeGained',
        accountId: Number(gain.accountId),
        nickname: player?.nickname ?? String(gain.accountId),
        tankId: gain.tankId,
        tankName: vehicle.shortName || vehicle.name,
        marks: gain.marksOnGun
      },
      dedupeKey: `moe-${gain.id}`
    });
  }
}
