import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { createLestaMockHandler } from '..';
import { LESTA_MOCK, lestaMockBaseUrl } from '../../../../../config';
import { createLestaClient, LestaApiError } from '../../../../../lib/lesta';
import { MOCK_TIME } from '../../../config';
import { mockAccessToken } from '../../token';
import { createLestaMockFetch } from '../../transport';
import { stintAt } from '../../world';
import { DAY, fixtureWorld } from '../../world/_tests/fixtures';

const NOW = MOCK_TIME.anchor + 150 * DAY + 21 * 3600;
const handler = createLestaMockHandler(fixtureWorld);
const clientFor = (applicationId: string = LESTA_MOCK.applicationId) =>
  createLestaClient({
    applicationId,
    baseUrl: lestaMockBaseUrl('http://localhost:4000'),
    fetch: createLestaMockFetch({ handler, clock: () => NOW }),
    retry: { retries: 0 }
  });

const lesta = clientFor();
const players = fixtureWorld.players.filter((player) => player.activity === 'regular').slice(0, 25);
const accountIds = players.map((player) => player.accountId);

describe('Lesta mock endpoints', () => {
  it('keeps account/info, account/tanks and tanks/stats consistent', async () => {
    const infos = await lesta.account.info({ accountIds, extra: ['statistics.random'] });
    const tanks = await lesta.account.tanks({ accountIds });

    for (const accountId of accountIds.slice(0, 5)) {
      const info = infos[String(accountId)];
      const list = tanks[String(accountId)] ?? [];
      const stats = await lesta.tanks.stats({ accountId, extra: ['random'] });

      expect(info?.statistics.all.battles).toBe(list.reduce((sum, tank) => sum + tank.statistics.battles, 0));
      expect(info?.statistics.random?.battles).toBe(stats.reduce((sum, tank) => sum + (tank.random?.battles ?? 0), 0));
      expect(stats.map((tank) => tank.all.battles).sort()).toEqual(list.map((tank) => tank.statistics.battles).sort());
      expect(info?.last_battle_time).toBeLessThanOrEqual(NOW);
    }
  });

  it('finds players by exact and prefix search', async () => {
    const [player] = players;

    if (!player) {
      throw new Error('no players');
    }

    const exact = await lesta.account.list({ search: player.nickname.toUpperCase(), type: 'exact' });
    const prefix = await lesta.account.list({ search: player.nickname.slice(0, 3), limit: 100 });

    expect(exact).toEqual([{ nickname: player.nickname, account_id: player.accountId }]);
    expect(prefix.some((entry) => entry.account_id === player.accountId)).toBe(true);
    await expect(lesta.account.list({ search: 'ab' })).rejects.toBeInstanceOf(LestaApiError);
  });

  it('agrees on clan membership across clans/info, clans/accountinfo and account/info', async () => {
    const member = fixtureWorld.players.find((player) => stintAt({ player, at: NOW }) !== null);
    const stint = member ? stintAt({ player: member, at: NOW }) : null;

    if (!member || !stint) {
      throw new Error('no clan member');
    }

    const [info, accountInfo, clans] = await Promise.all([
      lesta.account.info({ accountIds: [member.accountId], fields: ['clan_id'] }),
      lesta.clans.accountinfo({ accountIds: [member.accountId] }),
      lesta.clans.info({ clanIds: [stint.clanId] })
    ]);

    const clan = clans[String(stint.clanId)];

    expect(info[String(member.accountId)]?.clan_id).toBe(stint.clanId);
    expect(accountInfo[String(member.accountId)]?.clan_id).toBe(stint.clanId);
    expect(clan?.members?.some((entry) => entry.account_id === member.accountId)).toBe(true);
    expect(clan?.members_count).toBe(clan?.members?.length);
  });

  it('returns private data only for a valid mock token', async () => {
    const [player] = players;

    if (!player) {
      throw new Error('no players');
    }

    const token = mockAccessToken({ seed: fixtureWorld.seed, accountId: player.accountId });
    const own = await lesta.account.info({ accountIds: [player.accountId], accessToken: token, fields: ['account_id', 'nickname', 'private'] });

    expect(own[String(player.accountId)]?.private).toMatchObject({ is_bound_to_phone: true });

    await expect(lesta.account.info({ accountIds: [player.accountId], accessToken: 'f'.repeat(40) })).rejects.toMatchObject({
      code: 'INVALID_ACCESS_TOKEN'
    });
  });

  it('serves the servers, encyclopedia and ratings a real client expects', async () => {
    const servers = await lesta.wgn.servers();
    const info = await lesta.encyclopedia.info();
    const vehicles = await lesta.encyclopedia.allVehicles();
    const top = await lesta.ratings.top({ params: { type: 'all', rank_field: 'battles_count', limit: 20 } });

    expect(servers.length).toBeGreaterThan(5);
    expect(servers.every((server) => server.players_online > 0)).toBe(true);
    expect(info.game_version).toBe(fixtureWorld.catalog.gameVersion);
    expect(Object.keys(vehicles)).toHaveLength(fixtureWorld.catalog.vehicles.length);
    expect(Array.isArray(top) && top.length).toBe(20);
  });

  it('peaks the online in the Moscow evening', async () => {
    const at = (hour: number) =>
      createLestaClient({
        applicationId: LESTA_MOCK.applicationId,
        baseUrl: lestaMockBaseUrl('http://localhost:4000'),
        fetch: createLestaMockFetch({ handler, clock: () => MOCK_TIME.anchor + 100 * DAY + hour * 3600 })
      }).wgn.servers();

    const total = async (hour: number) => (await at(hour)).reduce((sum, server) => sum + server.players_online, 0);

    expect(await total(21)).toBeGreaterThan(3 * (await total(5)));
  });

  it('rejects a foreign application id and unknown methods like Lesta does', async () => {
    await expect(clientFor('someone-else').wgn.servers()).rejects.toMatchObject({ code: 'INVALID_APPLICATION_ID' });

    await expect(lesta.request({ method: 'account/unknown', params: {}, schema: z.unknown() })).rejects.toMatchObject({
      code: 'METHOD_NOT_FOUND'
    });
  });
});
