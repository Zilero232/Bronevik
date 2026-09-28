import { accountWn8 } from '@otmetki/ratings';
import { fromUnixTime } from 'date-fns';
import { parseArgs } from 'node:util';
import pLimit from 'p-limit';
import { chunk, groupBy, sumBy } from 'remeda';
import { z } from 'zod';

import type { MockBattle, MockPlayer, MockWorld } from '../src/dev/lesta-mock';
import type { BattleResultEvent } from '../src/modules/mod';
import type { SeedPollInput } from './dev-seed.types';

import { isLestaMock, LESTA_MOCK, lestaMockBaseUrl, validateEnv } from '../src/config';
import { HttpClientService } from '../src/core/http';
import { createPrismaClient } from '../src/core/prisma';
import {
  battlesBetween,
  clansOf,
  createLestaMockFetch,
  createLestaMockHandler,
  loadMockWorld,
  SEED,
  seedSteps,
  selectSeedAccounts,
  toBattleEvent
} from '../src/dev/lesta-mock';
import { createLestaClient } from '../src/lib/lesta';
import {
  AccountRatingsService,
  BuildUsageService,
  LearningCurveService,
  ModeMetaService,
  ReferenceTablesService,
  ServerStatsService,
  TankEconomyService,
  TankPercentilesService,
  TierMaintenanceService
} from '../src/modules/collector/aggregates/services';
import { ClanHistoryService, ClanSyncService } from '../src/modules/collector/clans/services';
import { PurgeGuardService } from '../src/modules/collector/purge/services';
import { CatalogSyncService, ExpectedValuesSyncService, MasteryThresholdsSyncService } from '../src/modules/collector/reference/services';
import { runPollPipeline } from '../src/modules/collector/tracking/lib/poll-pipeline';
import { TrackingAnnounceService, TrackingLestaService, TrackingStoreService } from '../src/modules/collector/tracking/services';
import { sessionIncrement, sessionUuid, toBattleData } from '../src/modules/mod';
import { ExpectedValuesService } from '../src/modules/reference';

import 'reflect-metadata';

const { values } = parseArgs({
  options: {
    reset: { type: 'boolean', default: false },
    accounts: { type: 'string' },
    days: { type: 'string' },
    'mod-players': { type: 'string' },
    'mod-days': { type: 'string' }
  }
});

const options = z
  .object({
    accounts: z.coerce.number().int().min(10).max(5000).default(SEED.accounts),
    days: z.coerce.number().int().min(1).max(360).default(SEED.days),
    modPlayers: z.coerce.number().int().min(0).max(500).default(SEED.modPlayers),
    modDays: z.coerce.number().int().min(1).max(90).default(SEED.modDays)
  })
  .parse({ accounts: values.accounts, days: values.days, modPlayers: values['mod-players'], modDays: values['mod-days'] });

const env = validateEnv(process.env);

if (!isLestaMock(env)) {
  console.error(
    'dev:seed runs only against the Lesta mock: leave LESTA_APPLICATION_ID empty outside production (LESTA_MOCK=auto|on), or set DEMO_MODE=true.'
  );

  process.exit(1);
}

const log = (message: string) => console.log(`[dev:seed] ${new Date().toISOString().slice(11, 19)} ${message}`);
const prisma = createPrismaClient({ url: env.DATABASE_URL, pool: { max: 10 } });
const webhooks = { emit: async () => 0 };

if ((await prisma.wn8ExpectedValue.count()) === 0) {
  log('reference: no WN8 expected values (db:reset?), syncing them from XVM: the mock plays only tanks that have them');
  log(`reference: ${JSON.stringify(await new ExpectedValuesSyncService(prisma, new HttpClientService()).sync())}`);
}

const world: MockWorld = await loadMockWorld(env.DATABASE_URL);

if (!world.catalog.vehicles.some((vehicle) => vehicle.playable)) {
  console.error('dev:seed: no playable vehicle in the mock catalog: run `bun run gamedata:import` and sync the WN8 expected values first.');
  process.exit(1);
}

const handler = createLestaMockHandler(world);
const now = Math.floor(Date.now() / 1000);
let clock = now;
const lesta = createLestaClient({
  applicationId: LESTA_MOCK.applicationId,
  baseUrl: lestaMockBaseUrl(env.API_URL),
  fetch: createLestaMockFetch({ handler, clock: () => clock })
});

const clients = { priority: lesta, bulk: lesta };
const guard = new PurgeGuardService(prisma);
const store = new TrackingStoreService(prisma, guard, new TrackingAnnounceService(prisma, webhooks), new ExpectedValuesService(prisma));
const lestaPort = new TrackingLestaService(clients).port('bulk');
const selection = selectSeedAccounts({ world, count: options.accounts, modPlayers: options.modPlayers });
const accountIds = selection.accounts.map((player) => player.accountId);
const activeIds = new Set(selection.active.map((player) => player.accountId));
const worldIds = world.players.map((player) => BigInt(player.accountId));
const worldClanIds = world.clans.map((clan) => BigInt(clan.clanId));

log(`world: ${world.players.length} players, ${world.clans.length} clans; seeding ${accountIds.length} accounts over ${options.days} days`);

if (values.reset) {
  log('reset: removing the generated players, clans and their history');
  await prisma.accountSnapshot.deleteMany({ where: { accountId: { in: worldIds } } });
  await prisma.tankSnapshot.deleteMany({ where: { accountId: { in: worldIds } } });
  await prisma.tankBattleDelta.deleteMany({ where: { accountId: { in: worldIds } } });
  await prisma.player.deleteMany({ where: { accountId: { in: worldIds } } });
  await prisma.clanSnapshot.deleteMany({ where: { clanId: { in: worldClanIds } } });
  await prisma.clan.deleteMany({ where: { clanId: { in: worldClanIds } } });
}

const seeded = new Set(
  (
    await prisma.accountSnapshot.findMany({
      where: { accountId: { in: accountIds.map(BigInt) } },
      select: { accountId: true },
      distinct: ['accountId']
    })
  ).map((row) => Number(row.accountId))
);

const fresh = accountIds.filter((accountId) => !seeded.has(accountId));
const limit = pLimit(SEED.concurrency);

const poll = async ({ ids, at }: SeedPollInput) => {
  clock = at;

  const results = await Promise.all(
    chunk(ids, SEED.chunk).map((part) =>
      limit(() =>
        runPollPipeline({
          ports: { lesta: lestaPort, store, onError: ({ accountId, error }) => log(`account ${accountId} failed: ${String(error)}`) },
          accountIds: part,
          tier: 'population',
          now: fromUnixTime(at)
        })
      )
    )
  );

  return { snapshots: sumBy(results, (result) => result.snapshots), deltas: sumBy(results, (result) => result.deltas) };
};

const steps = fresh.length > 0 ? seedSteps({ now, days: options.days }) : [now];

log(`${seeded.size} accounts already have history, ${fresh.length} to backfill in ${steps.length} steps`);

for (const [index, at] of steps.entries()) {
  const ids = index === steps.length - 1 ? accountIds : fresh;
  const { snapshots, deltas } = await poll({ ids, at });

  if (index % 10 === 0 || index === steps.length - 1) {
    log(`step ${index + 1}/${steps.length} ${fromUnixTime(at).toISOString()}: ${snapshots} snapshots, ${deltas} deltas`);
  }
}

clock = now;

await prisma.player.updateMany({
  where: { accountId: { in: [...activeIds].map(BigInt) } },
  data: { trackingTier: 'active', lastViewedAt: fromUnixTime(now), nextPollAt: fromUnixTime(now) }
});

const clanIds = clansOf({ world, accounts: selection.accounts, at: now });

log(`clans: syncing ${clanIds.length} clans with rosters, stronghold and global map`);

const clanSync = new ClanSyncService(prisma, guard, clients, webhooks);

for (const part of chunk(clanIds, SEED.chunk)) {
  await clanSync.refresh({ clanIds: part, snapshot: true });
}

for (let day = options.days; day >= 1; day -= 1) {
  const at = now - day * 86_400;
  const capturedAt = fromUnixTime(at - (at % 3600));

  clock = at;

  for (const part of chunk(clanIds, SEED.chunk)) {
    const [infos, maps] = await Promise.all([
      lesta.clans.info({ clanIds: part, fields: ['members_count'] }),
      lesta.globalmap.claninfo({ ids: part })
    ]);

    await prisma.clanSnapshot.createMany({
      data: part.flatMap((clanId) => {
        const map = z.object({ ratings: z.record(z.string(), z.number().nullable()) }).safeParse(maps[String(clanId)]);
        const info = infos[String(clanId)];

        return info
          ? [
              {
                clanId: BigInt(clanId),
                capturedAt,
                membersCount: info.members_count ?? 0,
                eloRating6: map.success ? (map.data.ratings.elo_6 ?? null) : null,
                eloRating8: map.success ? (map.data.ratings.elo_8 ?? null) : null,
                eloRating10: map.success ? (map.data.ratings.elo_10 ?? null) : null
              }
            ]
          : [];
      }),
      skipDuplicates: true
    });
  }
}

clock = now;

const clanHistory = new ClanHistoryService(prisma, clients);

for (const part of chunk(accountIds, SEED.chunk)) {
  await clanHistory.history({ accountIds: part });
}

log('reference: achievements catalog and mastery thresholds');
await new CatalogSyncService(prisma, clients).achievements();
await new MasteryThresholdsSyncService(prisma, clients).sync();

log(`mod battles: ${selection.mod.length} players over ${options.modDays} days`);

const expected = new Map(
  world.catalog.vehicles.map((vehicle) => [
    vehicle.tankId,
    {
      tankId: vehicle.tankId,
      expDamage: vehicle.expected.damage,
      expFrag: vehicle.expected.frags,
      expSpot: vehicle.expected.spot,
      expDef: vehicle.expected.def,
      expWinRate: vehicle.expected.winRate
    }
  ])
);

const writeModBattles = async (player: MockPlayer) => {
  const accountId = BigInt(player.accountId);
  const battles = battlesBetween({ world, player, from: now - options.modDays * 86_400, to: now });
  const mates = selection.mod.filter((other) => other.index !== player.index).map((other) => other.accountId);
  const events = battles.map((battle: MockBattle, index): BattleResultEvent => {
    const platoon = mates.length > 0 && (player.index + index) % 7 === 0 ? [mates[(player.index + index) % mates.length] ?? mates[0] ?? 0] : [];

    return toBattleEvent({ world, player, battle, platoonMates: platoon });
  });

  const previous = new Map<number, number>();
  const rows = events.map((event) => {
    const sessionId = event.session_id ? sessionUuid({ accountId, sessionId: event.session_id }) : null;
    const row = toBattleData({ event, accountId, deviceId: '', sessionId, previousMoePercent: previous.get(event.vehicle.tank_id) ?? null });

    if (event.moe) {
      previous.set(event.vehicle.tank_id, event.moe.damage_rating / 100);
    }

    return { ...row, deviceId: null, receivedAt: fromUnixTime(event.occurred_at + 5) };
  });

  const sessions = Object.values(
    groupBy(
      events.filter((event) => event.session_id !== null),
      (event) => event.session_id ?? ''
    )
  );

  for (const group of sessions) {
    const [first] = group;
    const last = group.at(-1);

    if (!first?.session_id || !last) {
      continue;
    }

    const id = sessionUuid({ accountId, sessionId: first.session_id });
    const increments = group.map(sessionIncrement);
    const tanks = Object.values(groupBy(group, (event) => String(event.vehicle.tank_id))).map((entries) => ({
      tankId: entries[0]?.vehicle.tank_id ?? 0,
      battles: entries.length,
      wins: entries.filter((event) => event.result === 'win').length,
      damageDealt: sumBy(entries, (event) => event.stats.damage_dealt),
      frags: sumBy(entries, (event) => event.stats.frags),
      spotted: sumBy(entries, (event) => event.stats.spotted),
      capturePoints: 0,
      droppedCapturePoints: 0
    }));

    const data = {
      accountId,
      source: 'mod' as const,
      kind: 'live' as const,
      status: last.occurred_at > now - 3600 ? ('open' as const) : ('closed' as const),
      startedAt: fromUnixTime(first.arena_created_at),
      endedAt: last.occurred_at > now - 3600 ? null : fromUnixTime(last.occurred_at),
      lastActivityAt: fromUnixTime(last.occurred_at),
      battles: sumBy(increments, (entry) => entry.battles),
      wins: sumBy(increments, (entry) => entry.wins),
      losses: sumBy(increments, (entry) => entry.losses),
      draws: sumBy(increments, (entry) => entry.draws),
      damageDealt: sumBy(increments, (entry) => entry.damageDealt),
      damageAssisted: sumBy(increments, (entry) => entry.damageAssisted),
      damageBlocked: sumBy(increments, (entry) => entry.damageBlocked),
      frags: sumBy(increments, (entry) => entry.frags),
      spotted: sumBy(increments, (entry) => entry.spotted),
      xp: sumBy(increments, (entry) => entry.xp),
      survived: sumBy(increments, (entry) => entry.survived),
      credits: sumBy(increments, (entry) => entry.credits),
      wn8: accountWn8({ tanks, expected }).wn8
    };

    await prisma.playSession.upsert({ where: { id }, create: { id, ...data }, update: data });
  }

  const written = await prisma.battle.createMany({ data: rows, skipDuplicates: true });
  const latest = new Map(events.filter((event) => event.moe).map((event) => [event.vehicle.tank_id, event]));

  for (const [tankId, event] of latest) {
    if (!event.moe) {
      continue;
    }

    const moe = {
      marksOnGun: event.moe.marks_on_gun,
      moePercent: event.moe.damage_rating / 100,
      moeMovingDamage: event.moe.moving_avg_damage,
      moeUpdatedAt: fromUnixTime(event.occurred_at)
    };

    await prisma.playerTank.upsert({
      where: { accountId_tankId: { accountId, tankId } },
      create: { accountId, tankId, ...moe },
      update: moe
    });
  }

  return written.count;
};

let battleRows = 0;

for (const player of selection.mod) {
  battleRows += await writeModBattles(player);
}

log(`mod battles written: ${battleRows}`);

log('aggregates: refreshing tank_daily_stats and running the nightly jobs');
await prisma.$executeRawUnsafe("CALL refresh_continuous_aggregate('tank_daily_stats', NULL, NULL)");

const tables = new ReferenceTablesService(prisma);
const ratings = new AccountRatingsService(prisma, tables);

for (const part of chunk(accountIds, 20)) {
  await Promise.all(part.map((accountId) => ratings.compute({ accountId })));
}

const jobs = [
  ['server stats', () => new ServerStatsService(prisma, tables).compute()],
  ['tank percentiles', () => new TankPercentilesService(prisma, tables).compute()],
  ['tier maintenance', () => new TierMaintenanceService(prisma).run()],
  ['tank economy', () => new TankEconomyService(prisma).compute()],
  ['learning curve', () => new LearningCurveService(prisma).compute()],
  ['build usage', () => new BuildUsageService(prisma).compute()],
  ['mode meta', () => new ModeMetaService(prisma).compute()]
] as const;

for (const [name, run] of jobs) {
  try {
    const result = await run();

    log(`${name}: ${JSON.stringify(result).slice(0, 160)}`);
  } catch (error) {
    log(`${name} failed: ${String(error)}`);
  }
}

const counts = await prisma.$queryRawUnsafe<{ name: string; count: bigint }[]>(`
  SELECT 'player' AS name, count(*) AS count FROM player
  UNION ALL SELECT 'account_snapshot', count(*) FROM account_snapshot
  UNION ALL SELECT 'tank_snapshot', count(*) FROM tank_snapshot
  UNION ALL SELECT 'tank_battle_delta', count(*) FROM tank_battle_delta
  UNION ALL SELECT 'player_tank', count(*) FROM player_tank
  UNION ALL SELECT 'clan', count(*) FROM clan
  UNION ALL SELECT 'clan_member', count(*) FROM clan_member
  UNION ALL SELECT 'clan_snapshot', count(*) FROM clan_snapshot
  UNION ALL SELECT 'battle', count(*) FROM battle
  UNION ALL SELECT 'play_session', count(*) FROM play_session
  UNION ALL SELECT 'account_rating', count(*) FROM account_rating
  UNION ALL SELECT 'account_tank_rating', count(*) FROM account_tank_rating
  UNION ALL SELECT 'tank_server_stats', count(*) FROM tank_server_stats
  UNION ALL SELECT 'achievement', count(*) FROM achievement
  UNION ALL SELECT 'tank_threshold', count(*) FROM tank_threshold
  UNION ALL SELECT 'build_usage_aggregate', count(*) FROM build_usage_aggregate
  UNION ALL SELECT 'tank_economy_aggregate', count(*) FROM tank_economy_aggregate
  UNION ALL SELECT 'tank_learning_curve', count(*) FROM tank_learning_curve
  UNION ALL SELECT 'mode_tank_aggregate', count(*) FROM mode_tank_aggregate
`);

console.table(counts.map((row) => ({ table: row.name, rows: Number(row.count) })));

await prisma.$disconnect();
