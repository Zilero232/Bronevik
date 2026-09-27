import { Injectable } from '@nestjs/common';
import { addDays, fromUnixTime } from 'date-fns';
import { groupBy } from 'remeda';

import type { Prisma, TrackingTier } from '../../../../../generated';
import type { TankBaseline } from '../lib/account-diff';
import type { GainedMark } from '../lib/marks-gain';
import type { AccountStorePort, MarkSyncedInput, PollStorePort, StoredPlayer, UpsertPlayerInput, WithAccountInput } from '../lib/poll-pipeline';
import type { SnapshotMode, TankSnapshotRow } from '../lib/snapshots';
import type {
  AccountStoreInput,
  LatestAccountBattlesInput,
  LatestTanksInput,
  RebuildDaySessionInput,
  WriteAccountChangesInput
} from '../tracking.types';

import { moscowCalendarDate, moscowDayStart } from '../../../../common/lib';
import { lockedTransaction, PrismaService } from '../../../../core';
import { ExpectedValuesService } from '../../../reference';
import { PurgeGuardService } from '../../purge';
import { TRACKING } from '../config';
import { buildDaySession } from '../lib/day-session';
import { gainedMarks, snapshotMarks } from '../lib/marks-gain';
import { nextPollAt } from '../lib/poll-schedule';
import { isSnapshotMode, SNAPSHOT_MODES } from '../lib/snapshots';
import { markSyncedSql, updateMarksSql, upsertLatestTanksSql, upsertPlayerTanksSql } from '../queries';
import { TrackingAnnounceService } from './tracking-announce.service';

@Injectable()
export class TrackingStoreService implements PollStorePort {
  constructor(
    private readonly prisma: PrismaService,
    private readonly guard: PurgeGuardService,
    private readonly announce: TrackingAnnounceService,
    private readonly expected: ExpectedValuesService
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
      createdAt: fromUnixTime(info.created_at),
      trackingTier
    } satisfies Prisma.PlayerUpdateInput;

    const clanChanged = previous ? previous.clanId !== info.clan_id : clanId !== null;

    await this.prisma.$transaction(
      async (tx) => {
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
      },
      { maxWait: TRACKING.transaction.maxWaitMs, timeout: TRACKING.transaction.timeoutMs }
    );
  }

  async markSynced(entries: readonly MarkSyncedInput[]): Promise<void> {
    const ids = entries.map((entry) => BigInt(entry.accountId));

    const [players, subscribers] = await Promise.all([
      this.prisma.player.findMany({ where: { accountId: { in: ids } }, select: { accountId: true, trackingTier: true } }),
      this.announce.subscribers(ids)
    ]);

    const tierOf = new Map(players.map((player) => [Number(player.accountId), player.trackingTier]));

    const rows = entries.flatMap(({ accountId, lastBattleAt, now }) => {
      const tier = tierOf.get(accountId);

      if (!tier) {
        return [];
      }

      const isSubscriber = tier === 'active' && subscribers.has(accountId);

      return [{ accountId, lastBattleAt, lastPolledAt: now, nextPollAt: nextPollAt({ now, tier, isSubscriber, intervals: TRACKING.intervals }) }];
    });

    if (rows.length > 0) {
      await this.prisma.$executeRaw(markSyncedSql(rows));
    }
  }

  async markMissing(accountIds: readonly number[]): Promise<void> {
    const now = new Date();

    await this.prisma.player.updateMany({
      where: { accountId: { in: accountIds.map(BigInt) } },
      data: { trackingTier: 'dormant', nextPollAt: addDays(now, TRACKING.intervals.dormantDays) }
    });
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

  async overallWn8(accountId: number): Promise<number | null> {
    const rating = await this.prisma.accountRating.findUnique({
      where: { accountId_period: { accountId: BigInt(accountId), period: 'overall' } },
      select: { wn8: true }
    });

    return rating?.wn8 ?? null;
  }

  async withAccount<T>({ accountId, run }: WithAccountInput<T>): Promise<T> {
    const expected = await this.expected.all();
    const gained: GainedMark[] = [];

    const result = await lockedTransaction({
      prisma: this.prisma,
      scope: TRACKING.lock.scope,
      key: String(accountId),
      run: async (tx) => run(this.accountStore({ tx, expected, gained }))
    });

    await this.announce.announceMarks(gained);

    return result;
  }

  accountStore(input: AccountStoreInput): AccountStorePort {
    return {
      latestAccountBattles: async (accountId) => this.latestAccountBattles({ tx: input.tx, accountId }),
      latestTankSnapshots: async (latest) => this.latestTankSnapshots({ tx: input.tx, ...latest }),
      writeAccountChanges: async (changes) => this.writeAccountChanges({ ...input, ...changes })
    };
  }

  private async latestAccountBattles({ tx, accountId }: LatestAccountBattlesInput): Promise<Map<SnapshotMode, number>> {
    const rows = await tx.$queryRaw<{ mode: string; battles: number }[]>`
      SELECT DISTINCT ON (mode) mode::text AS mode, battles
      FROM account_snapshot
      WHERE account_id = ${BigInt(accountId)} AND mode IN ('all', 'random')
      ORDER BY mode, captured_at DESC
    `;

    return new Map(rows.flatMap((row) => (isSnapshotMode(row.mode) ? [[row.mode, row.battles] as const] : [])));
  }

  private async latestTankSnapshots({ tx, accountId, tankIds }: LatestTanksInput): Promise<TankSnapshotRow[]> {
    return tx.tankSnapshotLatest.findMany({
      where: { accountId: BigInt(accountId), tankId: { in: [...tankIds] }, mode: { in: [...SNAPSHOT_MODES] } }
    });
  }

  private async writeAccountChanges({
    tx,
    expected,
    gained,
    accountId,
    accountSnapshots,
    tankSnapshots,
    deltas,
    baseline
  }: WriteAccountChangesInput): Promise<void> {
    const id = BigInt(accountId);
    const marks = snapshotMarks(tankSnapshots);
    const capturedAt = tankSnapshots[0]?.capturedAt;

    const previous =
      marks.length === 0
        ? []
        : await tx.playerTank.findMany({
            where: { accountId: id, tankId: { in: marks.map((entry) => entry.tankId) } },
            select: { accountId: true, tankId: true, marksOnGun: true }
          });

    await tx.accountSnapshot.createMany({ data: accountSnapshots, skipDuplicates: true });
    await tx.tankSnapshot.createMany({ data: tankSnapshots, skipDuplicates: true });
    await tx.tankBattleDelta.createMany({ data: deltas, skipDuplicates: true });

    if (capturedAt !== undefined) {
      await tx.$executeRaw(upsertLatestTanksSql({ accountId: id, capturedAt: new Date(capturedAt) }));
    }

    if (baseline.length > 0) {
      await tx.$executeRaw(upsertPlayerTanksSql(baseline));
    }

    if (marks.length > 0) {
      await tx.$executeRaw(updateMarksSql(marks));
    }

    const [delta] = deltas;

    if (delta) {
      await this.rebuildDaySession({ tx, expected, accountId: id, at: new Date(delta.capturedAt) });
    }

    gained.push(...gainedMarks({ current: marks, previous }));
  }

  private async rebuildDaySession({ tx, expected, accountId, at }: RebuildDaySessionInput): Promise<void> {
    const from = moscowDayStart(at);

    const deltas = await tx.tankBattleDelta.findMany({
      where: { accountId, mode: 'random', capturedAt: { gte: from, lt: addDays(from, 1) } },
      select: {
        tankId: true,
        capturedAt: true,
        battles: true,
        wins: true,
        damageDealt: true,
        damageBlocked: true,
        frags: true,
        spotted: true,
        xp: true,
        survived: true,
        capturePoints: true,
        droppedCapturePoints: true
      }
    });

    const session = buildDaySession({ accountId, day: moscowCalendarDate(at), deltas, expected });

    if (!session) {
      return;
    }

    await tx.playSession.upsert({
      where: { accountId_source_kind_day: { accountId, source: 'api', kind: 'day', day: session.day } },
      create: session,
      update: session
    });
  }
}
