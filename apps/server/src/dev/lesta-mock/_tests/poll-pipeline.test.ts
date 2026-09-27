import { fromUnixTime } from 'date-fns';
import { describe, expect, it } from 'vitest';

import type { LestaClients } from '../../../core';
import type { TankBaseline } from '../../../modules/collector/tracking/lib/account-diff';
import type { AccountChanges, AccountStorePort, PollStorePort, StoredPlayer } from '../../../modules/collector/tracking/lib/poll-pipeline';
import type { TankSnapshotRow } from '../../../modules/collector/tracking/lib/snapshots';

import { LESTA_MOCK, lestaMockBaseUrl } from '../../../config';
import { createLestaClient } from '../../../lib/lesta';
import { runPollPipeline } from '../../../modules/collector/tracking/lib/poll-pipeline';
import { TrackingLestaService } from '../../../modules/collector/tracking/services';
import { MOCK_TIME } from '../config';
import { buildCatalog } from '../lib/catalog';
import { buildGarage } from '../lib/garage';
import { createLestaMockHandler } from '../lib/responses';
import { createLestaMockFetch } from '../lib/transport';
import { DAY, fixtureRows, fixtureWorld } from './fixtures';

const FIRST = MOCK_TIME.anchor + 150 * DAY + 9 * 3600;
const SECOND = FIRST + 2 * DAY + 14 * 3600;

let clock = FIRST;

const lesta = createLestaClient({
  applicationId: LESTA_MOCK.applicationId,
  baseUrl: lestaMockBaseUrl('http://localhost:4000'),
  fetch: createLestaMockFetch({ handler: createLestaMockHandler(fixtureWorld), clock: () => clock }),
  retry: { retries: 0 }
});

const clients: LestaClients = { priority: lesta, bulk: lesta };
const port = new TrackingLestaService(clients).port('bulk');

const createMemoryStore = () => {
  const players = new Map<number, StoredPlayer>();
  const baselines = new Map<number, Map<number, TankBaseline>>();
  const accountBattles = new Map<string, number>();
  const latestTanks = new Map<string, TankSnapshotRow>();
  const written: AccountChanges[] = [];

  const account: AccountStorePort = {
    latestAccountBattles: async (accountId) =>
      new Map(
        (['all', 'random'] as const).flatMap((mode) => {
          const battles = accountBattles.get(`${accountId}:${mode}`);

          return battles === undefined ? [] : [[mode, battles] as const];
        })
      ),
    latestTankSnapshots: async ({ accountId, tankIds }) =>
      [...latestTanks.values()].filter((row) => row.accountId === BigInt(accountId) && tankIds.includes(row.tankId)),
    writeAccountChanges: async (changes) => {
      written.push(changes);

      for (const row of changes.accountSnapshots) {
        accountBattles.set(`${changes.accountId}:${row.mode}`, row.battles);
      }

      for (const row of changes.tankSnapshots) {
        latestTanks.set(`${row.tankId}:${row.mode}`, row);
      }

      const tanks = baselines.get(changes.accountId) ?? new Map<number, TankBaseline>();

      for (const row of changes.baseline) {
        tanks.set(row.tankId, { tankId: row.tankId, battles: row.battles ?? 0, markOfMastery: row.markOfMastery ?? 0 });
      }

      baselines.set(changes.accountId, tanks);
    }
  };

  const store: PollStorePort = {
    blockedAccounts: async () => new Set(),
    loadPlayers: async (ids) => ids.flatMap((id) => players.get(id) ?? []),
    upsertPlayer: async ({ info, previous, tier }) => {
      players.set(info.account_id, {
        accountId: info.account_id,
        clanId: info.clan_id,
        lastBattleAt: previous?.lastBattleAt ?? null,
        lastPolledAt: previous?.lastPolledAt ?? null,
        trackingTier: tier
      });
    },
    markSynced: async (entries) => {
      for (const { accountId, lastBattleAt, now } of entries) {
        const player = players.get(accountId);

        if (player) {
          players.set(accountId, { ...player, lastBattleAt, lastPolledAt: now });
        }
      }
    },
    markMissing: async () => undefined,
    loadBaselines: async (ids) => new Map(ids.map((id) => [id, [...(baselines.get(id)?.values() ?? [])]])),
    overallWn8: async () => null,
    withAccount: async ({ run }) => run(account)
  };

  return { store, written };
};

const accountRandomBattles = async (accountId: number) => (await port.accountInfo([accountId]))[String(accountId)]?.statistics.random?.battles ?? 0;

const findPlayingAccount = async () => {
  for (const player of fixtureWorld.players.filter((entry) => entry.activity === 'regular')) {
    clock = FIRST;
    const before = await accountRandomBattles(player.accountId);

    clock = SECOND;
    const after = await accountRandomBattles(player.accountId);

    if (before > 0 && after > before) {
      return { accountId: player.accountId, played: after - before };
    }
  }

  throw new Error('no fixture player played between the two steps');
};

describe('collector poll pipeline against the Lesta mock', () => {
  it('baselines an account, then writes tank snapshots and deltas that add up to the battles played', async () => {
    const { accountId, played } = await findPlayingAccount();
    const { store, written } = createMemoryStore();
    const errors: unknown[] = [];
    const poll = async (at: number) => {
      clock = at;

      return runPollPipeline({
        ports: { lesta: port, store, onError: ({ error }) => errors.push(error) },
        accountIds: [accountId],
        tier: 'active',
        now: fromUnixTime(at)
      });
    };

    const first = await poll(FIRST);

    expect(errors).toEqual([]);
    expect(first.updated).toEqual([accountId]);
    expect(first.deltas).toBe(0);
    expect(written[0]?.accountSnapshots.map((row) => row.mode).sort()).toEqual(['all', 'random']);
    expect(written[0]?.tankSnapshots.length).toBeGreaterThan(0);
    expect(written[0]?.baseline.length).toBeGreaterThan(0);

    const second = await poll(SECOND);
    const deltas = written.slice(1).flatMap((changes) => changes.deltas);

    expect(errors).toEqual([]);
    expect(second.updated).toEqual([accountId]);
    expect(second.deltas).toBeGreaterThan(0);
    expect(deltas.filter((delta) => delta.mode === 'random').reduce((sum, delta) => sum + delta.battles, 0)).toBe(played);
  });
});

describe('mock catalog', () => {
  it('plays only vehicles with WN8 expected values, so an empty expected table leaves every garage empty', () => {
    const catalog = buildCatalog({ ...fixtureRows, expected: [] });
    const [player] = fixtureWorld.players.filter((entry) => entry.activity === 'regular');

    expect(catalog.vehicles.some((vehicle) => vehicle.playable)).toBe(false);
    expect(player && buildGarage({ ...fixtureWorld, seed: fixtureWorld.seed + 1, catalog }, player).tanks).toEqual([]);
  });
});
