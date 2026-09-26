import { vi } from 'vitest';

import type { AccountInfo, AccountTank, BattleStatsBlock, TankStats } from '../../../../../../lib/lesta';
import type { TankBaseline } from '../../account-diff';
import type { SnapshotMode, TankSnapshotRow } from '../../snapshots';
import type {
  AccountChanges,
  LatestTankSnapshotsInput,
  MarkSyncedInput,
  PollLestaPort,
  PollStorePort,
  StoredPlayer,
  UpsertPlayerInput
} from '../poll-pipeline.types';
import type { FakeLestaInput, FakeStoreInput, InfoInput, TankStatInput } from './poll-pipeline.fixtures.types';

const SNAPSHOT_MODES: readonly SnapshotMode[] = ['all', 'random'];

export const block = (battles: number): BattleStatsBlock => ({
  battles,
  wins: Math.floor(battles * 0.55),
  losses: battles - Math.floor(battles * 0.55),
  draws: 0,
  xp: battles * 800,
  damage_dealt: battles * 1800,
  damage_received: battles * 1200,
  frags: battles,
  spotted: battles * 2,
  capture_points: battles,
  dropped_capture_points: battles,
  hits: battles * 7,
  shots: battles * 9,
  survived_battles: Math.floor(battles / 3),
  avg_damage_blocked: 300,
  piercings: battles * 5
});

export const accountInfo = ({ accountId, battles, lastBattleTime }: InfoInput): AccountInfo => ({
  account_id: accountId,
  nickname: `player_${accountId}`,
  clan_id: null,
  global_rating: 5000,
  created_at: 1_500_000_000,
  last_battle_time: lastBattleTime,
  updated_at: lastBattleTime,
  statistics: { all: block(battles + 10), random: block(battles) }
});

export const accountTank = ({ tankId, battles }: TankStatInput): AccountTank => ({
  tank_id: tankId,
  mark_of_mastery: 1,
  statistics: { battles, wins: Math.floor(battles * 0.55) }
});

export const tankStats = ({ tankId, battles, accountId = 1 }: TankStatInput): TankStats => ({
  tank_id: tankId,
  account_id: accountId,
  mark_of_mastery: 1,
  all: block(battles),
  random: block(battles)
});

export const createFakeLesta = ({ infos, tanks, stats, marks = {}, failStatsFor = [] }: FakeLestaInput) => {
  const lesta = {
    accountInfo: vi.fn<PollLestaPort['accountInfo']>(async (ids) => Object.fromEntries(ids.map((id) => [String(id), infos[id] ?? null]))),
    accountTanks: vi.fn<PollLestaPort['accountTanks']>(async (ids) => Object.fromEntries(ids.map((id) => [String(id), tanks[id] ?? null]))),
    tankStats: vi.fn<PollLestaPort['tankStats']>(async ({ accountId, tankIds }) => {
      if (failStatsFor.includes(accountId)) {
        throw new Error('REQUEST_LIMIT_EXCEEDED');
      }

      return (stats[accountId] ?? []).filter((stat) => tankIds.includes(stat.tank_id));
    }),
    tankMarks: vi.fn<PollLestaPort['tankMarks']>(
      async ({ accountId, tankIds }) =>
        new Map(
          Object.entries(marks[accountId] ?? {}).flatMap(([tankId, value]) => (tankIds.includes(Number(tankId)) ? [[Number(tankId), value]] : []))
        )
    )
  } satisfies PollLestaPort;

  return lesta;
};

export const createFakeStore = ({
  players = [],
  baselines = {},
  accountBattles = {},
  tankSnapshots = [],
  blocked = [],
  tiers = {}
}: FakeStoreInput) => {
  const written: AccountChanges[] = [];
  const synced: MarkSyncedInput[] = [];
  const upserted: UpsertPlayerInput[] = [];
  const missing: number[] = [];

  const store = {
    blockedAccounts: vi.fn(async (ids: readonly number[]) => new Set(ids.filter((id) => blocked.includes(id)))),
    loadPlayers: vi.fn(async (ids: readonly number[]): Promise<StoredPlayer[]> => players.filter((player) => ids.includes(player.accountId))),
    upsertPlayer: vi.fn(async (input: UpsertPlayerInput) => {
      upserted.push(input);
    }),
    markSynced: vi.fn(async (input: MarkSyncedInput) => {
      synced.push(input);
    }),
    markMissing: vi.fn(async (ids: readonly number[]) => {
      missing.push(...ids);
    }),
    latestAccountBattles: vi.fn(async (accountId: number) => {
      const battles = new Map<SnapshotMode, number>();

      for (const mode of SNAPSHOT_MODES) {
        const value = accountBattles[accountId]?.[mode];

        if (value !== undefined) {
          battles.set(mode, value);
        }
      }

      return battles;
    }),
    loadBaselines: vi.fn(async (ids: readonly number[]) => new Map<number, TankBaseline[]>(ids.map((id) => [id, baselines[id] ?? []]))),
    latestTankSnapshots: vi.fn(async ({ accountId, tankIds }: LatestTankSnapshotsInput): Promise<TankSnapshotRow[]> =>
      tankSnapshots.filter((row) => row.accountId === BigInt(accountId) && tankIds.includes(row.tankId))
    ),
    overallWn8: vi.fn(async () => null),
    tankTiers: vi.fn(async (ids: readonly number[]) => new Map(ids.flatMap((id) => (tiers[id] === undefined ? [] : [[id, tiers[id]]])))),
    writeAccountChanges: vi.fn(async (changes: AccountChanges) => {
      written.push(changes);
    })
  } satisfies PollStorePort;

  return { store, written, synced, upserted, missing };
};
