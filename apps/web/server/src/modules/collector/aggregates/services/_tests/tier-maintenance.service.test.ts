import { subDays } from 'date-fns';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { TIER_MAINTENANCE } from '../../config';
import { TierMaintenanceService } from '../tier-maintenance.service';
import { createPrisma } from './aggregates.fixtures';

const NOW = new Date('2026-09-26T12:00:00Z');

const createMaintenance = () => {
  const prisma = createPrisma();

  prisma.$executeRaw.mockResolvedValue(0);
  prisma.player.updateMany.mockResolvedValue({ count: 0 });

  return { prisma, service: new TierMaintenanceService(prisma) };
};

const statements = (prisma: ReturnType<typeof createPrisma>) =>
  prisma.$executeRaw.mock.calls.flatMap(([sql]) => ('raw' in sql ? [] : [{ text: sql.sql, values: sql.values }]));

describe('TierMaintenanceService.run', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('resolves the pinned accounts inside the database instead of binding every id', async () => {
    const { prisma, service } = createMaintenance();

    await service.run();

    const [promote, demote] = statements(prisma);

    expect(promote?.text).toContain('user_lesta_account');
    expect(promote?.values).toEqual([NOW]);
    expect(demote?.values).toEqual([subDays(NOW, TIER_MAINTENANCE.activeIdleDays)]);
  });

  it('revives and retires players around the same dormancy boundary', async () => {
    const { prisma, service } = createMaintenance();
    const boundary = subDays(NOW, TIER_MAINTENANCE.dormantAfterDays);

    await service.run();

    const [revive, retire] = prisma.player.updateMany.mock.calls.map(([args]) => args);

    expect(revive?.where).toEqual({ trackingTier: 'dormant', lastBattleAt: { gte: boundary } });
    expect(retire?.where).toEqual({ trackingTier: 'population', lastBattleAt: { lt: boundary } });
  });

  it('reports the count of each transition', async () => {
    const { prisma, service } = createMaintenance();

    prisma.$executeRaw.mockResolvedValueOnce(1).mockResolvedValueOnce(2);
    prisma.player.updateMany.mockResolvedValueOnce({ count: 3 }).mockResolvedValueOnce({ count: 4 });

    expect(await service.run()).toEqual({ promoted: 1, demoted: 2, revived: 3, retired: 4 });
  });
});
