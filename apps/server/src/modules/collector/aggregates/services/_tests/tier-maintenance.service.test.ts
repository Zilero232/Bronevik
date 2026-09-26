import { subDays } from 'date-fns';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mock } from 'vitest-mock-extended';

import type { Favorite, Follow, ModDevice, UserLestaAccount } from '../../../../../../generated';

import { TIER_MAINTENANCE } from '../../config';
import { TierMaintenanceService } from '../tier-maintenance.service';
import { createPrisma } from './aggregates.fixtures';

const NOW = new Date('2026-09-26T12:00:00Z');

const createMaintenance = () => {
  const prisma = createPrisma();

  prisma.favorite.findMany.mockResolvedValue([mock<Favorite>({ targetId: 1n }), mock<Favorite>({ targetId: 2n })]);
  prisma.follow.findMany.mockResolvedValue([mock<Follow>({ targetId: 2n })]);
  prisma.userLestaAccount.findMany.mockResolvedValue([mock<UserLestaAccount>({ accountId: 3n })]);
  prisma.modDevice.findMany.mockResolvedValue([mock<ModDevice>({ accountId: null }), mock<ModDevice>({ accountId: 4n })]);
  prisma.player.updateMany.mockResolvedValue({ count: 0 });

  return { prisma, service: new TierMaintenanceService(prisma) };
};

const updates = (prisma: ReturnType<typeof createPrisma>) => prisma.player.updateMany.mock.calls.map(([args]) => args);

describe('TierMaintenanceService.run', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('promotes every pinned account once, however many ways it is pinned', async () => {
    const { prisma, service } = createMaintenance();

    await service.run();

    const [promote] = updates(prisma);

    expect(promote?.where?.accountId).toEqual({ in: [1n, 2n, 3n, 4n] });
    expect(promote?.data).toEqual({ trackingTier: 'active', nextPollAt: NOW });
  });

  it('demotes unpinned active players idle for longer than the window, including never-viewed ones', async () => {
    const { prisma, service } = createMaintenance();

    await service.run();

    const [, demote] = updates(prisma);

    expect(demote?.where).toMatchObject({
      trackingTier: 'active',
      accountId: { notIn: [1n, 2n, 3n, 4n] },
      OR: [{ lastViewedAt: null }, { lastViewedAt: { lt: subDays(NOW, TIER_MAINTENANCE.activeIdleDays) } }]
    });

    expect(demote?.data).toEqual({ trackingTier: 'population' });
  });

  it('revives and retires players around the same dormancy boundary', async () => {
    const { prisma, service } = createMaintenance();
    const boundary = subDays(NOW, TIER_MAINTENANCE.dormantAfterDays);

    await service.run();

    const [, , revive, retire] = updates(prisma);

    expect(revive?.where).toEqual({ trackingTier: 'dormant', lastBattleAt: { gte: boundary } });
    expect(retire?.where).toEqual({ trackingTier: 'population', lastBattleAt: { lt: boundary } });
  });

  it('reports the count of each transition', async () => {
    const { prisma, service } = createMaintenance();

    prisma.player.updateMany
      .mockResolvedValueOnce({ count: 1 })
      .mockResolvedValueOnce({ count: 2 })
      .mockResolvedValueOnce({ count: 3 })
      .mockResolvedValueOnce({ count: 4 });

    expect(await service.run()).toEqual({ promoted: 1, demoted: 2, revived: 3, retired: 4 });
  });
});
