import { addDays, fromUnixTime } from 'date-fns';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { AccountRating, Player, PlayerTank, TankSnapshot, Vehicle } from '../../../../../../generated';
import type { PrismaService } from '../../../../../core';
import type { StoredPlayer } from '../../lib/poll-pipeline';
import type { TankSnapshotRow } from '../../lib/snapshots';

import { PurgeGuardService } from '../../../purge';
import { TRACKING } from '../../config';
import { accountInfo, block, tankStats } from '../../lib/poll-pipeline/_tests/poll-pipeline.fixtures';
import { tankSnapshotRow } from '../../lib/snapshots';
import { TrackingAnnounceService } from '../tracking-announce.service';
import { TrackingStoreService } from '../tracking-store.service';

const NOW = new Date('2026-09-26T12:00:00Z');

const createStore = () => {
  const prisma = mockDeep<PrismaService>();
  const guard = mock<PurgeGuardService>();
  const announce = mock<TrackingAnnounceService>();

  prisma.$transaction.mockImplementation(async (run) => (typeof run === 'function' ? run(prisma) : Promise.all(run)));

  return { prisma, guard, announce, store: new TrackingStoreService(prisma, guard, announce) };
};

const stored = (fields: Partial<StoredPlayer> = {}): StoredPlayer => ({
  accountId: 1,
  clanId: null,
  lastBattleAt: null,
  lastPolledAt: null,
  trackingTier: 'population',
  ...fields
});

const info = (clanId: number | null) => ({ ...accountInfo({ accountId: 1, battles: 100, lastBattleTime: 1_700_000_000 }), clan_id: clanId });

const snapshot = ({ tankId, marksOnGun }: Pick<TankSnapshotRow, 'marksOnGun' | 'tankId'>): TankSnapshotRow =>
  tankSnapshotRow({ accountId: 1n, capturedAt: NOW, mode: 'all', block: block(10), stats: tankStats({ tankId, battles: 10 }), marksOnGun });

describe('TrackingStoreService.loadPlayers', () => {
  it('converts ids to numbers and keeps a missing clan as null rather than 0', async () => {
    const { prisma, store } = createStore();

    prisma.player.findMany.mockResolvedValue([
      mock<Player>({ accountId: 1n, clanId: null, trackingTier: 'active', lastBattleAt: null, lastPolledAt: null }),
      mock<Player>({ accountId: 2n, clanId: 7n, trackingTier: 'dormant', lastBattleAt: NOW, lastPolledAt: NOW })
    ]);

    const players = await store.loadPlayers([1, 2]);

    expect(players.map(({ accountId, clanId }) => ({ accountId, clanId }))).toEqual([
      { accountId: 1, clanId: null },
      { accountId: 2, clanId: 7 }
    ]);
  });
});

describe('TrackingStoreService.upsertPlayer', () => {
  it('promotes the player to the active tier when asked', async () => {
    const { prisma, store } = createStore();

    await store.upsertPlayer({ info: info(null), previous: stored({ trackingTier: 'dormant' }), tier: 'population', promote: true, now: NOW });

    expect(prisma.player.upsert.mock.calls[0]?.[0].update).toMatchObject({ trackingTier: 'active' });
  });

  it('keeps the stored tier of a known player instead of the batch tier', async () => {
    const { prisma, store } = createStore();

    await store.upsertPlayer({ info: info(null), previous: stored({ trackingTier: 'active' }), tier: 'population', promote: false, now: NOW });

    expect(prisma.player.upsert.mock.calls[0]?.[0].update).toMatchObject({ trackingTier: 'active' });
  });

  it('gives a new player the batch tier', async () => {
    const { prisma, store } = createStore();

    await store.upsertPlayer({ info: info(null), previous: undefined, tier: 'population', promote: false, now: NOW });

    expect(prisma.player.upsert.mock.calls[0]?.[0].create).toMatchObject({ trackingTier: 'population' });
  });

  it('stores a zero logout time as null instead of the epoch', async () => {
    const { prisma, store } = createStore();

    await store.upsertPlayer({ info: { ...info(null), logout_at: 0 }, previous: undefined, tier: 'population', promote: false, now: NOW });

    expect(prisma.player.upsert.mock.calls[0]?.[0].update).toMatchObject({ logoutAt: null });
  });

  it('converts a real logout time from unix seconds', async () => {
    const { prisma, store } = createStore();
    const logoutAt = 1_700_000_500;

    await store.upsertPlayer({ info: { ...info(null), logout_at: logoutAt }, previous: undefined, tier: 'population', promote: false, now: NOW });

    expect(prisma.player.upsert.mock.calls[0]?.[0].update).toMatchObject({ logoutAt: fromUnixTime(logoutAt) });
  });

  it('refreshes the nickname last-seen time on every poll', async () => {
    const { prisma, store } = createStore();

    await store.upsertPlayer({ info: info(null), previous: stored(), tier: 'population', promote: false, now: NOW });

    expect(prisma.playerNickname.upsert.mock.calls[0]?.[0].update).toEqual({ lastSeenAt: NOW });
  });

  it('writes no clan history when the clan is unchanged', async () => {
    const { prisma, store } = createStore();

    await store.upsertPlayer({ info: info(5), previous: stored({ clanId: 5 }), tier: 'population', promote: false, now: NOW });

    expect(prisma.playerClanHistory.updateMany).not.toHaveBeenCalled();
    expect(prisma.playerClanHistory.create).not.toHaveBeenCalled();
  });

  it('writes no clan history for a new clanless player', async () => {
    const { prisma, store } = createStore();

    await store.upsertPlayer({ info: info(null), previous: undefined, tier: 'population', promote: false, now: NOW });

    expect(prisma.playerClanHistory.updateMany).not.toHaveBeenCalled();
    expect(prisma.playerClanHistory.create).not.toHaveBeenCalled();
  });

  it('closes the open membership and opens a new one dated now when a known player switches clan', async () => {
    const { prisma, store } = createStore();

    await store.upsertPlayer({ info: info(9), previous: stored({ clanId: 5 }), tier: 'population', promote: false, now: NOW });

    expect(prisma.playerClanHistory.updateMany.mock.calls[0]?.[0]).toMatchObject({ where: { leftAt: null }, data: { leftAt: NOW } });
    expect(prisma.playerClanHistory.create.mock.calls[0]?.[0].data).toMatchObject({ clanId: 9n, joinedAt: NOW });
  });

  it('only closes the membership when a known player leaves a clan', async () => {
    const { prisma, store } = createStore();

    await store.upsertPlayer({ info: info(null), previous: stored({ clanId: 5 }), tier: 'population', promote: false, now: NOW });

    expect(prisma.playerClanHistory.updateMany).toHaveBeenCalledOnce();
    expect(prisma.playerClanHistory.create).not.toHaveBeenCalled();
  });

  it('records an unknown join date for a new player already in a clan', async () => {
    const { prisma, store } = createStore();

    await store.upsertPlayer({ info: info(9), previous: undefined, tier: 'population', promote: false, now: NOW });

    expect(prisma.playerClanHistory.updateMany).not.toHaveBeenCalled();
    expect(prisma.playerClanHistory.create.mock.calls[0]?.[0].data).toMatchObject({ clanId: 9n, joinedAt: null });
  });
});

describe('TrackingStoreService.markSynced', () => {
  it('does nothing for a player that no longer exists', async () => {
    const { prisma, store } = createStore();

    prisma.player.findUnique.mockResolvedValue(null);

    await store.markSynced({ accountId: 1, lastBattleAt: NOW, now: NOW });

    expect(prisma.player.update).not.toHaveBeenCalled();
  });

  it('polls an active subscriber sooner than an active non-subscriber', async () => {
    const subscriber = createStore();
    const regular = createStore();

    for (const { prisma } of [subscriber, regular]) {
      prisma.player.findUnique.mockResolvedValue(mock<Player>({ trackingTier: 'active' }));
    }

    subscriber.announce.isSubscriber.mockResolvedValue(true);
    regular.announce.isSubscriber.mockResolvedValue(false);

    await subscriber.store.markSynced({ accountId: 1, lastBattleAt: NOW, now: NOW });
    await regular.store.markSynced({ accountId: 1, lastBattleAt: NOW, now: NOW });

    const soon = subscriber.prisma.player.update.mock.calls[0]?.[0].data.nextPollAt;
    const later = regular.prisma.player.update.mock.calls[0]?.[0].data.nextPollAt;

    expect(soon).toBeInstanceOf(Date);
    expect(later).toBeInstanceOf(Date);
    expect(Number(soon)).toBeLessThan(Number(later));
  });

  it('skips the subscription lookup outside the active tier', async () => {
    const { prisma, announce, store } = createStore();

    prisma.player.findUnique.mockResolvedValue(mock<Player>({ trackingTier: 'population' }));

    await store.markSynced({ accountId: 1, lastBattleAt: null, now: NOW });

    expect(announce.isSubscriber).not.toHaveBeenCalled();
    expect(prisma.player.update.mock.calls[0]?.[0].data).toMatchObject({ lastBattleAt: null, lastPolledAt: NOW });
  });
});

describe('TrackingStoreService.markMissing', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('parks missing accounts as dormant until the dormant interval passes', async () => {
    const { prisma, store } = createStore();

    await store.markMissing([1, 2]);

    expect(prisma.player.updateMany.mock.calls[0]?.[0].data).toEqual({
      trackingTier: 'dormant',
      nextPollAt: addDays(NOW, TRACKING.intervals.dormantDays)
    });
  });
});

describe('TrackingStoreService.latestAccountBattles', () => {
  it('keeps only the snapshot modes and drops anything else the query returns', async () => {
    const { prisma, store } = createStore();

    prisma.$queryRaw.mockResolvedValue([
      { mode: 'all', battles: 120 },
      { mode: 'random', battles: 100 },
      { mode: 'ranked', battles: 5 }
    ]);

    const battles = await store.latestAccountBattles(1);

    expect(Object.fromEntries(battles)).toEqual({ all: 120, random: 100 });
  });
});

describe('TrackingStoreService.loadBaselines', () => {
  it('returns an entry for every requested account, empty for one without tanks', async () => {
    const { prisma, store } = createStore();

    prisma.playerTank.findMany.mockResolvedValue([mock<PlayerTank>({ accountId: 1n, tankId: 10, battles: 5, markOfMastery: 2 })]);

    const baselines = await store.loadBaselines([1, 2]);

    expect(baselines.get(1)).toEqual([{ tankId: 10, battles: 5, markOfMastery: 2 }]);
    expect(baselines.get(2)).toEqual([]);
  });
});

describe('TrackingStoreService.latestTankSnapshots', () => {
  it('skips the row query when the account has no prior snapshots', async () => {
    const { prisma, store } = createStore();

    prisma.$queryRaw.mockResolvedValue([]);

    expect(await store.latestTankSnapshots({ accountId: 1, tankIds: [10] })).toEqual([]);
    expect(prisma.tankSnapshot.findMany).not.toHaveBeenCalled();
  });

  it('fetches only the latest snapshot per tank and snapshot mode', async () => {
    const { prisma, store } = createStore();
    const row = mock<TankSnapshot>({ tankId: 10 });

    prisma.$queryRaw.mockResolvedValue([
      { tank_id: 10, mode: 'all', captured_at: NOW },
      { tank_id: 10, mode: 'ranked', captured_at: NOW }
    ]);

    prisma.tankSnapshot.findMany.mockResolvedValue([row]);

    expect(await store.latestTankSnapshots({ accountId: 1, tankIds: [10] })).toEqual([row]);
    expect(prisma.tankSnapshot.findMany.mock.calls[0]?.[0]?.where?.OR).toEqual([{ tankId: 10, mode: 'all', capturedAt: NOW }]);
  });
});

describe('TrackingStoreService.overallWn8', () => {
  it('returns null when the account has no overall rating yet', async () => {
    const { prisma, store } = createStore();

    prisma.accountRating.findUnique.mockResolvedValue(null);

    expect(await store.overallWn8(1)).toBeNull();
  });

  it('keeps a zero rating as zero', async () => {
    const { prisma, store } = createStore();

    prisma.accountRating.findUnique.mockResolvedValue(mock<AccountRating>({ wn8: 0 }));

    expect(await store.overallWn8(1)).toBe(0);
  });
});

describe('TrackingStoreService.tankTiers', () => {
  it('maps each known tank to its tier', async () => {
    const { prisma, store } = createStore();

    prisma.vehicle.findMany.mockResolvedValue([mock<Vehicle>({ tankId: 10, tier: 8 }), mock<Vehicle>({ tankId: 11, tier: 10 })]);

    expect(Object.fromEntries(await store.tankTiers([10, 11, 12]))).toEqual({ 10: 8, 11: 10 });
  });
});

describe('TrackingStoreService.writeAccountChanges', () => {
  const changes = { accountId: 1, accountSnapshots: [], deltas: [], baseline: [] };

  it('does not look up stored marks when no snapshot carries marks', async () => {
    const { prisma, announce, store } = createStore();

    await store.writeAccountChanges({ ...changes, tankSnapshots: [snapshot({ tankId: 10, marksOnGun: null })] });

    expect(prisma.playerTank.findMany).not.toHaveBeenCalled();
    expect(prisma.playerTank.updateMany).not.toHaveBeenCalled();
    expect(announce.announceMarks).toHaveBeenCalledWith([]);
  });

  it('writes snapshots and deltas idempotently so a retried poll persists them once', async () => {
    const { prisma, store } = createStore();

    await store.writeAccountChanges({ ...changes, tankSnapshots: [] });

    for (const write of [prisma.accountSnapshot.createMany, prisma.tankSnapshot.createMany, prisma.tankBattleDelta.createMany]) {
      expect(write.mock.calls[0]?.[0]).toMatchObject({ skipDuplicates: true });
    }
  });

  it('stores the best marks per tank and announces only a real gain over a known value', async () => {
    const { prisma, announce, store } = createStore();

    prisma.playerTank.findMany.mockResolvedValue([
      mock<PlayerTank>({ accountId: 1n, tankId: 10, marksOnGun: 1 }),
      mock<PlayerTank>({ accountId: 1n, tankId: 11, marksOnGun: null }),
      mock<PlayerTank>({ accountId: 1n, tankId: 12, marksOnGun: 3 })
    ]);

    await store.writeAccountChanges({
      ...changes,
      tankSnapshots: [
        snapshot({ tankId: 10, marksOnGun: 1 }),
        snapshot({ tankId: 10, marksOnGun: 2 }),
        snapshot({ tankId: 11, marksOnGun: 1 }),
        snapshot({ tankId: 12, marksOnGun: 3 })
      ]
    });

    expect(prisma.playerTank.updateMany.mock.calls.map(([args]) => [args.where, args.data])).toEqual([
      [{ accountId: 1n, tankId: 10 }, { marksOnGun: 2 }],
      [{ accountId: 1n, tankId: 11 }, { marksOnGun: 1 }],
      [{ accountId: 1n, tankId: 12 }, { marksOnGun: 3 }]
    ]);

    expect(announce.announceMarks).toHaveBeenCalledWith([{ accountId: 1n, tankId: 10, marks: 2, previous: 1 }]);
  });

  it('refreshes the baseline counters of every played tank', async () => {
    const { prisma, store } = createStore();
    const row = { accountId: 1n, tankId: 10, battles: 50, wins: 30, markOfMastery: 2, lastBattleAt: NOW };

    await store.writeAccountChanges({ ...changes, baseline: [row], tankSnapshots: [] });

    expect(prisma.playerTank.upsert.mock.calls[0]?.[0]).toMatchObject({
      create: row,
      update: { battles: row.battles, wins: row.wins, markOfMastery: row.markOfMastery, lastBattleAt: NOW }
    });
  });
});
