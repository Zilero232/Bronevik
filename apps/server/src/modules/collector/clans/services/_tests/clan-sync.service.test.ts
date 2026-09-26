import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { Clan, ClanMember } from '../../../../../../generated';
import type { LestaClients, PrismaService, WebhookEmitter } from '../../../../../core';
import type { ClanInfo } from '../../../../../lib/lesta';

import { PurgeGuardService } from '../../../purge';
import { CLANS } from '../../config';
import { ClanSyncService } from '../clan-sync.service';

const CLAN_ID = 500;

const member = (accountId: number, role = 'private') => ({ account_id: accountId, account_name: `p${accountId}`, joined_at: 1_600_000_000, role });

const clanInfo = (fields: Partial<ClanInfo> = {}): ClanInfo => ({
  clan_id: CLAN_ID,
  name: 'Clan',
  tag: 'CLN',
  created_at: 1_500_000_000,
  members_count: 2,
  members: [member(1), member(2)],
  ...fields
});

const storedMember = (accountId: number, role: ClanMember['role'] = 'private') => mock<ClanMember>({ accountId: BigInt(accountId), role });

type Setup = {
  info: ClanInfo | null;
  exists: boolean;
  stored?: ClanMember[];
  blocked?: number[];
};

const createSync = ({ info, exists, stored = [], blocked = [] }: Setup) => {
  const prisma = mockDeep<PrismaService>();
  const guard = mock<PurgeGuardService>();
  const clients = mockDeep<LestaClients>();
  const webhooks = mock<WebhookEmitter>();

  prisma.$transaction.mockImplementation(async (run) => (typeof run === 'function' ? run(prisma) : Promise.all(run)));
  prisma.clan.findUnique.mockResolvedValue(exists ? mock<Clan>({ clanId: BigInt(CLAN_ID) }) : null);
  prisma.clanMember.findMany.mockResolvedValue(stored);
  guard.blocked.mockResolvedValue(new Set(blocked));
  clients.bulk.clans.info.mockResolvedValue({ [String(CLAN_ID)]: info });
  clients.bulk.globalmap.claninfo.mockResolvedValue({});
  clients.bulk.stronghold.claninfo.mockResolvedValue({});

  return { prisma, clients, webhooks, sync: new ClanSyncService(prisma, guard, clients, webhooks) };
};

describe('ClanSyncService.refresh', () => {
  it('ignores a clan that Lesta does not know and we never stored', async () => {
    const { prisma, webhooks, sync } = createSync({ info: null, exists: false });

    expect(await sync.refresh({ clanIds: [CLAN_ID], snapshot: false })).toEqual({ clans: 1, events: 0 });
    expect(prisma.$transaction).not.toHaveBeenCalled();
    expect(webhooks.emit).not.toHaveBeenCalled();
  });

  it('stores a first-seen clan and its members without inventing join events', async () => {
    const { prisma, webhooks, sync } = createSync({ info: clanInfo(), exists: false });

    const result = await sync.refresh({ clanIds: [CLAN_ID], snapshot: false });

    expect(result.events).toBe(0);

    expect(prisma.player.createMany.mock.calls[0]?.[0]?.data).toEqual([
      expect.objectContaining({ accountId: 1n, nickname: 'p1', trackingTier: 'population' }),
      expect.objectContaining({ accountId: 2n, nickname: 'p2', trackingTier: 'population' })
    ]);

    expect(prisma.clanMemberEvent.createMany.mock.calls[0]?.[0]?.data).toEqual([]);
    expect(webhooks.emit).not.toHaveBeenCalled();
  });

  it('records joins and departures of a known clan and announces them', async () => {
    const { prisma, webhooks, sync } = createSync({
      info: clanInfo({ members: [member(1), member(3)] }),
      exists: true,
      stored: [storedMember(1), storedMember(2)]
    });

    const result = await sync.refresh({ clanIds: [CLAN_ID], snapshot: false });

    expect(result.events).toBe(2);
    expect(prisma.clanMember.deleteMany.mock.calls[0]?.[0]?.where).toMatchObject({ accountId: { in: [2n] } });

    expect(webhooks.emit).toHaveBeenCalledWith(
      expect.objectContaining({ event: 'clan.member_changed', subject: { accountIds: [3, 2], clanIds: [CLAN_ID] } })
    );
  });

  it('updates the stored role of a promoted member', async () => {
    const { prisma, sync } = createSync({
      info: clanInfo({ members: [member(1, 'commander')] }),
      exists: true,
      stored: [storedMember(1, 'private')]
    });

    await sync.refresh({ clanIds: [CLAN_ID], snapshot: false });

    expect(prisma.clanMember.upsert.mock.calls[0]?.[0]).toMatchObject({ where: { accountId: 1n }, update: { role: 'commander' } });
  });

  it('files a member with an unknown Lesta role under the default role', async () => {
    const { prisma, sync } = createSync({ info: clanInfo({ members: [member(1, 'space_admiral')] }), exists: false });

    await sync.refresh({ clanIds: [CLAN_ID], snapshot: false });

    expect(prisma.clanMember.upsert.mock.calls[0]?.[0].create).toMatchObject({ role: CLANS.defaultRole });
  });

  it('never stores a purged member', async () => {
    const { prisma, sync } = createSync({ info: clanInfo(), exists: false, blocked: [2] });

    await sync.refresh({ clanIds: [CLAN_ID], snapshot: false });

    expect(prisma.player.createMany.mock.calls[0]?.[0]?.data).toEqual([expect.objectContaining({ accountId: 1n })]);
    expect(prisma.clan.upsert.mock.calls[0]?.[0].update).toMatchObject({ membersCount: 1 });
  });

  it.each([
    ['disbanded', clanInfo({ is_clan_disbanded: true })],
    ['gone from Lesta', null]
  ])('empties the roster of a known clan that is %s', async (_, info) => {
    const { prisma, sync } = createSync({ info, exists: true, stored: [storedMember(1)] });

    await sync.refresh({ clanIds: [CLAN_ID], snapshot: false });

    expect(prisma.clan.upsert.mock.calls[0]?.[0].update).toMatchObject({ isDisbanded: true, membersCount: 0 });
    expect(prisma.clanMember.deleteMany.mock.calls[0]?.[0]?.where).toMatchObject({ accountId: { in: [1n] } });
  });

  it('writes no snapshot unless asked', async () => {
    const { prisma, clients, sync } = createSync({ info: clanInfo(), exists: true });

    await sync.refresh({ clanIds: [CLAN_ID], snapshot: false });

    expect(clients.bulk.globalmap.claninfo).not.toHaveBeenCalled();
    expect(prisma.clanSnapshot.upsert).not.toHaveBeenCalled();
  });

  it('snapshots only clans Lesta still returns', async () => {
    const { prisma, clients, sync } = createSync({ info: null, exists: false });

    await sync.refresh({ clanIds: [CLAN_ID], snapshot: true });

    expect(clients.bulk.globalmap.claninfo).not.toHaveBeenCalled();
    expect(prisma.clanSnapshot.upsert).not.toHaveBeenCalled();
  });

  it('reads elo ratings and the stronghold level into the snapshot', async () => {
    const { prisma, clients, sync } = createSync({ info: clanInfo(), exists: true });
    const [levelKey = ''] = CLANS.strongholdLevelKeys;

    clients.bulk.globalmap.claninfo.mockResolvedValue({ [String(CLAN_ID)]: { ratings: { [CLANS.eloKeys.eloRating10]: 1200 } } });
    clients.bulk.stronghold.claninfo.mockResolvedValue({ [String(CLAN_ID)]: { [levelKey]: 7 } });

    await sync.refresh({ clanIds: [CLAN_ID], snapshot: true });

    expect(prisma.clanSnapshot.upsert.mock.calls[0]?.[0].create).toMatchObject({
      eloRating10: 1200,
      eloRating6: null,
      membersCount: clanInfo().members_count
    });

    expect(prisma.clanStronghold.upsert.mock.calls[0]?.[0].update).toMatchObject({ level: 7 });
  });

  it('still snapshots the clan when the global map and stronghold requests fail', async () => {
    const { prisma, clients, sync } = createSync({ info: clanInfo(), exists: true });

    clients.bulk.globalmap.claninfo.mockRejectedValue(new Error('SOURCE_NOT_AVAILABLE'));
    clients.bulk.stronghold.claninfo.mockRejectedValue(new Error('SOURCE_NOT_AVAILABLE'));

    await sync.refresh({ clanIds: [CLAN_ID], snapshot: true });

    expect(prisma.clanSnapshot.upsert.mock.calls[0]?.[0].create).toMatchObject({ eloRating6: null, eloRating8: null, eloRating10: null });
    expect(prisma.clanStronghold.upsert).not.toHaveBeenCalled();
  });
});
