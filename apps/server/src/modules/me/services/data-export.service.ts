import type { AnalyticsExport, RawStatsExport } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';
import { tankLevelOf } from '@otmetki/schemas';
import { subDays } from 'date-fns';

import { toIsoDate, toNumber } from '../../../common/lib';
import { PrismaService } from '../../../core';
import { DATA_EXPORT } from '../config';

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
      accounts: players.map((player) => {
        const snapshot = latest.get(player.accountId);

        return {
          accountId: toNumber(player.accountId),
          nickname: player.nickname,
          createdAt: player.createdAt?.toISOString() ?? null,
          lastBattleAt: player.lastBattleAt?.toISOString() ?? null,
          overall: snapshot
            ? {
                capturedAt: snapshot.capturedAt.toISOString(),
                battles: snapshot.battles,
                wins: snapshot.wins,
                losses: snapshot.losses,
                draws: snapshot.draws,
                damageDealt: toNumber(snapshot.damageDealt),
                damageReceived: toNumber(snapshot.damageReceived),
                frags: snapshot.frags,
                spotted: snapshot.spotted,
                xp: toNumber(snapshot.xp),
                survived: snapshot.survived,
                hits: snapshot.hits,
                shots: snapshot.shots,
                capturePoints: snapshot.capturePoints,
                droppedCapturePoints: snapshot.droppedCapturePoints,
                globalRating: snapshot.globalRating
              }
            : null
        };
      }),
      tanks: tanks.map((tank) => ({
        accountId: toNumber(tank.accountId),
        tankId: tank.tankId,
        battles: tank.battles,
        wins: tank.wins,
        markOfMastery: tank.markOfMastery,
        marksOnGun: tank.marksOnGun,
        lastBattleAt: tank.lastBattleAt?.toISOString() ?? null
      }))
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
      this.prisma.tankProgress.findMany({ where: { accountId: { in: accountIds } }, orderBy: { xp: 'desc' } })
    ]);

    return {
      generatedAt: new Date().toISOString(),
      sessions: sessions.map((session) => ({
        accountId: toNumber(session.accountId),
        source: session.source,
        kind: session.kind,
        day: toIsoDate(session.day),
        startedAt: session.startedAt.toISOString(),
        endedAt: session.endedAt?.toISOString() ?? null,
        battles: session.battles,
        wins: session.wins,
        losses: session.losses,
        damageDealt: session.damageDealt,
        damageAssisted: session.damageAssisted,
        damageBlocked: session.damageBlocked,
        frags: session.frags,
        spotted: session.spotted,
        xp: session.xp,
        survived: session.survived,
        wn8: session.wn8,
        broneIndex: session.broneIndex
      })),
      battles: battles.map((battle) => ({
        accountId: toNumber(battle.accountId),
        arenaUniqueId: battle.arenaUniqueId.toString(),
        tankId: battle.tankId,
        arenaId: battle.arenaId,
        battleType: battle.battleType,
        result: battle.result,
        damageDealt: battle.damageDealt,
        damageAssistedRadio: battle.damageAssistedRadio,
        damageAssistedTrack: battle.damageAssistedTrack,
        damageBlocked: battle.damageBlocked,
        damageReceived: battle.damageReceived,
        spotted: battle.spotted,
        frags: battle.frags,
        xp: battle.xp,
        credits: battle.credits,
        survived: battle.survived,
        moePercent: battle.moePercent,
        moePercentDelta: battle.moePercentDelta,
        startedAt: battle.startedAt.toISOString()
      })),
      tankProgress: progress.map((row) => ({
        accountId: toNumber(row.accountId),
        tankId: row.tankId,
        level: tankLevelOf(row.xp).level,
        xp: row.xp,
        battles: row.battles
      }))
    };
  }

  private async accountIds(userId: string): Promise<bigint[]> {
    const links = await this.prisma.userLestaAccount.findMany({ where: { userId }, select: { accountId: true } });

    return links.map((link) => link.accountId);
  }
}
