import { Injectable } from '@nestjs/common';
import { uniqueBy } from 'remeda';

import type { AccountRatingsPayload } from '../../contracts';

import { PrismaService } from '../../../../core';
import { AGGREGATES } from '../config';
import { buildAccountRatings } from '../lib/account-ratings';
import { TANK_TOTALS_SELECT } from '../selects';
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

    const [accountSnapshots, history, latest, tables] = await Promise.all([
      this.prisma.accountSnapshot.findMany({
        where: { accountId: id, mode },
        select: { capturedAt: true, battles: true },
        orderBy: { capturedAt: 'asc' }
      }),
      this.prisma.tankSnapshot.findMany({ where: { accountId: id, mode }, select: TANK_TOTALS_SELECT }),
      this.prisma.tankSnapshotLatest.findMany({ where: { accountId: id, mode }, select: TANK_TOTALS_SELECT }),
      this.tables.tables()
    ]);

    const tankSnapshots = uniqueBy([...history, ...latest], (row) => `${row.tankId}:${row.capturedAt.getTime()}`);
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
      const exists = await this.prisma.tankSnapshotLatest.findFirst({ where: { accountId, mode }, select: { tankId: true } });

      if (exists) {
        return mode;
      }
    }

    return null;
  }
}
