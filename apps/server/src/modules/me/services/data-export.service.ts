import type { AnalyticsExport, RawStatsExport } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';
import { subDays } from 'date-fns';

import { PrismaService } from '../../../core';
import { DATA_EXPORT } from '../config';
import { toAccountExport, toBattleExport, toSessionExport, toTankExport, toTankProgressExport } from '../mappers';

@Injectable()
export class DataExportService {
  constructor(private readonly prisma: PrismaService) {}

  async raw(userId: string): Promise<RawStatsExport> {
    const accountIds = await this.accountIds(userId);
    const [players, tanks, snapshots] = await Promise.all([
      this.prisma.player.findMany({ where: { accountId: { in: accountIds } }, orderBy: { accountId: 'asc' } }),
      this.prisma.playerTank.findMany({ where: { accountId: { in: accountIds } }, orderBy: [{ accountId: 'asc' }, { tankId: 'asc' }] }),
      this.prisma.accountSnapshot.findMany({
        where: { accountId: { in: accountIds }, mode: 'random' },
        orderBy: [{ accountId: 'asc' }, { capturedAt: 'desc' }],
        distinct: ['accountId']
      })
    ]);

    const latest = new Map(snapshots.map((snapshot) => [snapshot.accountId, snapshot]));

    return {
      generatedAt: new Date().toISOString(),
      accounts: players.map((player) => toAccountExport({ player, snapshot: latest.get(player.accountId) })),
      tanks: tanks.map(toTankExport)
    };
  }

  async analytics(userId: string): Promise<AnalyticsExport> {
    const accountIds = await this.accountIds(userId);
    const [sessions, battles, progress] = await Promise.all([
      this.prisma.playSession.findMany({
        where: { accountId: { in: accountIds }, startedAt: { gte: subDays(new Date(), DATA_EXPORT.sessionDays) } },
        orderBy: { startedAt: 'desc' }
      }),
      this.prisma.battle.findMany({
        where: { accountId: { in: accountIds } },
        orderBy: { startedAt: 'desc' },
        take: DATA_EXPORT.maxBattles
      }),
      this.prisma.playerTank.findMany({
        where: { accountId: { in: accountIds }, progressXp: { gt: 0 } },
        orderBy: { progressXp: 'desc' },
        select: { accountId: true, tankId: true, progressXp: true, progressBattles: true }
      })
    ]);

    return {
      generatedAt: new Date().toISOString(),
      sessions: sessions.map(toSessionExport),
      battles: battles.map(toBattleExport),
      tankProgress: progress.map(toTankProgressExport)
    };
  }

  private async accountIds(userId: string): Promise<bigint[]> {
    const links = await this.prisma.userLestaAccount.findMany({ where: { userId }, select: { accountId: true } });

    return links.map((link) => link.accountId);
  }
}
