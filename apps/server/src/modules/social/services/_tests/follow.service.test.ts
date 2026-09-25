import { describe, expect, it } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import type { Follow, UserLestaAccount } from '../../../../../generated';
import type { PrismaService } from '../../../../core';

import { AppConflictException, AppNotFoundException } from '../../../../common/exceptions';
import { FEED } from '../../config';
import { FollowService } from '../follow.service';

const at = new Date('2026-09-01T00:00:00Z');

const follow = (targetId: bigint): Follow => ({
  id: `f-${targetId}`,
  userId: 'u1',
  kind: 'player',
  targetId,
  events: [],
  createdAt: at,
  updatedAt: at
});

const link = (accountId: bigint): UserLestaAccount => ({
  id: `link-${accountId}`,
  userId: 'u1',
  accountId,
  accessToken: null,
  tokenExpiresAt: null,
  isPrimary: false,
  linkedAt: at,
  updatedAt: at
});

const createService = () => {
  const prisma = mockDeep<PrismaService>();

  prisma.follow.findMany.mockResolvedValue([]);
  prisma.player.findMany.mockResolvedValue([]);

  return { service: new FollowService(prisma), prisma };
};

describe('FollowService.create', () => {
  it('refuses a follow once the limit is reached', async () => {
    const { service, prisma } = createService();

    prisma.follow.count.mockResolvedValue(FEED.maxFollows);

    await expect(service.create({ userId: 'u1', kind: 'player', targetId: 7 })).rejects.toBeInstanceOf(AppConflictException);
    expect(prisma.follow.upsert).not.toHaveBeenCalled();
  });

  it('accepts the last follow below the limit', async () => {
    const { service, prisma } = createService();

    prisma.follow.count.mockResolvedValue(FEED.maxFollows - 1);

    await service.create({ userId: 'u1', kind: 'player', targetId: 7 });

    expect(prisma.follow.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId_kind_targetId: { userId: 'u1', kind: 'player', targetId: 7n } } })
    );
  });
});

describe('FollowService.remove', () => {
  it('reports a follow that is not the caller’s as missing', async () => {
    const { service, prisma } = createService();

    prisma.follow.deleteMany.mockResolvedValue({ count: 0 });

    await expect(service.remove({ userId: 'u1', id: 'f-1' })).rejects.toBeInstanceOf(AppNotFoundException);
  });
});

describe('FollowService.circle', () => {
  it('merges own accounts with followed players without duplicates', async () => {
    const { service, prisma } = createService();

    prisma.follow.findMany.mockResolvedValue([follow(2n), follow(3n)]);
    prisma.userLestaAccount.findMany.mockResolvedValue([link(1n), link(2n)]);

    const circle = await service.circle('u1');

    expect(circle.accountIds.toSorted()).toEqual([1n, 2n, 3n]);
    expect(circle.own).toEqual(new Set([1n, 2n]));
  });

  it('only follows of players widen the circle', async () => {
    const { service, prisma } = createService();

    prisma.userLestaAccount.findMany.mockResolvedValue([]);

    await service.circle('u1');

    expect(prisma.follow.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { userId: 'u1', kind: 'player' } }));
  });
});
