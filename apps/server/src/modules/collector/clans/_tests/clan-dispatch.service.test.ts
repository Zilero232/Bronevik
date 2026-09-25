import type { Queue } from 'bullmq';

import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { ClanWorkspace, Favorite, Follow, Player } from '../../../../../generated';
import type { PrismaService } from '../../../../core';

import { ClanDispatchService } from '../services';

const createDispatch = () => {
  const prisma = mockDeep<PrismaService>();
  const queue = mock<Queue>();

  prisma.$transaction.mockResolvedValue([]);
  prisma.favorite.findMany.mockResolvedValue([mock<Favorite>({ targetId: 10n })]);
  prisma.follow.findMany.mockResolvedValue([mock<Follow>({ targetId: 10n })]);
  prisma.clanWorkspace.findMany.mockResolvedValue([mock<ClanWorkspace>({ clanId: 20n })]);
  prisma.player.findMany.mockResolvedValue([mock<Player>({ clanId: 30n }), mock<Player>({ clanId: null })]);

  return { prisma, queue, dispatch: new ClanDispatchService(prisma, queue) };
};

describe('ClanDispatchService', () => {
  it('refreshes each tracked clan once and snapshots them', async () => {
    const { queue, dispatch } = createDispatch();

    expect(await dispatch.dispatch({ scope: 'tracked' })).toBe(3);

    const [jobs] = queue.addBulk.mock.calls[0] ?? [];

    expect(jobs?.map((job) => job.data)).toEqual([{ clanIds: [10, 20, 30], snapshot: true }]);
  });

  it('flags the tracked set and clears the flag on clans that left it', async () => {
    const { prisma, dispatch } = createDispatch();

    await dispatch.dispatch({ scope: 'tracked' });

    const [clear, mark] = prisma.clan.updateMany.mock.calls.map(([args]) => args);

    expect(clear?.data).toEqual({ isTracked: false });
    expect(clear?.where?.clanId).toEqual({ notIn: [10n, 20n, 30n] });
    expect(mark?.data).toEqual({ isTracked: true });
    expect(mark?.where?.clanId).toEqual({ in: [10n, 20n, 30n] });
  });

  it('leaves the tracked flag alone on the full sweep', async () => {
    const { prisma, dispatch } = createDispatch();

    prisma.clan.findMany.mockResolvedValue([]);

    await dispatch.dispatch({ scope: 'all' });

    expect(prisma.clan.updateMany).not.toHaveBeenCalled();
  });
});
