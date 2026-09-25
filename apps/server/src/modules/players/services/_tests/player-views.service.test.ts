import RedisMock from 'ioredis-mock';
import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { Player } from '../../../../../generated';
import type { PrismaService } from '../../../../core';

import { PlayerViewsService } from '../player-views.service';

const player = ({ accountId, nickname }: { accountId: bigint; nickname: string }): Player => {
  const row = { ...mock<Player>(), accountId, nickname, clanId: null, ratings: [{ wn8: 1_500 }] };

  return row;
};

const createService = () => {
  const prisma = mockDeep<PrismaService>();
  const redis = new RedisMock();

  prisma.clan.findMany.mockResolvedValue([]);

  return { service: new PlayerViewsService(prisma, redis), prisma, redis };
};

const settle = async () => {
  await new Promise((resolve) => setTimeout(resolve, 10));
};

describe('PlayerViewsService.popular', () => {
  it('ranks the most viewed players first', async () => {
    const { service, prisma, redis } = createService();

    await redis.flushall();
    service.record(1n);
    service.record(2n);
    service.record(2n);
    await settle();

    prisma.player.findMany.mockResolvedValue([player({ accountId: 1n, nickname: 'One' }), player({ accountId: 2n, nickname: 'Two' })]);

    const popular = await service.popular({ days: 7, limit: 10 });

    expect(popular.items.map((item) => item.nickname)).toEqual(['Two', 'One']);
    expect(popular.items[0]?.views).toBe(2);
  });

  it('leaves out players the database no longer shows', async () => {
    const { service, prisma, redis } = createService();

    await redis.flushall();
    service.record(3n);
    await settle();

    prisma.player.findMany.mockResolvedValue([]);

    expect((await service.popular({ days: 1, limit: 10 })).items).toEqual([]);
  });
});
