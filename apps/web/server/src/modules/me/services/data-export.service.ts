import type { AnalyticsExport, RawStatsExport } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';
import { subDays } from 'date-fns';

import { PrismaService, UserLestaAccountsService } from '../../../core';
import { ModSyncService } from '../../mod-sync';
import { DATA_EXPORT } from '../config';
import { toAccountExport, toBattleExport, toSessionExport, toTankExport, toTankProgressExport } from '../mappers';

@Injectable()
export class DataExportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly lestaAccounts: UserLestaAccountsService,
    private readonly modSync: ModSyncService
  ) {}

  async raw(userId: string): Promise<RawStatsExport> {
    const accountIds = await this.lestaAccounts.accountIds(userId);
    const [players, tanks, snapshots, modSync] = await Promise.all([
      this.prisma.player.findMany({ where: { accountId: { in: accountIds } }, orderBy: { accountId: 'asc' } }),
      this.prisma.playerTank.findMany({ where: { accountId: { in: accountIds } }, orderBy: [{ accountId: 'asc' }, { tankId: 'asc' }] }),
      this.prisma.accountSnapshot.findMany({
        where: { accountId: { in: accountIds }, mode: 'random' },
        orderBy: [{ accountId: 'asc' }, { capturedAt: 'desc' }],
        distinct: ['accountId']
      }),
      this.modSync.libraries(userId)
    ]);

    const latest = new Map(snapshots.map((snapshot) => [snapshot.accountId, snapshot]));

    return {
      generatedAt: new Date().toISOString(),
      accounts: players.map((player) => toAccountExport({ player, snapshot: latest.get(player.accountId) })),
      tanks: tanks.map(toTankExport),
      modSync
    };
  }

  async analytics(userId: string): Promise<AnalyticsExport> {
    const accountIds = await this.lestaAccounts.accountIds(userId);
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
}
