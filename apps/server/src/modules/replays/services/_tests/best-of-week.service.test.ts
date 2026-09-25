import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { Replay } from '../../../../../generated';
import type { PrismaService } from '../../../../core';

import { BEST_OF_WEEK } from '../../config';
import { BestOfWeekService } from '../best-of-week.service';

const now = new Date('2026-09-21T00:10:00Z');

describe('BestOfWeekService.feature', () => {
  it('marks the top replays of the previous week as featured', async () => {
    const prisma = mockDeep<PrismaService>();

    prisma.replay.findMany.mockResolvedValue([mock<Replay>({ id: 'a' }), mock<Replay>({ id: 'b' })]);
    prisma.replay.updateMany.mockResolvedValue({ count: 2 });

    expect(await new BestOfWeekService(prisma).feature(now)).toBe(2);

    const query = prisma.replay.findMany.mock.calls[0]?.[0];

    expect(query).toMatchObject({ take: BEST_OF_WEEK.size, orderBy: { damageDealt: 'desc' } });
    expect(query?.where?.playedAt).toEqual({ gte: new Date('2026-09-14T00:00:00Z'), lt: new Date('2026-09-21T00:00:00Z') });
    expect(prisma.replay.updateMany).toHaveBeenCalledWith({ where: { id: { in: ['a', 'b'] } }, data: { isFeatured: true } });
  });

  it('returns 0 without writing when the week had no replays', async () => {
    const prisma = mockDeep<PrismaService>();

    prisma.replay.findMany.mockResolvedValue([]);

    expect(await new BestOfWeekService(prisma).feature(now)).toBe(0);
    expect(prisma.replay.updateMany).not.toHaveBeenCalled();
  });
});
