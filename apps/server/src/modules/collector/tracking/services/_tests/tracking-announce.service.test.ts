import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { Player } from '../../../../../../generated';
import type { PrismaService, WebhookEmitter } from '../../../../../core';

import { TrackingAnnounceService } from '../tracking-announce.service';

const createAnnounce = () => {
  const prisma = mockDeep<PrismaService>();
  const webhooks = mock<WebhookEmitter>();

  return { prisma, webhooks, announce: new TrackingAnnounceService(prisma, webhooks) };
};

const gained = { accountId: 1n, tankId: 10, marks: 2, previous: 1 };

describe('TrackingAnnounceService.announceMarks', () => {
  it('emits nothing when no mark was gained', async () => {
    const { webhooks, announce } = createAnnounce();

    await announce.announceMarks([]);

    expect(webhooks.emit).not.toHaveBeenCalled();
  });

  it('emits a mark.gained event addressed to the player and their clan', async () => {
    const { prisma, webhooks, announce } = createAnnounce();

    prisma.player.findUnique.mockResolvedValue(mock<Player>({ clanId: 7n, nickname: 'tanker' }));

    await announce.announceMarks([gained]);

    expect(webhooks.emit).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'mark.gained',
        subject: { accountIds: [1], clanIds: [7] },
        data: expect.objectContaining({ nickname: 'tanker', tankId: gained.tankId, marks: gained.marks, previousMarks: gained.previous })
      })
    );
  });

  it('still emits for an unknown player, without a clan or nickname', async () => {
    const { prisma, webhooks, announce } = createAnnounce();

    prisma.player.findUnique.mockResolvedValue(null);

    await announce.announceMarks([gained]);

    expect(webhooks.emit).toHaveBeenCalledWith(
      expect.objectContaining({ subject: { accountIds: [1], clanIds: [] }, data: expect.objectContaining({ nickname: null }) })
    );
  });
});

describe('TrackingAnnounceService.isSubscriber', () => {
  it('is false when no linked user holds an entitled subscription', async () => {
    const { prisma, announce } = createAnnounce();

    prisma.userLestaAccount.count.mockResolvedValue(0);

    expect(await announce.isSubscriber(1n)).toBe(false);
  });

  it('is true when a linked user holds an entitled subscription', async () => {
    const { prisma, announce } = createAnnounce();

    prisma.userLestaAccount.count.mockResolvedValue(1);

    expect(await announce.isSubscriber(1n)).toBe(true);
  });
});
