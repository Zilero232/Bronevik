import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import type { PrismaService } from '../../../../core';

import { TankTrendService } from '../tank-trend.service';

const createService = () => {
  const prisma = mockDeep<PrismaService>();

  prisma.$queryRaw.mockResolvedValue([]);

  return { service: new TankTrendService(prisma), prisma };
};

const windowStart = (prisma: ReturnType<typeof createService>['prisma']) =>
  prisma.$queryRaw.mock.calls[0]?.slice(1).find((value) => value instanceof Date);

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-09-26T12:30:00Z'));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('TankTrendService.trend', () => {
  it('counts today as the last day of the window, starting at Moscow midnight', async () => {
    const { service, prisma } = createService();

    await service.trend({ tankId: 1, query: { days: 7, mode: 'random' } });

    expect(windowStart(prisma)).toEqual(new Date('2026-09-19T21:00:00Z'));
  });

  it('turns the daily rows into points', async () => {
    const { service, prisma } = createService();

    prisma.$queryRaw.mockResolvedValue([{ day: '2026-09-25', battles: 10, wins: 6, damage: 20_000, players: 4 }]);

    const trend = await service.trend({ tankId: 1, query: { days: 7, mode: 'random' } });

    expect(trend).toMatchObject({ tankId: 1, mode: 'random', days: 7 });
    expect(trend.points).toEqual([{ date: '2026-09-25', battles: 10, players: 4, winRate: 60, avgDamage: 2_000 }]);
  });
});
