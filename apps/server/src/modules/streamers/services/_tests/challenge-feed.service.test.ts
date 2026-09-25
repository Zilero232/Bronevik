import RedisMock from 'ioredis-mock';
import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { Battle, Challenge } from '../../../../../generated';
import type { PrismaService } from '../../../../core';
import type { NotificationService } from '../../../notifications';
import type { CatalogEntry } from '../../../reference/reference.types';
import type { ChatAnnouncerService } from '../chat-announcer.service';
import type { OverlayPublisherService } from '../overlay-publisher.service';
import type { StreamerStatsService } from '../streamer-stats.service';

import { Prisma, VehicleType } from '../../../../../generated';
import { VehicleCatalogService } from '../../../reference';
import { ChallengeFeedService } from '../challenge-feed.service';

const challenge: Challenge = {
  ...mock<Challenge>({ id: 'c1', streamerUserId: 's1', accountId: 7n, title: '3000 on LT', status: 'active' }),
  amount: new Prisma.Decimal(500),
  condition: { metric: 'damage', value: 3000, battles: 2, tankType: 'lightTank' },
  progress: { battles: 0, value: 0, battleIds: [], durationMinutes: 60 },
  acceptedAt: new Date(Date.UTC(2026, 8, 25, 12)),
  createdAt: new Date(Date.UTC(2026, 8, 25, 11))
};

const battle = ({ id, damageDealt }: { id: string; damageDealt: number }) =>
  mock<Battle>({
    id,
    tankId: 1,
    startedAt: new Date(Date.UTC(2026, 8, 25, 12, 5)),
    result: 'win',
    damageDealt,
    damageAssistedRadio: 0,
    damageAssistedTrack: 0,
    damageBlocked: 0,
    frags: 0,
    spotted: 0,
    xp: 0,
    survived: true,
    moePercent: null
  });

const lightTank = mock<CatalogEntry>({ summary: { tankId: 1, type: 'lightTank', tier: 10 }, dbType: VehicleType.lightTank });

const createService = () => {
  const prisma = mockDeep<PrismaService>();
  const catalog = mock<VehicleCatalogService>();
  const publisher = mock<OverlayPublisherService>();
  const announcer = mock<ChatAnnouncerService>();
  const stats = mock<StreamerStatsService>();
  const notifications = mock<NotificationService>();

  catalog.find.mockResolvedValue(lightTank);
  stats.text.mockResolvedValue('announcement');

  const service = new ChallengeFeedService(prisma, catalog, publisher, announcer, stats, notifications, new RedisMock());

  return { service, prisma, publisher, announcer, notifications };
};

describe('ChallengeFeedService.evaluate', () => {
  it('saves progress while the challenge is still running', async () => {
    const { service, prisma, announcer } = createService();

    prisma.battle.findMany.mockResolvedValue([battle({ id: 'b1', damageDealt: 1200 })]);

    expect(await service.evaluate({ challenge, now: new Date() })).toBe(false);

    expect(prisma.challenge.update).toHaveBeenCalledWith({
      where: { id: 'c1' },
      data: { progress: expect.objectContaining({ battles: 1, value: 1200, durationMinutes: 60 }) }
    });

    expect(announcer.announce).not.toHaveBeenCalled();
  });

  it('resolves a met challenge once and tells the chat, the overlay and the streamer', async () => {
    const { service, prisma, announcer, publisher, notifications } = createService();

    prisma.battle.findMany.mockResolvedValue([battle({ id: 'b1', damageDealt: 3500 })]);
    prisma.challenge.updateMany.mockResolvedValue({ count: 1 });

    expect(await service.evaluate({ challenge, now: new Date() })).toBe(true);

    expect(prisma.challenge.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'c1', status: 'active' }, data: expect.objectContaining({ status: 'succeeded', battleId: 'b1' }) })
    );

    expect(announcer.announce).toHaveBeenCalledWith({ streamerUserId: 's1', text: 'announcement' });
    expect(publisher.publish).toHaveBeenCalledWith(7n);

    expect(notifications.notify).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 's1',
        dedupeKey: 'challenge-c1',
        notification: expect.objectContaining({ event: 'challengeResolved', isSucceeded: true })
      })
    );
  });

  it('does not announce twice when another run resolved it first', async () => {
    const { service, prisma, announcer } = createService();

    prisma.battle.findMany.mockResolvedValue([battle({ id: 'b1', damageDealt: 3500 })]);
    prisma.challenge.updateMany.mockResolvedValue({ count: 0 });

    expect(await service.evaluate({ challenge, now: new Date() })).toBe(false);
    expect(announcer.announce).not.toHaveBeenCalled();
  });
});
