import { describe, expect, it } from 'vitest';

import { assignCohort } from '../../cohort';
import { tankSnapshotRow } from '../../snapshots';
import { runPollPipeline } from '../poll-pipeline';
import { accountInfo, accountTank, block, createFakeLesta, createFakeStore, tankStats } from './poll-pipeline.fixtures';

const now = new Date('2026-09-24T12:00:00Z');
const earlier = new Date('2026-09-23T12:00:00Z');
const lastBattleTime = 1_790_000_000;

const storedPlayer = {
  accountId: 1,
  clanId: null,
  lastBattleAt: new Date((lastBattleTime - 3600) * 1000),
  lastPolledAt: earlier,
  trackingTier: 'active' as const
};

const previousSnapshot = (tankId: number, battles: number, mode: 'all' | 'random') =>
  tankSnapshotRow({ accountId: 1n, capturedAt: earlier, mode, block: block(battles), stats: tankStats({ tankId, battles }) });

describe('runPollPipeline', () => {
  it('baselines a never-seen account without inventing deltas', async () => {
    const lesta = createFakeLesta({
      infos: { 1: accountInfo({ accountId: 1, battles: 150, lastBattleTime }) },
      tanks: { 1: [accountTank({ tankId: 10, battles: 100 }), accountTank({ tankId: 20, battles: 50 }), accountTank({ tankId: 30, battles: 0 })] },
      stats: { 1: [tankStats({ tankId: 10, battles: 100 }), tankStats({ tankId: 20, battles: 50 })] }
    });

    const { store, written, synced, upserted } = createFakeStore({});
    const result = await runPollPipeline({ ports: { lesta, store }, accountIds: [1], tier: 'active', now });

    expect(result.updated).toEqual([1]);
    expect(upserted).toHaveLength(1);
    expect(lesta.tankStats).toHaveBeenCalledWith({ accountId: 1, tankIds: [10, 20] });

    const [changes] = written;

    expect(changes?.accountSnapshots.map((row) => row.mode).sort()).toEqual(['all', 'random']);
    expect(changes?.tankSnapshots).toHaveLength(4);
    expect(changes?.deltas).toEqual([]);
    expect(changes?.baseline.map((row) => row.tankId).sort()).toEqual([10, 20]);
    expect(synced).toEqual([{ accountId: 1, lastBattleAt: new Date(lastBattleTime * 1000), now }]);
  });

  it('writes snapshots and deltas only for tanks whose battle count moved', async () => {
    const lesta = createFakeLesta({
      infos: { 1: accountInfo({ accountId: 1, battles: 153, lastBattleTime }) },
      tanks: { 1: [accountTank({ tankId: 10, battles: 103 }), accountTank({ tankId: 20, battles: 50 })] },
      stats: { 1: [tankStats({ tankId: 10, battles: 103 }), tankStats({ tankId: 20, battles: 50 })] }
    });

    const { store, written } = createFakeStore({
      players: [storedPlayer],
      baselines: {
        1: [
          { tankId: 10, battles: 100, markOfMastery: 1 },
          { tankId: 20, battles: 50, markOfMastery: 1 }
        ]
      },
      accountBattles: { 1: { all: 160, random: 150 } },
      tankSnapshots: [previousSnapshot(10, 100, 'all'), previousSnapshot(10, 100, 'random'), previousSnapshot(20, 50, 'random')]
    });

    const result = await runPollPipeline({ ports: { lesta, store }, accountIds: [1], tier: 'active', now });

    expect(result.updated).toEqual([1]);
    expect(lesta.tankStats).toHaveBeenCalledWith({ accountId: 1, tankIds: [10] });

    const [changes] = written;
    const randomDelta = changes?.deltas.find((delta) => delta.mode === 'random');

    expect(changes?.tankSnapshots.every((row) => row.tankId === 10)).toBe(true);
    expect(randomDelta?.battles).toBe(3);
    expect(randomDelta?.capturedAt).toEqual(now);
    expect(randomDelta?.accountWinRate).toBeGreaterThan(0);
    expect(randomDelta?.cohort).toBe(assignCohort({ battles: 153, winRate: randomDelta?.accountWinRate ?? 0, wn8: null }));
  });

  it('skips the tank scan when last_battle_time did not move', async () => {
    const lesta = createFakeLesta({
      infos: { 1: accountInfo({ accountId: 1, battles: 150, lastBattleTime: lastBattleTime - 3600 }) },
      tanks: {},
      stats: {}
    });

    const { store, written, synced } = createFakeStore({ players: [storedPlayer] });
    const result = await runPollPipeline({ ports: { lesta, store }, accountIds: [1], tier: 'active', now });

    expect(result.unchanged).toEqual([1]);
    expect(lesta.accountTanks).not.toHaveBeenCalled();
    expect(written).toEqual([]);
    expect(synced).toHaveLength(1);
  });

  it('never calls Lesta for an account under a deletion request', async () => {
    const lesta = createFakeLesta({ infos: {}, tanks: {}, stats: {} });
    const { store } = createFakeStore({ blocked: [1] });
    const result = await runPollPipeline({ ports: { lesta, store }, accountIds: [1], tier: 'active', now });

    expect(result.blocked).toEqual([1]);
    expect(lesta.accountInfo).not.toHaveBeenCalled();
  });

  it('marks accounts Lesta no longer returns', async () => {
    const lesta = createFakeLesta({ infos: {}, tanks: {}, stats: {} });
    const { store, missing } = createFakeStore({});
    const result = await runPollPipeline({ ports: { lesta, store }, accountIds: [5], tier: 'population', now });

    expect(result.missing).toEqual([5]);
    expect(missing).toEqual([5]);
  });

  it('isolates a failing account and leaves its sync markers untouched', async () => {
    const lesta = createFakeLesta({
      infos: { 1: accountInfo({ accountId: 1, battles: 10, lastBattleTime }), 2: accountInfo({ accountId: 2, battles: 10, lastBattleTime }) },
      tanks: { 1: [accountTank({ tankId: 10, battles: 10 })], 2: [accountTank({ tankId: 10, battles: 10 })] },
      stats: { 2: [tankStats({ tankId: 10, battles: 10, accountId: 2 })] },
      failStatsFor: [1]
    });

    const errors: number[] = [];
    const { store, synced } = createFakeStore({});

    const result = await runPollPipeline({
      ports: { lesta, store, onError: ({ accountId }) => errors.push(accountId) },
      accountIds: [1, 2],
      tier: 'population',
      now
    });

    expect(result.failed).toEqual([1]);
    expect(result.updated).toEqual([2]);
    expect(errors).toEqual([1]);
    expect(synced.map((entry) => entry.accountId)).toEqual([2]);
  });
});

describe('runPollPipeline marks on gun', () => {
  const input = () => ({
    infos: { 1: accountInfo({ accountId: 1, battles: 150, lastBattleTime }) },
    tanks: { 1: [accountTank({ tankId: 10, battles: 100 }), accountTank({ tankId: 20, battles: 50 })] },
    stats: { 1: [tankStats({ tankId: 10, battles: 100 }), tankStats({ tankId: 20, battles: 50 })] },
    marks: { 1: { 10: 2, 20: 0 } }
  });

  it('reads marks on gun from tanks/achievements for tier A accounts', async () => {
    const lesta = createFakeLesta(input());
    const { store, written } = createFakeStore({});

    await runPollPipeline({ ports: { lesta, store }, accountIds: [1], tier: 'active', now });

    expect(lesta.tankMarks).toHaveBeenCalledWith({ accountId: 1, tankIds: [10, 20] });
    expect(written[0]?.tankSnapshots.filter((row) => row.tankId === 10).map((row) => row.marksOnGun)).toEqual([2, 2]);
    expect(written[0]?.tankSnapshots.filter((row) => row.tankId === 20).map((row) => row.marksOnGun)).toEqual([0, 0]);
  });

  it('skips the achievements call for sweep tiers', async () => {
    const lesta = createFakeLesta(input());
    const { store, written } = createFakeStore({});

    await runPollPipeline({ ports: { lesta, store }, accountIds: [1], tier: 'population', now });

    expect(lesta.tankMarks).not.toHaveBeenCalled();
    expect(written[0]?.tankSnapshots.every((row) => row.marksOnGun === null)).toBe(true);
  });
});
