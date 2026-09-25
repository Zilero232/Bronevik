import { Injectable } from '@nestjs/common';

import type { AccountRatingsPayload } from '../../contracts';

import { PrismaService } from '../../../../core';
import { AGGREGATES } from '../config';
import { buildAccountRatings } from '../lib/account-ratings';
import { ReferenceTablesService } from './reference-tables.service';

@Injectable()
export class AccountRatingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tables: ReferenceTablesService
  ) {}

  async compute({ accountId }: AccountRatingsPayload) {
    const id = BigInt(accountId);
    const player = await this.prisma.player.findUnique({ where: { accountId: id }, select: { accountId: true } });

    if (!player) {
      return { skipped: true };
    }

    const mode = await this.ratingMode(id);

    if (!mode) {
      return { skipped: true };
    }

    const [accountSnapshots, tankSnapshots, tables] = await Promise.all([
      this.prisma.accountSnapshot.findMany({
        where: { accountId: id, mode },
        select: { capturedAt: true, battles: true },
        orderBy: { capturedAt: 'asc' }
      }),
      this.prisma.tankSnapshot.findMany({
        where: { accountId: id, mode },
        select: {
          tankId: true,
          capturedAt: true,
          battles: true,
          wins: true,
          losses: true,
          damageDealt: true,
          damageReceived: true,
          frags: true,
          spotted: true,
          xp: true,
          survived: true,
          hits: true,
          shots: true,
          capturePoints: true,
          droppedCapturePoints: true
        }
      }),
      this.tables.tables()
    ]);

    const { ratings, tankRatings } = buildAccountRatings({ accountId: id, accountSnapshots, tankSnapshots, ...tables, now: new Date() });

    await this.prisma.$transaction([
      this.prisma.accountRating.deleteMany({ where: { accountId: id } }),
      this.prisma.accountRating.createMany({ data: ratings }),
      this.prisma.accountTankRating.deleteMany({ where: { accountId: id } }),
      this.prisma.accountTankRating.createMany({ data: tankRatings })
    ]);

    return { mode, periods: ratings.length, tanks: tankRatings.length };
  }

  private async ratingMode(accountId: bigint) {
    for (const mode of AGGREGATES.ratingModes) {
      const exists = await this.prisma.tankSnapshot.findFirst({ where: { accountId, mode }, select: { tankId: true } });

      if (exists) {
        return mode;
      }
    }

    return null;
  }
}
