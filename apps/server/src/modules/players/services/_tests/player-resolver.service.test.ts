import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { Player } from '../../../../../generated';
import type { PrismaService } from '../../../../core';
import type { BattleStatsBlock, LestaClient } from '../../../../lib/lesta';
import type { CollectorProducerService } from '../../../collector';
import type { LestaPlayerInfo } from '../../players.types';

import { AppNotFoundException } from '../../../../common/exceptions';
import { PlayerResolverService } from '../player-resolver.service';

const NOW = new Date('2026-09-26T12:00:00.000Z');

const BLOCK: BattleStatsBlock = {
  battles: 10,
  wins: 5,
  losses: 5,
  draws: 0,
  xp: 5000,
  damage_dealt: 15_000,
  damage_received: 12_000,
  frags: 6,
  spotted: 8,
  capture_points: 0,
  dropped_capture_points: 1,
  hits: 60,
  shots: 80,
  survived_battles: 3
};

const INFO: LestaPlayerInfo = {
  account_id: 42,
  nickname: 'Tanker',
  clan_id: null,
  global_rating: 5000,
  created_at: 1_600_000_000,
  last_battle_time: 1_700_000_000,
  logout_at: null,
  updated_at: 1_700_000_100,
  statistics: { all: BLOCK }
};

const createService = () => {
  const prisma = mockDeep<PrismaService>();
  const collector = mock<CollectorProducerService>();
  const lesta = mockDeep<LestaClient>();

  prisma.player.update.mockResolvedValue(mock<Player>());

  return { service: new PlayerResolverService(prisma, collector, lesta), prisma, collector, lesta };
};

describe('PlayerResolverService.resolve', () => {
  it('treats a numeric input as an account id without a nickname lookup', async () => {
    const { service, prisma } = createService();

    prisma.player.findUnique.mockResolvedValue(mock<Player>({ accountId: 42n, isHidden: false }));

    await expect(service.resolve('42')).resolves.toBe(42n);
    expect(prisma.player.findFirst).not.toHaveBeenCalled();
  });

  it('resolves a known nickname from the local database without calling Lesta', async () => {
    const { service, prisma, lesta } = createService();

    prisma.player.findFirst.mockResolvedValue(mock<Player>({ accountId: 7n, isHidden: false }));
    prisma.player.findUnique.mockResolvedValue(mock<Player>({ accountId: 7n, isHidden: false }));

    await expect(service.resolve('Tanker')).resolves.toBe(7n);
    expect(lesta.account.list).not.toHaveBeenCalled();
  });

  it('falls back to an exact Lesta search for an unknown nickname', async () => {
    const { service, prisma, lesta } = createService();

    prisma.player.findFirst.mockResolvedValue(null);
    lesta.account.list.mockResolvedValue([{ account_id: 42, nickname: 'Tanker' }]);
    prisma.player.findUnique.mockResolvedValue(mock<Player>({ accountId: 42n, isHidden: false }));

    await expect(service.resolve('Tanker')).resolves.toBe(42n);
  });

  it('answers 404 when Lesta knows no such nickname', async () => {
    const { service, prisma, lesta } = createService();

    prisma.player.findFirst.mockResolvedValue(null);
    lesta.account.list.mockResolvedValue([]);

    await expect(service.resolve('Nobody')).rejects.toBeInstanceOf(AppNotFoundException);
  });
});

describe('PlayerResolverService.ensure', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('hides a player who asked to be hidden', async () => {
    const { service, prisma } = createService();

    prisma.player.findUnique.mockResolvedValue(mock<Player>({ accountId: 42n, isHidden: true }));

    await expect(service.ensure(42n)).rejects.toMatchObject({ response: { code: 'LESTA_ACCOUNT_HIDDEN' } });
    expect(prisma.player.update).not.toHaveBeenCalled();
  });

  it('records the view of a known player without enrolling it again', async () => {
    const { service, prisma, collector } = createService();

    prisma.player.findUnique.mockResolvedValue(mock<Player>({ accountId: 42n, isHidden: false }));

    await expect(service.ensure(42n)).resolves.toBe(42n);
    expect(prisma.player.update).toHaveBeenCalledWith(expect.objectContaining({ where: { accountId: 42n }, data: { lastViewedAt: NOW } }));
    expect(collector.enrol).not.toHaveBeenCalled();
  });

  it('still resolves when recording the view fails', async () => {
    const { service, prisma } = createService();

    prisma.player.findUnique.mockResolvedValue(mock<Player>({ accountId: 42n, isHidden: false }));
    prisma.player.update.mockRejectedValue(new Error('db down'));

    await expect(service.ensure(42n)).resolves.toBe(42n);
  });

  it('imports an unknown player from Lesta and enrols it with high priority', async () => {
    const { service, prisma, lesta, collector } = createService();

    prisma.player.findUnique.mockResolvedValue(null);
    lesta.account.info.mockResolvedValue({ '42': INFO });

    await expect(service.ensure(42n)).resolves.toBe(42n);
    expect(prisma.player.upsert).toHaveBeenCalledWith(expect.objectContaining({ where: { accountId: 42n } }));
    expect(collector.enrol).toHaveBeenCalledWith(expect.objectContaining({ accountId: 42, priority: 'high' }));
  });

  it('answers 404 when neither the database nor Lesta know the id', async () => {
    const { service, prisma, lesta, collector } = createService();

    prisma.player.findUnique.mockResolvedValue(null);
    lesta.account.info.mockResolvedValue({ '42': null });

    await expect(service.ensure(42n)).rejects.toMatchObject({ response: { code: 'PLAYER_NOT_FOUND' } });
    expect(collector.enrol).not.toHaveBeenCalled();
  });
});

describe('PlayerResolverService.upsertFromLesta', () => {
  it('stores the clan id as a bigint and keeps a clanless player without one', async () => {
    const { service, prisma } = createService();

    await service.upsertFromLesta({ ...INFO, clan_id: 500 });
    await service.upsertFromLesta(INFO);

    expect(prisma.player.upsert.mock.calls[0]?.[0].create).toMatchObject({ clanId: 500n, nickname: 'Tanker' });
    expect(prisma.player.upsert.mock.calls[1]?.[0].create).toMatchObject({ clanId: null });
  });

  it('keeps the nickname history of the account', async () => {
    const { service, prisma } = createService();

    await service.upsertFromLesta(INFO);

    expect(prisma.playerNickname.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ where: { accountId_nickname: { accountId: 42n, nickname: 'Tanker' } } })
    );
  });
});
