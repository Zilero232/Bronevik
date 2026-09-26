import { Injectable } from '@nestjs/common';
import { addDays, fromUnixTime } from 'date-fns';
import { groupBy } from 'remeda';

import type { StatsMode, TrackingTier } from '../../../../../generated';
import type { TankBaseline } from '../lib/account-diff';
import type { AccountChanges, LatestTankSnapshotsInput, MarkSyncedInput, PollStorePort, StoredPlayer, UpsertPlayerInput } from '../lib/poll-pipeline';
import type { SnapshotMode, TankSnapshotRow } from '../lib/snapshots';

import { PrismaService } from '../../../../core';
import { PurgeGuardService } from '../../purge';
import { TRACKING } from '../config';
import { gainedMarks, snapshotMarks } from '../lib/marks-gain';
import { nextPollAt } from '../lib/poll-schedule';
import { isSnapshotMode } from '../lib/snapshots';
import { TrackingAnnounceService } from './tracking-announce.service';

@Injectable()
export class TrackingStoreService implements PollStorePort {
  constructor(
    private readonly prisma: PrismaService,
    private readonly guard: PurgeGuardService,
    private readonly announce: TrackingAnnounceService
  ) {}

  async blockedAccounts(accountIds: readonly number[]): Promise<Set<number>> {
    return this.guard.blocked(accountIds);
  }

  async loadPlayers(accountIds: readonly number[]): Promise<StoredPlayer[]> {
    const players = await this.prisma.player.findMany({
      where: { accountId: { in: accountIds.map(BigInt) } },
      select: { accountId: true, clanId: true, lastBattleAt: true, lastPolledAt: true, trackingTier: true }
    });

    return players.map((player) => ({
      accountId: Number(player.accountId),
      clanId: player.clanId === null ? null : Number(player.clanId),
      lastBattleAt: player.lastBattleAt,
      lastPolledAt: player.lastPolledAt,
      trackingTier: player.trackingTier
    }));
  }

  async upsertPlayer({ info, previous, tier, promote, now }: UpsertPlayerInput): Promise<void> {
    const accountId = BigInt(info.account_id);
    const clanId = info.clan_id === null ? null : BigInt(info.clan_id);
    const trackingTier: TrackingTier = promote ? 'active' : (previous?.trackingTier ?? tier);

    const identity = {
      nickname: info.nickname,
      clanId,
      globalRating: info.global_rating,
      createdAt: fromUnixTime(info.created_at),
      logoutAt: info.logout_at ? fromUnixTime(info.logout_at) : null,
      lestaUpdatedAt: fromUnixTime(info.updated_at),
      trackingTier
    };

    const clanChanged = previous ? previous.clanId !== info.clan_id : clanId !== null;

    await this.prisma.$transaction(async (tx) => {
      await tx.player.upsert({ where: { accountId }, create: { accountId, ...identity }, update: identity });

      await tx.playerNickname.upsert({
        where: { accountId_nickname: { accountId, nickname: info.nickname } },
        create: { accountId, nickname: info.nickname },
        update: { lastSeenAt: now }
      });

      if (!clanChanged) {
        return;
      }

      if (previous) {
        await tx.playerClanHistory.updateMany({ where: { accountId, leftAt: null }, data: { leftAt: now } });
      }

      if (clanId !== null) {
        await tx.playerClanHistory.create({ data: { accountId, clanId, joinedAt: previous ? now : null } });
      }
    });
  }

  async markSynced({ accountId, lastBattleAt, now }: MarkSyncedInput): Promise<void> {
    const id = BigInt(accountId);
    const player = await this.prisma.player.findUnique({ where: { accountId: id }, select: { trackingTier: true } });

    if (!player) {
      return;
    }

    const isSubscriber = player.trackingTier === 'active' && (await this.announce.isSubscriber(id));

    await this.prisma.player.update({
      where: { accountId: id },
      data: {
        lastBattleAt,
        lastPolledAt: now,
        nextPollAt: nextPollAt({ now, tier: player.trackingTier, isSubscriber, intervals: TRACKING.intervals })
      }
    });
  }

  async markMissing(accountIds: readonly number[]): Promise<void> {
    const now = new Date();

    await this.prisma.player.updateMany({
      where: { accountId: { in: accountIds.map(BigInt) } },
      data: { trackingTier: 'dormant', nextPollAt: addDays(now, TRACKING.intervals.dormantDays) }
    });
  }

  async latestAccountBattles(accountId: number): Promise<Map<SnapshotMode, number>> {
    const rows = await this.prisma.$queryRaw<{ mode: string; battles: number }[]>`
      SELECT DISTINCT ON (mode) mode::text AS mode, battles
      FROM account_snapshot
      WHERE account_id = ${BigInt(accountId)} AND mode IN ('all', 'random')
      ORDER BY mode, captured_at DESC
    `;

    const battles = new Map<SnapshotMode, number>();

    for (const row of rows) {
      if (isSnapshotMode(row.mode)) {
        battles.set(row.mode, row.battles);
      }
    }

    return battles;
  }

  async loadBaselines(accountIds: readonly number[]): Promise<Map<number, TankBaseline[]>> {
    const rows = await this.prisma.playerTank.findMany({
      where: { accountId: { in: accountIds.map(BigInt) } },
      select: { accountId: true, tankId: true, battles: true, markOfMastery: true }
    });

    const grouped = groupBy(rows, (row) => String(row.accountId));

    return new Map(
      accountIds.map((accountId) => [
        accountId,
        (grouped[String(accountId)] ?? []).map((row) => ({ tankId: row.tankId, battles: row.battles, markOfMastery: row.markOfMastery }))
      ])
    );
  }

  async latestTankSnapshots({ accountId, tankIds }: LatestTankSnapshotsInput): Promise<TankSnapshotRow[]> {
    const id = BigInt(accountId);

    const keys = await this.prisma.$queryRaw<{ tank_id: number; mode: string; captured_at: Date }[]>`
      SELECT DISTINCT ON (tank_id, mode) tank_id, mode::text AS mode, captured_at
      FROM tank_snapshot
      WHERE account_id = ${id} AND tank_id = ANY(${[...tankIds]}::int[]) AND mode IN ('all', 'random')
      ORDER BY tank_id, mode, captured_at DESC
    `;

    const filters = keys.flatMap((key): { tankId: number; mode: StatsMode; capturedAt: Date }[] =>
      isSnapshotMode(key.mode) ? [{ tankId: key.tank_id, mode: key.mode, capturedAt: key.captured_at }] : []
    );

    if (filters.length === 0) {
      return [];
    }

    return this.prisma.tankSnapshot.findMany({ where: { accountId: id, OR: filters } });
  }

  async overallWn8(accountId: number): Promise<number | null> {
    const rating = await this.prisma.accountRating.findUnique({
      where: { accountId_period: { accountId: BigInt(accountId), period: 'overall' } },
      select: { wn8: true }
    });

    return rating?.wn8 ?? null;
  }

  async tankTiers(tankIds: readonly number[]): Promise<Map<number, number>> {
    const vehicles = await this.prisma.vehicle.findMany({ where: { tankId: { in: [...tankIds] } }, select: { tankId: true, tier: true } });

    return new Map(vehicles.map((vehicle) => [vehicle.tankId, vehicle.tier]));
  }

  async writeAccountChanges({ accountSnapshots, tankSnapshots, deltas, baseline }: AccountChanges): Promise<void> {
    const marks = snapshotMarks(tankSnapshots);

    const previous =
      marks.length === 0
        ? []
        : await this.prisma.playerTank.findMany({
            where: { OR: marks.map(({ accountId, tankId }) => ({ accountId, tankId })) },
            select: { accountId: true, tankId: true, marksOnGun: true }
          });

    await this.prisma.$transaction(async (tx) => {
      await tx.accountSnapshot.createMany({ data: accountSnapshots, skipDuplicates: true });
      await tx.tankSnapshot.createMany({ data: tankSnapshots, skipDuplicates: true });
      await tx.tankBattleDelta.createMany({ data: deltas, skipDuplicates: true });

      for (const row of baseline) {
        await tx.playerTank.upsert({
          where: { accountId_tankId: { accountId: row.accountId, tankId: row.tankId } },
          create: row,
          update: { battles: row.battles, wins: row.wins, markOfMastery: row.markOfMastery, lastBattleAt: row.lastBattleAt }
        });
      }

      for (const entry of marks) {
        await tx.playerTank.updateMany({ where: { accountId: entry.accountId, tankId: entry.tankId }, data: { marksOnGun: entry.marks } });
      }
    });

    await this.announce.announceMarks(gainedMarks({ current: marks, previous }));
  }
}
