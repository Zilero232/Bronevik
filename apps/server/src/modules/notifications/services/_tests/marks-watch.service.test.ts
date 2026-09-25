import type { VehicleSummary } from '@bronevik/schemas';

import RedisMock from 'ioredis-mock';
import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { Battle, Player, PlayerTank } from '../../../../../generated';
import type { PrismaService } from '../../../../core';
import type { VehicleCatalogService } from '../../../reference';
import type { NotificationService } from '../notification.service';

import { MARKS_WATCH } from '../../config';
import { MarksWatchService } from '../marks-watch.service';

const battle = ({ id, marks, minute }: { id: string; marks: number; minute: number }) =>
  mock<Battle>({
    id,
    accountId: 7n,
    tankId: 1,
    marksOnGun: marks,
    startedAt: new Date(Date.UTC(2026, 8, 25, 12, minute)),
    receivedAt: new Date(Date.UTC(2026, 8, 25, 12, minute, 30))
  });

const createService = () => {
  const prisma = mockDeep<PrismaService>();
  const catalog = mock<VehicleCatalogService>();
  const notifications = mock<NotificationService>();
  const redis = new RedisMock();

  catalog.summary.mockResolvedValue(mock<VehicleSummary>({ name: 'T-34-85', shortName: 'T-34-85' }));
  prisma.player.findUnique.mockResolvedValue(mock<Player>({ nickname: 'Tanker' }));

  return { service: new MarksWatchService(prisma, catalog, notifications, redis), prisma, notifications, redis };
};

describe('MarksWatchService', () => {
  it('starts from now on the first run instead of replaying history', async () => {
    const { service, prisma, redis } = createService();

    await redis.del(MARKS_WATCH.cursorKey);

    expect(await service.run()).toBe(0);
    expect(await redis.get(MARKS_WATCH.cursorKey)).not.toBeNull();
    expect(prisma.battle.findMany).not.toHaveBeenCalled();
  });

  it('announces a new mark to the account and moves the cursor past the batch', async () => {
    const { service, prisma, notifications, redis } = createService();
    const rows = [battle({ id: 'b1', marks: 1, minute: 0 }), battle({ id: 'b2', marks: 2, minute: 5 })];

    await redis.set(MARKS_WATCH.cursorKey, new Date(Date.UTC(2026, 8, 25)).toISOString());
    prisma.battle.findMany.mockResolvedValue(rows);
    prisma.battle.findFirst.mockResolvedValue(null);
    prisma.playerTank.findUnique.mockResolvedValue(mock<PlayerTank>({ marksOnGun: 1 }));

    expect(await service.run()).toBe(1);

    expect(notifications.notifyAccount).toHaveBeenCalledWith(
      expect.objectContaining({ accountId: 7n, dedupeKey: 'moe-b2', notification: expect.objectContaining({ event: 'moeGained', marks: 2 }) })
    );

    expect(await redis.get(MARKS_WATCH.cursorKey)).toBe(rows[1]?.receivedAt.toISOString());
  });
});
