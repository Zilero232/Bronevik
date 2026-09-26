import { subHours } from 'date-fns';
import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { Follow, Player, WatchlistSettings } from '../../../../../generated';
import type { PrismaService } from '../../../../core';
import type { EntitlementsService } from '../../../billing';
import type { NotificationService } from '../../../notifications';
import type { PlayerActivityRow } from '../../watchlist.types';
import type { WatchlistActivityService } from '../watchlist-activity.service';

import { WATCHLIST_DIGEST_RUN } from '../../config';
import { WatchlistDigestService } from '../watchlist-digest.service';

const now = new Date('2026-09-26T10:05:00Z');

const settings = (fields: Partial<WatchlistSettings> = {}): WatchlistSettings => ({
  userId: 'u1',
  digest: 'daily',
  lastDigestAt: null,
  updatedAt: now,
  ...fields
});

const activityOf = (accountId: bigint, fields: Partial<PlayerActivityRow> = {}): [bigint, PlayerActivityRow] => [
  accountId,
  { accountId, battles: 0, wins: 0, damage: 0, lastBattleAt: null, marksGained: 0, ...fields }
];

const setup = () => {
  const prisma = mockDeep<PrismaService>();
  const entitlements = mockDeep<EntitlementsService>();
  const notifications = mockDeep<NotificationService>();
  const activity = mockDeep<WatchlistActivityService>();

  prisma.watchlistSettings.findMany.mockResolvedValue([settings()]);
  prisma.follow.findMany.mockResolvedValue([mock<Follow>({ targetId: 1n }), mock<Follow>({ targetId: 2n })]);
  prisma.player.findMany.mockResolvedValue([mock<Player>({ accountId: 1n, nickname: 'Known' })]);
  activity.activity.mockResolvedValue(new Map());
  entitlements.isPlus.mockResolvedValue(false);

  return { prisma, entitlements, notifications, activity, service: new WatchlistDigestService(prisma, entitlements, notifications, activity) };
};

describe('WatchlistDigestService.run', () => {
  it('sends nothing but still moves the window forward when nobody played', async () => {
    const { prisma, notifications, service } = setup();

    expect(await service.run(now)).toBe(0);
    expect(notifications.notify).not.toHaveBeenCalled();
    expect(prisma.watchlistSettings.update).toHaveBeenCalledWith({ where: { userId: 'u1' }, data: { lastDigestAt: now } });
  });

  it('sends a digest of the active players and counts it', async () => {
    const { activity, notifications, service } = setup();

    activity.activity.mockResolvedValue(new Map([activityOf(1n, { battles: 4, wins: 2 }), activityOf(2n)]));

    expect(await service.run(now)).toBe(1);

    expect(notifications.notify).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'u1', notification: expect.objectContaining({ event: 'watchlistDigest', activePlayers: 1 }) })
    );
  });

  it('names a player without a known nickname by account id', async () => {
    const { activity, notifications, service } = setup();

    activity.activity.mockResolvedValue(new Map([activityOf(2n, { marksGained: 1 })]));

    await service.run(now);

    expect(notifications.notify.mock.calls[0]?.[0]?.notification).toMatchObject({ top: [expect.objectContaining({ nickname: '2' })] });
  });

  it('dedupes digests within the same hour', async () => {
    const { activity, notifications, service } = setup();

    activity.activity.mockResolvedValue(new Map([activityOf(1n, { battles: 1 })]));

    await service.run(now);
    await service.run(new Date('2026-09-26T10:55:00Z'));

    const [first, second] = notifications.notify.mock.calls.map(([args]) => args.dedupeKey);

    expect(first).toBe(second);
  });

  it('covers activity since the previous digest', async () => {
    const { prisma, activity, service } = setup();
    const lastDigestAt = subHours(now, 24);

    prisma.watchlistSettings.findMany.mockResolvedValue([settings({ lastDigestAt })]);

    await service.run(now);

    expect(activity.activity).toHaveBeenCalledWith(expect.objectContaining({ since: lastDigestAt }));
  });

  it('covers one full period before the first digest', async () => {
    const { activity, service } = setup();

    await service.run(now);

    expect(activity.activity).toHaveBeenCalledWith(expect.objectContaining({ since: subHours(now, 24) }));
  });

  it('waits until a daily digest is due', async () => {
    const { prisma, activity, service } = setup();

    prisma.watchlistSettings.findMany.mockResolvedValue([settings({ lastDigestAt: subHours(now, 12) })]);

    expect(await service.run(now)).toBe(0);
    expect(activity.activity).not.toHaveBeenCalled();
    expect(prisma.watchlistSettings.update).not.toHaveBeenCalled();
  });

  it('downgrades an hourly digest to daily once Plus has lapsed', async () => {
    const { prisma, activity, service } = setup();

    prisma.watchlistSettings.findMany.mockResolvedValue([settings({ digest: 'hourly', lastDigestAt: subHours(now, 2) })]);

    await service.run(now);

    expect(activity.activity).not.toHaveBeenCalled();
  });

  it('keeps an hourly digest for a Plus user', async () => {
    const { prisma, entitlements, activity, service } = setup();

    entitlements.isPlus.mockResolvedValue(true);
    prisma.watchlistSettings.findMany.mockResolvedValue([settings({ digest: 'hourly', lastDigestAt: subHours(now, 2) })]);

    await service.run(now);

    expect(activity.activity).toHaveBeenCalled();
  });

  it('pages through every subscriber after a full batch', async () => {
    const { prisma, service } = setup();
    const fullPage = Array.from({ length: WATCHLIST_DIGEST_RUN.batchSize }, (_, index) => settings({ userId: `u${String(index).padStart(4, '0')}` }));

    prisma.watchlistSettings.findMany.mockResolvedValueOnce(fullPage).mockResolvedValueOnce([settings({ userId: 'z' })]);

    await service.run(now);

    expect(prisma.watchlistSettings.findMany).toHaveBeenCalledTimes(2);
    expect(prisma.watchlistSettings.findMany.mock.calls[1]?.[0]?.where).toMatchObject({ userId: { gt: fullPage.at(-1)?.userId } });
    expect(prisma.watchlistSettings.update).toHaveBeenCalledTimes(WATCHLIST_DIGEST_RUN.batchSize + 1);
  });

  it('stops after a short page', async () => {
    const { prisma, service } = setup();

    await service.run(now);

    expect(prisma.watchlistSettings.findMany).toHaveBeenCalledTimes(1);
  });
});
