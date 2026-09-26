import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { PlatoonPost } from '../../../../../generated';
import type { PrismaService } from '../../../../core';
import type { CommunityAccountsService, PlayerStats } from '../../../community-core';

import { AppBadRequestException } from '../../../../common/exceptions';
import { PLATOON } from '../../config';
import { PlatoonService } from '../platoon.service';

const now = new Date('2026-09-25T12:00:00Z');
const hourMs = 3_600_000;

const post = (id: string, accountId: bigint): PlatoonPost => ({
  id,
  userId: `user-${id}`,
  accountId,
  tiers: [10],
  modes: ['random'],
  tankIds: [],
  hasVoice: false,
  minWn8: null,
  message: null,
  status: 'open',
  availableFrom: null,
  availableUntil: null,
  expiresAt: new Date(now.getTime() + hourMs),
  createdAt: now
});

const stats = (wn8: number | null): PlayerStats => ({ battles: 1000, wn8, winRate: 0.5 });

const page = { limit: 20, offset: 0 };

const request = { userId: 'u1', tiers: [10], modes: [], tankIds: [], hasVoice: false, expiresInHours: PLATOON.defaultHours };

const createService = () => {
  const prisma = mockDeep<PrismaService>();
  const accounts = mock<CommunityAccountsService>();

  accounts.accountOf.mockResolvedValue(7n);
  accounts.statsOf.mockResolvedValue(new Map());
  accounts.nicknamesOf.mockResolvedValue(new Map());

  return { service: new PlatoonService(prisma, accounts), prisma, accounts };
};

beforeEach(() => {
  vi.useFakeTimers({ now });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('PlatoonService.create', () => {
  it('closes the previous open post of the user before creating a new one', async () => {
    const { service, prisma } = createService();

    prisma.platoonPost.create.mockResolvedValue(post('p1', 7n));

    await service.create(request);

    expect(prisma.platoonPost.updateMany).toHaveBeenCalledWith({ where: { userId: 'u1', status: 'open' }, data: { status: 'closed' } });
    expect(prisma.platoonPost.updateMany.mock.invocationCallOrder[0]).toBeLessThan(prisma.platoonPost.create.mock.invocationCallOrder[0] ?? 0);
  });

  it('expires the post after the requested number of hours', async () => {
    const { service, prisma } = createService();

    prisma.platoonPost.create.mockResolvedValue(post('p1', 7n));

    await service.create({ ...request, expiresInHours: PLATOON.maxHours });

    expect(prisma.platoonPost.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ accountId: 7n, expiresAt: new Date(now.getTime() + PLATOON.maxHours * hourMs) })
    });
  });

  it('refuses a window that ends before it starts', async () => {
    const { service, prisma } = createService();

    await expect(
      service.create({ ...request, availableFrom: '2026-09-25T20:00:00Z', availableUntil: '2026-09-25T18:00:00Z' })
    ).rejects.toBeInstanceOf(AppBadRequestException);

    expect(prisma.platoonPost.updateMany).not.toHaveBeenCalled();
  });
});

describe('PlatoonService.list', () => {
  it('keeps only posts whose author WN8 is inside the requested range', async () => {
    const { service, prisma, accounts } = createService();

    prisma.platoonPost.findMany.mockResolvedValue([post('low', 1n), post('mid', 2n), post('high', 3n), post('unknown', 4n)]);

    accounts.statsOf.mockResolvedValue(
      new Map([
        [1n, stats(900)],
        [2n, stats(1500)],
        [3n, stats(2500)]
      ])
    );

    const result = await service.list({ ...page, minWn8: 1000, maxWn8: 2000 });

    expect(result.items.map((item) => item.id)).toEqual(['mid']);
    expect(result.total).toBe(1);
  });

  it('includes the exact boundary values', async () => {
    const { service, prisma, accounts } = createService();

    prisma.platoonPost.findMany.mockResolvedValue([post('min', 1n), post('max', 2n)]);

    accounts.statsOf.mockResolvedValue(
      new Map([
        [1n, stats(1000)],
        [2n, stats(2000)]
      ])
    );

    expect((await service.list({ ...page, minWn8: 1000, maxWn8: 2000 })).total).toBe(2);
  });

  it('drops a post without WN8 once a WN8 filter is set', async () => {
    const { service, prisma, accounts } = createService();

    prisma.platoonPost.findMany.mockResolvedValue([post('unknown', 4n)]);
    accounts.statsOf.mockResolvedValue(new Map([[4n, stats(null)]]));

    expect((await service.list({ ...page, maxWn8: 2000 })).total).toBe(0);
  });

  it('keeps posts without stats when no WN8 filter is set', async () => {
    const { service, prisma } = createService();

    prisma.platoonPost.findMany.mockResolvedValue([post('unknown', 4n)]);

    expect((await service.list(page)).total).toBe(1);
  });

  it('pages after filtering', async () => {
    const { service, prisma } = createService();

    prisma.platoonPost.findMany.mockResolvedValue([post('a', 1n), post('b', 2n), post('c', 3n)]);

    const result = await service.list({ limit: 1, offset: 1 });

    expect(result.items.map((item) => item.id)).toEqual(['b']);
    expect(result.total).toBe(3);
  });
});

describe('PlatoonService.expire', () => {
  it('expires open posts past their deadline and reports the count', async () => {
    const { service, prisma } = createService();

    prisma.platoonPost.updateMany.mockResolvedValue({ count: 2 });

    expect(await service.expire(now)).toBe(2);
    expect(prisma.platoonPost.updateMany).toHaveBeenCalledWith({ where: { status: 'open', expiresAt: { lte: now } }, data: { status: 'expired' } });
  });
});
